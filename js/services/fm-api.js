"use strict";

define(['app'], function (app) {
    app.service('fmAPI', ['$http', '$q', function ($http, $q) {

        this.getJSONresponse = function (file) {
            var def = $q.defer();
            $http.get('/js/json/' + file + '.json').success(function (data, status, headers, config) {
                def.resolve(data);
            }).error(function (data, status, headers, config) {
                console.log(status);
                alert('Can not get ' + file + '.json');
                def.reject('Failed to get ' + file + '.json');
            });

            return def.promise;
        };

        this.getSumSizes = function (arr) {
            var size = 0;
            for (var i = 0; i < arr.length; i++) {
                var o = arr[i];
                if (o.isDir) {
                    size += this.getSumSizes(o.content);
                } else if (!o.isDir) {
                    size += o.size;
                }
            }
            return size;
        };

        this.removeSelectedItems = function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].selected) data.splice(i--, 1);
            }
        };

        this.checkSimilarNames = function (thisObj, name, callback) {
            var result = false;

            for (var i = 0; i < thisObj.length; i++) {
                var o = thisObj[i];
                if ((!o.renameStateDone && o.isDir && o.name == name) ||
                    (!o.renameStateDone && !o.isDir && o.name + '.' + o.ext == name + '.' + o.ext)) {
                    result = true;
                    break;
                }
            }

            (callback || angular.noop)(result);
        };

        this.cutCopyActions = function (data, callback, command) {
            var temp = [];
            for (var i = 0; i < data.length; i++) {
                var o = data[i];
                if (o.selected) {
                    delete o.cutCopyState;
                    temp.push(angular.copy(o));
                    o.cutCopyState = command;
                }
            }

            (callback || angular.noop)(temp);
        };

        this.cancelSelected = function (data, callback) {
            for (var i = 0; i < data.length; i++) {
                delete data[i].selected;
            }

            (callback || angular.noop)();
        };

        this.raplacePath = function (currentObj, nestedDir, callback) {
            for (var i = 0; i < nestedDir.length; i++) {
                var o = nestedDir[i];
                if (o.isDir) {
                    o.path = currentObj.path + '/' + o.name;
                    this.raplacePath(o, o.content);
                } else {
                    o.path = currentObj.path;
                }
            }

            (callback || angular.noop)(nestedDir);
        };

        this.convertToKb = function (size) {
            var arr = [], k = 0;
            return (function getSize(s) {
                if (k == 3) {
                    arr.push((s % 10) + ',');
                    k = 0;
                } else {
                    arr.push(s % 10);
                }
                s = parseInt(s / 10);
                k++;
                return s ? getSize(s) : arr.reverse().join('');
            })(size);
        };

        return this;
    }]);
});