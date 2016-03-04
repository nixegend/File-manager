"use strict";

define(['app', '../services/fm-api'], function (app) {
    app.controller('FmContextMenuCtrl', ['$scope', '$filter', 'fmAPI', 'localStorageService', '$rootScope',
        function ($scope, $filter, fmAPI, localStorageService, $rootScope) {

            var def = $rootScope.def;

            $scope.menu = {

                paste: function (obj) {
                    var tempArrLg = def.tempCopyCutArr.length;

                    for (var i = 0; i < tempArrLg; i++) {
                        var item = def.tempCopyCutArr[i];

                        fmAPI.checkSimilarNames(obj.content, item.name, function (exist) {
                            // TODO: create deep 'watcher' for similar names
                            if (exist) item.name = item.name + '-COPY';
                            if (tempArrLg == i + 1) {
                                fmAPI.raplacePath(obj, def.tempCopyCutArr, function (changedArr) {
                                    def.disabledPaste = true;
                                    obj.content.push.apply(obj.content, changedArr);
                                    def.tempCopyCutArr = [];
                                    fmAPI.cancelSelected(obj.content);
                                });
                            }
                        });
                    }
                },

                cut: function (data) {
                    fmAPI.cutCopyActions(data, function (arr) {
                        def.tempCopyCutArr = arr;
                        fmAPI.cancelSelected(arr, function () {
                            def.disabledMenuItem = true;
                            def.disabledPaste = false;
                            fmAPI.removeSelectedItems(data);
                        });
                    }, 'cut');
                },

                copy: function (data) {
                    fmAPI.cutCopyActions(data, function (arr) {
                        def.tempCopyCutArr = arr;
                        fmAPI.cancelSelected(arr, function () {
                            def.disabledMenuItem = true;
                            def.disabledPaste = false;
                        });
                    }, 'copy');
                },

                selectAll: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].selected = !def.allSelected;
                    }
                    def.allSelected = !def.allSelected;
                    def.disabledMenuItem = !def.allSelected;
                },

                rename: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].selected && !data[i].rename) {
                            data[i].newName = data[i].name;
                            data[i].rename = true;
                        }
                    }
                },

                compressed: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        // if (data[i].selected); TODO
                    }
                },

                download: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        // if (data[i].selected); TODO
                    }
                },

                remove: function (data) {
                    fmAPI.removeSelectedItems(data);
                    def.allSelected = false;
                    def.disabledMenuItem = true;
                }

            };

        }]);
});