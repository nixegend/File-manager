"use strict";

define([
    'app',
    '../services/fm-api',
    '../directives/fm-layout-table',
    '../directives/fm-layout-tile',
    '../directives/fm-context-menu'
], function (app) {
    app.controller('FmContainerCtrl', ['$scope', '$filter', 'fmAPI', 'localStorageService', '$rootScope',
        function ($scope, $filter, fmAPI, localStorageService, $rootScope) {

            var def = $rootScope.def;

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

        }]);
});