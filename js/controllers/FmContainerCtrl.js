define(['app', '../services/API', '../directives/fm-layout-table', '../directives/fm-layout-tile'], function (app) {
    app.controller('FmContainerCtrl', ['$scope', '$filter', 'api', 'localStorageService', '$rootScope',
        function ($scope, $filter, api, localStorageService, $rootScope) {

            var sortArr = [
                { name: 'Name', option: 'name' },
                { name: 'Type', option: 'ext' },
                { name: 'Size', option: 'size' },
                { name: 'Date', option: 'date' }
            ];

            $scope.menuFoldersTree = '/partials/menu-folder-tree.html';
            $scope.contextMenuState = false;
            $scope.disabledMenuItem = true;
            $scope.disabledPaste = true;
            $scope.allSelected = false;
            $scope.tempCopyCutArr = [];
            $scope.criteria = null;
            $scope.reverse = true;
            $scope.selectedOption = sortArr[0];
            $scope.sortOptions = sortArr;

            api.getJSONresponse('foldersTree').then(function (data) {
                $scope.foldersTree = data;
                $scope.currentDir = data;
                $scope.tableData = data.content;
            });

            function cancelSelected(data, disParam) {
                for (var i = 0; i < data.length; i++) {
                    data[i].selected = false;
                }

                if (!disParam) {
                    $scope.allSelected = false;
                    $scope.disabledMenuItem = true;
                }
            };

            function cutCopyActions(data, callback) {
                var temp = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].selected) {
                        temp.push(angular.copy(data[i]));
                    }
                }

                if (typeof (callback) == "function") callback(temp);
            };

            function replacePathName(o, j, nPath) {
                var np = o.path.split('/');
                np[j] = nPath;
                o.path = np.join('/');
            };

            function deepPathNameChanger(current, nested) {
                for (var i = 0; i < nested.length; i++) {
                    if (nested[i].folder) {
                        nested[i].path = current.path + '/' + nested[i].name;
                        deepPathNameChanger(nested[i], nested[i].content);
                    } else {
                        nested[i].path = current.path;
                    }
                }
            };

            function changeTheSameName(source, dest, callback) {
                for (var i = 0; i < source.length; i++) {
                    for (var k = 0; k < dest.length; k++) {

                        if (source[i].folder && source[i].name == dest[k].name) {
                            source[i].name = '+' + source[i].name;
                            $scope.renameDone(source[i]);
                        } else {
                            if (source[i].name + source[i].ext == dest[k].name + dest[k].ext) {
                                source[i].name = '+' + source[i].name;
                            }
                        }

                    }
                }

                if (typeof (callback) == "function") callback(source);
            };

            function raplaceAllPathNames(current, nested, callback) {
                var temp = [];
                for (var i = 0; i < nested.length; i++) {

                    if (nested[i].folder) {
                        nested[i].path = current.path + '/' + nested[i].name;
                        deepPathNameChanger(nested[i], nested[i].content);
                    } else {
                        nested[i].path = current.path;
                    }

                    temp.push(nested[i]);
                }
                if (typeof (callback) == "function") callback(temp);
            };

            $scope.sortOrder = function (criteria) {
                $scope.reverse = ($scope.criteria === criteria) ? !$scope.reverse : false;
                $scope.criteria = criteria;
            };

            $scope.setSortOption = function (obj) {
                $scope.selectedOption = obj;
                $scope.sortOrder(obj.option);
            };

            $scope.goToDirectory = function (obj) {
                if (obj.folder) {
                    cancelSelected($scope.tableData);
                    $scope.breadcrumbArr = obj.path.split('/').slice(2);
                    $scope.tableData = obj.content;
                    $scope.currentDir = obj;
                    if (obj.storage) $scope.breadcrumbArr = [];
                }
            };

            $scope.breadcrumbWalker = function (index, last) {
                if (last) return;
                var destArr = $scope.breadcrumbArr.slice(0, index + 1);
                var tree = $scope.foldersTree;

                for (var i = 0; i < index + 1; i++) {
                    tree = $filter('filter')(tree.content, { name: destArr[i] })[0];
                    if (i == index) $scope.goToDirectory(tree);
                }
            };

            $scope.toggleLevelBelow = function (obj) {
                obj.open = !obj.open;
            };

            $scope.contextMenuBtn = function () {
                $scope.contextMenuState = !$scope.contextMenuState;
                $scope.$broadcast('countEventBoxesInRow');
            };

            $scope.renderFileName = function (fName, ext) {
                if (ext && $rootScope.fmSettings.showExt) {
                    return (fName != '.') ? fName + '.' + ext : '.' + ext;
                } else {
                    return fName;
                }
            };

            $scope.selectAll = function (data) {
                for (var i = 0; i < data.length; i++) {
                    data[i].selected = !$scope.allSelected;
                }
                $scope.allSelected = !$scope.allSelected;
                $scope.disabledMenuItem = !$scope.allSelected;
            };

            $scope.selectThis = function (item) {
                item.selected = !item.selected;
                var arr = $filter('filter')($scope.tableData, { selected: true });
                $scope.disabledMenuItem = (arr.length <= 0) ? true : false;
                if (arr.length <= 0) $scope.allSelected = false;
                if (arr.length == $scope.tableData.length) $scope.allSelected = true;
            };

            $scope.rename = function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].selected) data[i].rename = true;
                }
            };

            $scope.renameDone = function (obj) {
                if (obj.folder) {
                    var ind = obj.path.split('/').length - 1;
                    replacePathName(obj, ind, obj.name);
                    (function pathReplacer(dir, arr) {
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].folder) {
                                replacePathName(arr[i], ind, obj.name);
                                pathReplacer(arr[i], arr[i].content);
                            } else {
                                arr[i].path = dir.path;
                            }
                        }
                    })(obj, obj.content);
                }
            };

            $scope.paste = function (obj) {
                raplaceAllPathNames(obj, $scope.tempCopyCutArr, function (arr) {
                    $scope.disabledPaste = true;
                    changeTheSameName(arr, obj.content, function (changedArr) {
                        obj.content.push.apply(obj.content, changedArr);
                    });
                    $scope.tempCopyCutArr = [];
                });
            };

            $scope.cut = function (data) {
                cutCopyActions(data, function (arr) {
                    $scope.remove(data);
                    $scope.tempCopyCutArr = arr;
                    cancelSelected(arr);
                    $scope.disabledPaste = false;
                });
            };

            $scope.copy = function (data) {
                cutCopyActions(data, function (arr) {
                    $scope.tempCopyCutArr = arr;
                    cancelSelected(arr, true);
                    $scope.disabledPaste = false;
                });
            };

            $scope.compressed = function (data) {

                // console.log($scope.foldersTree.content);
                console.log($scope.tableData);

                // for (var i = 0; i < data.length; i++) {
                //     if (data[i].selected);
                // }
            };

            $scope.download = function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].selected);
                }
            };

            $scope.remove = function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].selected) data.splice(i--, 1);
                }
                $scope.allSelected = false;
                $scope.disabledMenuItem = true;
            };

            $scope.getDocSize = function (fSize) {
                return api.convertToKb(Math.ceil(fSize / 1024));
            };

            $scope.getFolderSize = function (obj) {
                obj.size = api.getSumSizes(obj.content);
            };

        }]);
});