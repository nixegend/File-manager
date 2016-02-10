define(['app', 'bootstrap', '../services/API', '../directives/fm-upload-form', '../directives/fm-container'], function (app) {
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

            $scope.addNewFolder = function (thisDir) {
                var newDir = api.folderCreator(thisDir.path, api.getTodayDate());
                $scope.newFolderData.unshift(newDir);
            };

            $scope.createNewFolder = function (index) {
                // console.log(newDir);
                $scope.newFolderData[index];
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
                    templateUrl: '/partials/settings-modal.html',
                    controller: function ($rootScope, $scope, localStorageService) {
                        var s = $rootScope.fmSettings;

                        $scope.closeModal = function () {
                            $scope.$close();
                        };

                        $scope.showHideSidebar = function () {
                            s.sidebar = !s.sidebar;
                            s.contentWidth = s.sidebar ? 100 - s.sidebarWidth : 100;
                        };

                        $scope.showHideFilesInSidebar = function () {
                            s.showFiles = !s.showFiles;
                        };

                        $scope.showHideFilesExtension = function () {
                            s.showExt = !s.showExt;
                        };

                        $scope.showHideTableColumn = function (col) {
                            switch (col) {
                                case 'type': s.showTypeCol = !s.showTypeCol; break;
                                case 'size': s.showSizeCol = !s.showSizeCol; break;
                                case 'date': s.showDateCol = !s.showDateCol; break;
                            }
                        };

                        $scope.saveSettings = function () {
                            localStorageService.set('fm', $rootScope.fmSettings);
                        };

                    }
                });
            };

            $scope.openUploadModal = function (size) {
                // $uibModal.open({
                //     size: size,
                //     templateUrl: '/partials/upload-modal.html',
                //     controller: function ($scope) {
                //         $scope.closeModal = function () {
                //             $scope.$close();
                //         }
                //     }
                // });
            };

            $scope.openNewFileModal = function (size) {
                $uibModal.open({
                    size: size,
                    templateUrl: '/partials/new-file-modal.html',
                    controller: function ($scope) {
                        $scope.closeModal = function () {
                            $scope.$close();
                        }
                    }
                });
            };

        }]);
});