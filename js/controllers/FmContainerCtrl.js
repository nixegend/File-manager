"use strict";

define(['app', '../services/fm-api', '../directives/fm-layout-table', '../directives/fm-layout-tile'], function (app) {
    app.controller('FmContainerCtrl', ['$scope', '$filter', 'fmAPI', 'localStorageService', '$rootScope',
        function ($scope, $filter, fmAPI, localStorageService, $rootScope) {

            var sortArr = [
                { name: 'Name', option: 'name' },
                { name: 'Type', option: 'ext' },
                { name: 'Size', option: 'size' },
                { name: 'Date', option: 'date' }
            ];

            var def = $scope.def = {
                menuFoldersTree: '/partials/fm-menu-folder-tree.html',
                contextMenuState: false,
                disabledMenuItem: true,
                disabledPaste: true,
                allSelected: false,
                tempCopyCutArr: [],
                criteria: null,
                reverse: true,
                selectedOption: sortArr[0],
                sortOptions: sortArr
            };

            fmAPI.getJSONresponse('foldersTree').then(function (data) {
                $scope.foldersTree = data;
                $scope.currentDir = data;
            });

            $scope.toggleLevelBelow = function (obj) {
                obj.open = !obj.open;
            };

            $scope.contextMenuBtn = function () {
                def.contextMenuState = !def.contextMenuState;
                if ($rootScope.fmSettings.layoutView == 'tile')
                    $scope.$broadcast('countEventBoxesInRow');
            };

            $scope.sortOrder = function (criteria) {
                def.reverse = (def.criteria === criteria) ? !def.reverse : false;
                def.criteria = criteria;
            };

            $scope.setSortOption = function (obj) {
                def.selectedOption = obj;
                $scope.sortOrder(obj.option);
            };

            $scope.renderFileName = function (name, ext) {
                if (ext && $rootScope.fmSettings.showExt) {
                    return (name != '.') ? name + '.' + ext : '.' + ext;
                } else {
                    return name;
                }
            };

            $scope.getDocSize = function (fSize) {
                return fmAPI.convertToKb(Math.ceil(fSize / 1024));
            };

            $scope.getFolderSize = function (obj) {
                obj.size = fmAPI.getSumSizes(obj.content);
                // TODO > save in DB
            };

            $scope.selectThis = function (obj, item) {
                item.selected = !item.selected;
                var arr = $filter('filter')(obj.content, { selected: true });
                def.disabledMenuItem = (arr.length <= 0) ? true : false;
                if (arr.length <= 0) def.allSelected = false;
                if (arr.length == obj.content.length) def.allSelected = true;
            }

            $scope.renameDone = function (obj, item) {

                function reset(o) {
                    delete o.rename;
                    delete o.newName;
                    delete o.selected;
                    delete o.renameStateDone;
                };

                if (item.newName != item.name) {
                    item.renameStateDone = true;
                    fmAPI.checkSimilarNames(obj.content, item.newName, function (exist) {
                        if (exist) {
                            alert('The name "' + item.newName + '" already exists');
                            item.renameStateDone = false;
                        } else {
                            item.name = item.newName;
                            fmAPI.raplacePath(obj, [item]);
                            reset(item);
                        }
                    });
                } else {
                    reset(item);
                }
            };

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