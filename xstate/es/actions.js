import { __assign, __read } from './_virtual/_tslib.js';
import { IS_PRODUCTION } from './environment.js';
import { toSCXMLEvent, isFunction, toEventObject, getEventType, isString, partition, updateContext, flatten, toArray, toGuard, evaluateGuard, warn, isArray } from './utils.js';
import { SpecialTargets, ActionTypes } from './types.js';
import { send as send$1, update, assign as assign$1, init, raise as raise$1, log as log$1, cancel as cancel$1, error as error$1, stop as stop$1, pure as pure$1, choose as choose$1 } from './actionTypes.js';
var initEvent = /*#__PURE__*/toSCXMLEvent({
  type: init
});

function getActionFunction(actionType, actionFunctionMap) {
  return actionFunctionMap ? actionFunctionMap[actionType] || undefined : undefined;
}

function toActionObject(action, actionFunctionMap) {
  var actionObject;

  if (isString(action) || typeof action === 'number') {
    var exec = getActionFunction(action, actionFunctionMap);

    if (isFunction(exec)) {
      actionObject = {
        type: action,
        exec: exec
      };
    } else if (exec) {
      actionObject = exec;
    } else {
      actionObject = {
        type: action,
        exec: undefined
      };
    }
  } else if (isFunction(action)) {
    actionObject = {
      // Convert action to string if unnamed
      type: action.name || action.toString(),
      exec: action
    };
  } else {
    var exec = getActionFunction(action.type, actionFunctionMap);

    if (isFunction(exec)) {
      actionObject = __assign(__assign({}, action), {
        exec: exec
      });
    } else if (exec) {
      var actionType = exec.type || action.type;
      actionObject = __assign(__assign(__assign({}, exec), action), {
        type: actionType
      });
    } else {
      actionObject = action;
    }
  }

  Object.defineProperty(actionObject, 'toString', {
    value: function () {
      return actionObject.type;
    },
    enumerable: false,
    configurable: true
  });
  return actionObject;
}

var toActionObjects = function (action, actionFunctionMap) {
  if (!action) {
    return [];
  }

  var actions = isArray(action) ? action : [action];
  return actions.map(function (subAction) {
    return toActionObject(subAction, actionFunctionMap);
  });
};

function toActivityDefinition(action) {
  var actionObject = toActionObject(action);
  return __assign(__assign({
    id: isString(action) ? action : actionObject.id
  }, actionObject), {
    type: actionObject.type
  });
}
/**
 * Raises an event. This places the event in the internal event queue, so that
 * the event is immediately consumed by the machine in the current step.
 *
 * @param eventType The event to raise.
 */


function raise(event) {
  if (!isString(event)) {
    return send(event, {
      to: SpecialTargets.Internal
    });
  }

  return {
    type: raise$1,
    event: event
  };
}

function resolveRaise(action) {
  return {
    type: raise$1,
    _event: toSCXMLEvent(action.event)
  };
}
/**
 * Sends an event. This returns an action that will be read by an interpreter to
 * send the event in the next step, after the current step is finished executing.
 *
 * @param event The event to send.
 * @param options Options to pass into the send event:
 *  - `id` - The unique send event identifier (used with `cancel()`).
 *  - `delay` - The number of milliseconds to delay the sending of the event.
 *  - `to` - The target of this event (by default, the machine the event was sent from).
 */


function send(event, options) {
  return {
    to: options ? options.to : undefined,
    type: send$1,
    event: isFunction(event) ? event : toEventObject(event),
    delay: options ? options.delay : undefined,
    id: options && options.id !== undefined ? options.id : isFunction(event) ? event.name : getEventType(event)
  };
}

function resolveSend(action, ctx, _event, delaysMap) {
  var meta = {
    _event: _event
  }; // TODO: helper function for resolving Expr

  var resolvedEvent = toSCXMLEvent(isFunction(action.event) ? action.event(ctx, _event.data, meta) : action.event);
  var resolvedDelay;

  if (isString(action.delay)) {
    var configDelay = delaysMap && delaysMap[action.delay];
    resolvedDelay = isFunction(configDelay) ? configDelay(ctx, _event.data, meta) : configDelay;
  } else {
    resolvedDelay = isFunction(action.delay) ? action.delay(ctx, _event.data, meta) : action.delay;
  }

  var resolvedTarget = isFunction(action.to) ? action.to(ctx, _event.data, meta) : action.to;
  return __assign(__assign({}, action), {
    to: resolvedTarget,
    _event: resolvedEvent,
    event: resolvedEvent.data,
    delay: resolvedDelay
  });
}
/**
 * Sends an event to this machine's parent.
 *
 * @param event The event to send to the parent machine.
 * @param options Options to pass into the send event.
 */


function sendParent(event, options) {
  return send(event, __assign(__assign({}, options), {
    to: SpecialTargets.Parent
  }));
}
/**
 * Sends an update event to this machine's parent.
 */


function sendUpdate() {
  return sendParent(update);
}
/**
 * Sends an event back to the sender of the original event.
 *
 * @param event The event to send back to the sender
 * @param options Options to pass into the send event
 */


function respond(event, options) {
  return send(event, __assign(__assign({}, options), {
    to: function (_, __, _a) {
      var _event = _a._event;
      return _event.origin; // TODO: handle when _event.origin is undefined
    }
  }));
}

var defaultLogExpr = function (context, event) {
  return {
    context: context,
    event: event
  };
};
/**
 *
 * @param expr The expression function to evaluate which will be logged.
 *  Takes in 2 arguments:
 *  - `ctx` - the current state context
 *  - `event` - the event that caused this action to be executed.
 * @param label The label to give to the logged expression.
 */


function log(expr, label) {
  if (expr === void 0) {
    expr = defaultLogExpr;
  }

  return {
    type: log$1,
    label: label,
    expr: expr
  };
}

var resolveLog = function (action, ctx, _event) {
  return __assign(__assign({}, action), {
    value: isString(action.expr) ? action.expr : action.expr(ctx, _event.data, {
      _event: _event
    })
  });
};
/**
 * Cancels an in-flight `send(...)` action. A canceled sent action will not
 * be executed, nor will its event be sent, unless it has already been sent
 * (e.g., if `cancel(...)` is called after the `send(...)` action's `delay`).
 *
 * @param sendId The `id` of the `send(...)` action to cancel.
 */


var cancel = function (sendId) {
  return {
    type: cancel$1,
    sendId: sendId
  };
};
/**
 * Starts an activity.
 *
 * @param activity The activity to start.
 */


function start(activity) {
  var activityDef = toActivityDefinition(activity);
  return {
    type: ActionTypes.Start,
    activity: activityDef,
    exec: undefined
  };
}
/**
 * Stops an activity.
 *
 * @param actorRef The activity to stop.
 */


function stop(actorRef) {
  var activity = isFunction(actorRef) ? actorRef : toActivityDefinition(actorRef);
  return {
    type: ActionTypes.Stop,
    activity: activity,
    exec: undefined
  };
}

function resolveStop(action, context, _event) {
  var actorRefOrString = isFunction(action.activity) ? action.activity(context, _event.data) : action.activity;
  var resolvedActorRef = typeof actorRefOrString === 'string' ? {
    id: actorRefOrString
  } : actorRefOrString;
  var actionObject = {
    type: ActionTypes.Stop,
    activity: resolvedActorRef
  };
  return actionObject;
}
/**
 * Updates the current context of the machine.
 *
 * @param assignment An object that represents the partial context to update.
 */


var assign = function (assignment) {
  return {
    type: assign$1,
    assignment: assignment
  };
};
/**
 * Returns an event type that represents an implicit event that
 * is sent after the specified `delay`.
 *
 * @param delayRef The delay in milliseconds
 * @param id The state node ID where this event is handled
 */


function after(delayRef, id) {
  var idSuffix = id ? "#" + id : '';
  return ActionTypes.After + "(" + delayRef + ")" + idSuffix;
}
/**
 * Returns an event that represents that a final state node
 * has been reached in the parent state node.
 *
 * @param id The final state node's parent state node `id`
 * @param data The data to pass into the event
 */


function done(id, data) {
  var type = ActionTypes.DoneState + "." + id;
  var eventObject = {
    type: type,
    data: data
  };

  eventObject.toString = function () {
    return type;
  };

  return eventObject;
}
/**
 * Returns an event that represents that an invoked service has terminated.
 *
 * An invoked service is terminated when it has reached a top-level final state node,
 * but not when it is canceled.
 *
 * @param id The final state node ID
 * @param data The data to pass into the event
 */


function doneInvoke(id, data) {
  var type = ActionTypes.DoneInvoke + "." + id;
  var eventObject = {
    type: type,
    data: data
  };

  eventObject.toString = function () {
    return type;
  };

  return eventObject;
}

function error(id, data) {
  var type = ActionTypes.ErrorPlatform + "." + id;
  var eventObject = {
    type: type,
    data: data
  };

  eventObject.toString = function () {
    return type;
  };

  return eventObject;
}

function pure(getActions) {
  return {
    type: ActionTypes.Pure,
    get: getActions
  };
}
/**
 * Forwards (sends) an event to a specified service.
 *
 * @param target The target service to forward the event to.
 * @param options Options to pass into the send action creator.
 */


function forwardTo(target, options) {
  return send(function (_, event) {
    return event;
  }, __assign(__assign({}, options), {
    to: target
  }));
}
/**
 * Escalates an error by sending it as an event to this machine's parent.
 *
 * @param errorData The error data to send, or the expression function that
 * takes in the `context`, `event`, and `meta`, and returns the error data to send.
 * @param options Options to pass into the send action creator.
 */


function escalate(errorData, options) {
  return sendParent(function (context, event, meta) {
    return {
      type: error$1,
      data: isFunction(errorData) ? errorData(context, event, meta) : errorData
    };
  }, __assign(__assign({}, options), {
    to: SpecialTargets.Parent
  }));
}

function choose(conds) {
  return {
    type: ActionTypes.Choose,
    conds: conds
  };
}

function resolveActions(machine, currentState, currentContext, _event, actions) {
  var _a = __read(partition(actions, function (action) {
    return action.type === assign$1;
  }), 2),
      assignActions = _a[0],
      otherActions = _a[1];

  var updatedContext = assignActions.length ? updateContext(currentContext, _event, assignActions, currentState) : currentContext;
  var resolvedActions = flatten(otherActions.map(function (actionObject) {
    var _a;

    switch (actionObject.type) {
      case raise$1:
        return resolveRaise(actionObject);

      case send$1:
        var sendAction = resolveSend(actionObject, updatedContext, _event, machine.options.delays); // TODO: fix ActionTypes.Init

        if (!IS_PRODUCTION) {
          // warn after resolving as we can create better contextual message here
          warn(!isString(actionObject.delay) || typeof sendAction.delay === 'number', // tslint:disable-next-line:max-line-length
          "No delay reference for delay expression '" + actionObject.delay + "' was found on machine '" + machine.id + "'");
        }

        return sendAction;

      case log$1:
        return resolveLog(actionObject, updatedContext, _event);

      case choose$1:
        {
          var chooseAction = actionObject;
          var matchedActions = (_a = chooseAction.conds.find(function (condition) {
            var guard = toGuard(condition.cond, machine.options.guards);
            return !guard || evaluateGuard(machine, guard, updatedContext, _event, currentState);
          })) === null || _a === void 0 ? void 0 : _a.actions;

          if (!matchedActions) {
            return [];
          }

          var resolved = resolveActions(machine, currentState, updatedContext, _event, toActionObjects(toArray(matchedActions), machine.options.actions));
          updatedContext = resolved[1];
          return resolved[0];
        }

      case pure$1:
        {
          var matchedActions = actionObject.get(updatedContext, _event.data);

          if (!matchedActions) {
            return [];
          }

          var resolved = resolveActions(machine, currentState, updatedContext, _event, toActionObjects(toArray(matchedActions), machine.options.actions));
          updatedContext = resolved[1];
          return resolved[0];
        }

      case stop$1:
        {
          return resolveStop(actionObject, updatedContext, _event);
        }

      default:
        return toActionObject(actionObject, machine.options.actions);
    }
  }));
  return [resolvedActions, updatedContext];
}

export { after, assign, cancel, choose, done, doneInvoke, error, escalate, forwardTo, getActionFunction, initEvent, log, pure, raise, resolveActions, resolveLog, resolveRaise, resolveSend, resolveStop, respond, send, sendParent, sendUpdate, start, stop, toActionObject, toActionObjects, toActivityDefinition };