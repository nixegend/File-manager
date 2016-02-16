define(['app', '../services/API', '../directives/fm-upload-form', '../directives/fm-container'], function (app) {
    app.controller('FileManagerCtrl', ['$scope', 'api', '$rootScope', '$uibModal', 'localStorageService',
        function ($scope, api, $rootScope, $uibModal, localStorageService) {

            if (!localStorageService.get('fm')) {
                var settings = {
                    sidebar: true,
                    showFiles: true,
                    showExt: true,
                    showTypeCol: true,
                    showSizeCol: true,
                    showDateCol: true,
                    sidebarWidth: '20',
                    contentWidth: '80',
                    filesInSidebar: false,
                    layoutView: 'table'
                };

                localStorageService.set('fm', settings);
                $rootScope.fmSettings = settings;
            } else {
                $rootScope.fmSettings = localStorageService.get('fm');
            };

            function checkSimilarNames(obj, callback) {
                var thisDir = $scope.currentDir.content,
                    similarName = false;

                for (var i = 0; i < thisDir.length; i++) {
                    if (thisDir[i].folder && thisDir[i].name == obj.name) {
                        similarName = true;
                        break;
                    }
                }

                if (typeof (callback) == "function") callback(similarName);
            };


            $scope.addNewFolder = function (thisDir) {
                var newDir = api.folderCreator(thisDir.path, api.getTodayDate());
                $scope.newFolderData.unshift(newDir);
            };

            $scope.createNewFolder = function (index) {
                checkSimilarNames($scope.newFolderData[index], function (similar) {
                    if (similar) {
                        alert('A folder "' + $scope.newFolderData[index].name + '" already exists');
                    } else {
                        var folder = $scope.newFolderData.splice(index, 1)[0];
                        $scope.currentDir.content.push(folder);
                        $scope.$broadcast('runSetBoxWidth', true);
                    }
                });
            };

            $scope.removeNewFolder = function (index) {
                $scope.newFolderData.splice(index, 1);
            };

            $scope.goHistoryBackward = function () {
                $scope.step--;

                if ($scope.step > 0) {
                    $scope.step = ($scope.step == $scope.historyArr.length - 1) ? $scope.step - 1 : $scope.step;
                    $scope.goToDirectory($scope.historyArr[$scope.step], true);
                    $scope.disabledForward = false;
                } else {
                    $scope.step = 0;
                    $scope.disabledBackward = true;
                    $scope.goToDirectory($scope.historyArr[$scope.step], true);
                }
            };

            $scope.goToHomeDirectory = function (data) {
                $scope.goToDirectory(data, true);
            };

            $scope.goHistoryForward = function () {
                $scope.step++;

                if ($scope.step < $scope.historyArr.length - 1) {
                    $scope.goToDirectory($scope.historyArr[$scope.step], true);
                    $scope.disabledBackward = false;
                } else {
                    $scope.disabledForward = true;
                    $scope.goToDirectory($scope.historyArr[$scope.step], true);
                    $scope.step = $scope.historyArr.length;
                }
            };

            $scope.layoutSwitcher = function () {
                localStorageService.set('fm', $rootScope.fmSettings);
            };

            $scope.openSettingsMmodal = function (size) {
                $uibModal.open({
                    size: size,
                    templateUrl: '/partials/fm-settings-form.html',
                    controller: function ($rootScope, $scope, localStorageService) {

                        $scope.settings = {
                            sp : $rootScope.fmSettings,
                            showHideSidebar: function () {
                                this.sp.sidebar = !this.sp.sidebar;
                                this.sp.contentWidth = this.sp.sidebar ? 100 - this.sp.sidebarWidth : 100;
                            },
                            showHideFilesInSidebar: function () {
                                this.sp.showFiles = !this.sp.showFiles;
                            },
                            showHideFilesExtension: function () {
                                this.sp.showExt = !this.sp.showExt;
                            },
                            showHideTableColumn: function (col) {
                                switch (col) {
                                    case 'type': this.sp.showTypeCol = !this.sp.showTypeCol; break;
                                    case 'size': this.sp.showSizeCol = !this.sp.showSizeCol; break;
                                    case 'date': this.sp.showDateCol = !this.sp.showDateCol; break;
                                }
                            },
                            saveSettings: function () {
                                localStorageService.set('fm', $rootScope.fmSettings);
                                $scope.$close();
                            }
                        };

                    }
                });
            };

            $scope.openUploadFormModal = function (size) {
                $uibModal.open({
                    size: size,
                    templateUrl: '/partials/fm-upload-form.html',
                    controller: function ($scope) {

                    }
                });
            };

        }]);
});