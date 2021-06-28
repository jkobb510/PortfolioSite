"use strict";

exports.registerServiceWorker = function () {
  return process.env.GATSBY_IS_PREVIEW !== "true";
}; // only cache relevant resources for this page


var whiteListLinkRels = /^(stylesheet|preload)$/;
var prefetchedPathnames = [];

exports.onServiceWorkerActive = function (_ref) {
  var getResourceURLsForPathname = _ref.getResourceURLsForPathname,
      serviceWorker = _ref.serviceWorker;

  if (process.env.GATSBY_IS_PREVIEW === "true") {
    return;
  } // if the SW has just updated then clear the path dependencies and don't cache
  // stuff, since we're on the old revision until we navigate to another page


  if (window.___swUpdated) {
    serviceWorker.active.postMessage({
      gatsbyApi: "clearPathResources"
    });
    return;
  } // grab nodes from head of document


  var nodes = document.querySelectorAll("\n    head > script[src],\n    head > link[href],\n    head > style[data-href]\n  "); // get all resource URLs

  var headerResources = [].slice.call(nodes) // don't include preconnect/prefetch/prerender resources
  .filter(function (node) {
    return node.tagName !== "LINK" || whiteListLinkRels.test(node.getAttribute("rel"));
  }).map(function (node) {
    return node.src || node.href || node.getAttribute("data-href");
  }); // Loop over prefetched pages and add their resources to an array,
  // plus specify which resources are required for those paths.

  var prefetchedResources = [];
  prefetchedPathnames.forEach(function (path) {
    var resources = getResourceURLsForPathname(path);
    prefetchedResources.push.apply(prefetchedResources, resources);
    serviceWorker.active.postMessage({
      gatsbyApi: "setPathResources",
      path: path,
      resources: resources
    });
  }); // Loop over all resources and fetch the page component + JSON data
  // to add it to the SW cache.

  var resources = [].concat(headerResources, prefetchedResources);
  resources.forEach(function (resource) {
    // Create a prefetch link for each resource, so Workbox runtime-caches them
    var link = document.createElement("link");
    link.rel = "prefetch";
    link.href = resource;
    link.onload = link.remove;
    link.onerror = link.remove;
    document.head.appendChild(link);
  });
};

function setPathResources(path, getResourceURLsForPathname) {
  // do nothing if the SW has just updated, since we still have old pages in
  // memory which we don't want to be whitelisted
  if (window.___swUpdated) return;

  if ("serviceWorker" in navigator) {
    var _navigator = navigator,
        serviceWorker = _navigator.serviceWorker;

    if (serviceWorker.controller === null) {
      // if SW is not installed, we need to record any prefetches
      // that happen so we can then add them to SW cache once installed
      prefetchedPathnames.push(path);
    } else {
      var resources = getResourceURLsForPathname(path);
      serviceWorker.controller.postMessage({
        gatsbyApi: "setPathResources",
        path: path,
        resources: resources
      });
    }
  }
}

exports.onRouteUpdate = function (_ref2) {
  var location = _ref2.location,
      getResourceURLsForPathname = _ref2.getResourceURLsForPathname;
  var pathname = location.pathname.replace(__BASE_PATH__, "");
  setPathResources(pathname, getResourceURLsForPathname);

  if ("serviceWorker" in navigator && navigator.serviceWorker.controller !== null) {
    navigator.serviceWorker.controller.postMessage({
      gatsbyApi: "enableOfflineShell"
    });
  }
};

exports.onPostPrefetchPathname = function (_ref3) {
  var pathname = _ref3.pathname,
      getResourceURLsForPathname = _ref3.getResourceURLsForPathname;
  setPathResources(pathname, getResourceURLsForPathname);
};