define(['app', '../services/API', '../directives/fm-layout-table', '../directives/fm-layout-tile'], function (app) {
    app.controller('FmContainerCtrl', ['$scope', '$filter', 'api', 'localStorageService', '$rootScope',
        function ($scope, $filter, api, localStorageService, $rootScope) {

            $scope.menuFoldersTree = '/partials/menu-folder-tree.html';
            $scope.contextMenuState = false;
            $scope.disabledMenuItem = true;
            $scope.disabledPaste = true;
            $scope.allSelected = false;

            function cancelSelected(data) {
                for (var i = 0; i < data.length; i++) {
                    data[i].selected = false;
                }
                $scope.allSelected = false;
                $scope.disabledMenuItem = true;
            };

            api.getJSONresponse('foldersTree').then(function (data) {
                $scope.foldersTree = data;
                $scope.tableData = data.content;
            });

            $scope.goToDirectory = function (obj) {
                if (obj.folder) {
                    cancelSelected($scope.tableData);
                    $scope.breadcrumbArr = obj.path.split('/').slice(2);
                    $scope.tableData = obj.content;
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
                    var nPath = obj.path.split('/');
                    var ind = nPath.length - 1;
                    nPath[ind] = obj.name;
                    obj.path = nPath.join('/');

                    (function pathReplacer(arr) {
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].folder) {
                                var np = arr[i].path.split('/');
                                np[ind] = obj.name;
                                arr[i].path = np.join('/');
                                pathReplacer(arr[i].content);
                            }
                        }
                    })(obj.content);

                } else {
                    return;
                }
            };

            $scope.cut = function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].selected);
                }
            };

            $scope.copy = function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].selected);
                }
            };

            $scope.compressed = function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].selected);
                }
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