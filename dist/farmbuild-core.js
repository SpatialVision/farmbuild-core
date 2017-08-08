"use strict";

if (!angular) {
    var version = "1.3.15";
    console.error("farmbuild requires angular JS " + version + ", please include e.g. https://ajax.googleapis.com/ajax/libs/angularjs/" + version + "/angular.min.js ");
    throw new Error("FarmBuild requires angular " + version + ", please load it before the farmbuild.core module.");
}

angular.module("farmbuild.core", []);

window.farmbuild = {};

angular.injector([ "ng", "farmbuild.core" ]);

"use strict";

angular.module("farmbuild.core").factory("collections", function(validations, $log) {
    var collections = {}, _isDefined = validations.isDefined, _isArray = validations.isArray, _equals = validations.equals;
    function _byProperty(collection, property, value) {
        if (!_isArray(collection)) {
            return undefined;
        }
        if (!_isDefined(property)) {
            return undefined;
        }
        if (!_isDefined(value)) {
            return undefined;
        }
        var i = 0;
        for (i; i < collection.length; i++) {
            var item = collection[i];
            if (!item.hasOwnProperty(property)) {
                continue;
            }
            if (_equals(item[property], value)) {
                return item;
            }
        }
        return undefined;
    }
    function _add(collection, item, index) {
        if (_isDefined(index)) {
            collection.splice(index, 0, item);
        } else {
            collection.push(item);
        }
        return collection;
    }
    function _isEmpty(collections) {
        return collections.length === 0;
    }
    function _count(collection) {
        if (!angular.isArray(collection)) {
            return -1;
        }
        return collection.length;
    }
    function _at(collection, index) {
        return collection[index];
    }
    function _removeAt(collection, index) {
        if (!angular.isArray(collection)) {
            $log.warn("collection is not an array, returning as it is: %j", collection);
            return collection;
        }
        if (!_isDefined(index) || index < 0 || index > collection.length - 1) {
            $log.warn("index is out of range for the array, index: %s, collection.length: %s", index, collection.length);
            return collection;
        }
        collection.splice(index, 1);
        return collection;
    }
    function _remove(collections, item) {
        $log.info("removing item %s ", item);
        if (!_isDefined(item)) {
            return undefined;
        }
        angular.forEach(collections, function(i, index) {
            if (angular.equals(i, item)) {
                _removeAt(collections, index);
            }
        });
        return collections;
    }
    function _first(collection) {
        return collection[0];
    }
    function _last(collection) {
        var length = _count(collection);
        return collection[length - 1];
    }
    collections = {
        add: _add,
        at: _at,
        size: _count,
        byProperty: _byProperty,
        removeAt: _removeAt,
        remove: _remove,
        first: _first,
        last: _last,
        isEmpty: _isEmpty
    };
    return collections;
});

"use strict";

angular.module("farmbuild.core").factory("googleAnalytics", function($log, validations) {
    var googleAnalytics = {}, _isDefined = validations.isDefined, trackerName = "farmbuildTracker", trackingCode = "UA-62295166-1", src = ("https:" == document.location.protocol ? "https://" : "http://") + "www.google-analytics.com/analytics.js";
    (function(i, s, o, g, r, a, m) {
        i["GoogleAnalyticsObject"] = r;
        i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments);
        }, i[r].l = 1 * new Date();
        a = s.createElement(o), m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, "script", src, "ga");
    function sendPageView(values) {
        ga(trackerName + ".send", "pageview", values);
    }
    ga("create", trackingCode, "auto", {
        name: trackerName
    });
    googleAnalytics.track = function(apiName, clientName) {
        if (!_isDefined(apiName)) {
            $log.error("googleAnalytics.track apiName must be provided." + " Please specify you API name.");
            return;
        }
        if (!_isDefined(clientName)) {
            $log.error("googleAnalytics.track clientName must be provided." + " Please specify the registered client name.");
            return;
        }
        $log.info("googleAnalytics.track apiName: %s, clientName: %s", apiName, clientName);
        sendPageView({
            page: apiName,
            title: apiName,
            dimension4: apiName,
            dimension5: clientName
        });
    };
    return googleAnalytics;
});

"use strict";

angular.module("farmbuild.core").factory("validations", function($log) {
    var validations = {};
    validations.isPositiveNumberOrZero = function(value) {
        return typeof value !== "string" && !isNaN(parseFloat(value)) && isFinite(value) && parseFloat(value) >= 0;
    };
    validations.isPositiveNumber = function(value) {
        return validations.isPositiveNumberOrZero(value) && parseFloat(value) > 0;
    };
    validations.isAlphabet = function(value) {
        var regex = /^[A-Za-z]+$/gi;
        return regex.test(value);
    };
    validations.isAlphanumeric = function(value) {
        var regex = /^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9 _]*$/gi;
        return regex.test(value);
    };
    var isEmpty = function(data) {
        if (typeof data == "number" || typeof data == "boolean") {
            return false;
        }
        if (typeof data == "undefined" || data === null) {
            return true;
        }
        if (typeof data.length != "undefined") {
            return data.length == 0;
        }
        return false;
    };
    validations.isEmpty = isEmpty;
    validations.isDefined = angular.isDefined;
    validations.isArray = angular.isArray;
    validations.isObject = angular.isObject;
    validations.isString = angular.isString;
    validations.equals = angular.equals;
    return validations;
});