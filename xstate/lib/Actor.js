"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toActorRef = exports.isSpawnedActor = exports.isActor = exports.createDeferredActor = exports.createInvocableActor = exports.createNullActor = void 0;
var utils_1 = require("./utils");
var serviceScope = require("./serviceScope");
function createNullActor(id) {
    return {
        id: id,
        send: function () { return void 0; },
        subscribe: function () { return ({
            unsubscribe: function () { return void 0; }
        }); },
        getSnapshot: function () { return undefined; },
        toJSON: function () { return ({
            id: id
        }); }
    };
}
exports.createNullActor = createNullActor;
/**
 * Creates a deferred actor that is able to be invoked given the provided
 * invocation information in its `.meta` value.
 *
 * @param invokeDefinition The meta information needed to invoke the actor.
 */
function createInvocableActor(invokeDefinition, machine, context, _event) {
    var _a;
    var invokeSrc = utils_1.toInvokeSource(invokeDefinition.src);
    var serviceCreator = (_a = machine === null || machine === void 0 ? void 0 : machine.options.services) === null || _a === void 0 ? void 0 : _a[invokeSrc.type];
    var resolvedData = invokeDefinition.data
        ? utils_1.mapContext(invokeDefinition.data, context, _event)
        : undefined;
    var tempActor = serviceCreator
        ? createDeferredActor(serviceCreator, invokeDefinition.id, resolvedData)
        : createNullActor(invokeDefinition.id);
    // @ts-ignore
    tempActor.meta = invokeDefinition;
    return tempActor;
}
exports.createInvocableActor = createInvocableActor;
function createDeferredActor(entity, id, data) {
    var tempActor = createNullActor(id);
    // @ts-ignore
    tempActor.deferred = true;
    if (utils_1.isMachine(entity)) {
        // "mute" the existing service scope so potential spawned actors within the `.initialState` stay deferred here
        var initialState_1 = (tempActor.state = serviceScope.provide(undefined, function () { return (data ? entity.withContext(data) : entity).initialState; }));
        tempActor.getSnapshot = function () { return initialState_1; };
    }
    return tempActor;
}
exports.createDeferredActor = createDeferredActor;
function isActor(item) {
    try {
        return typeof item.send === 'function';
    }
    catch (e) {
        return false;
    }
}
exports.isActor = isActor;
function isSpawnedActor(item) {
    return isActor(item) && 'id' in item;
}
exports.isSpawnedActor = isSpawnedActor;
function toActorRef(actorRefLike) {
    return __assign({ subscribe: function () { return ({ unsubscribe: function () { return void 0; } }); }, id: 'anonymous', getSnapshot: function () { return undefined; } }, actorRefLike);
}
exports.toActorRef = toActorRef;
