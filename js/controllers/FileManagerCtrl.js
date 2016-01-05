define(['app', '../directives/fm-container'], function (app) {
    app.controller('FileManagerCtrl', ['$scope', '$rootScope', '$uibModal', 'localStorageService',
        function ($scope, $rootScope, $uibModal, localStorageService) {

            if (!localStorageService.get('fm')) {
                var settings = {
                    sidebar: true,
                    showFiles: true,
                    showExt: true,
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


            $scope.goHistoryBackward = function () {

            };

            $scope.goHistoryForward = function () {

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

                        $scope.saveSettings = function () {
                            localStorageService.set('fm', $rootScope.fmSettings);
                        };

                    }
                });
            };

            $scope.openUploadModal = function (size) {
                $uibModal.open({
                    size: size,
                    templateUrl: '/partials/upload-modal.html',
                    controller: function ($scope) {
                        $scope.closeModal = function () {
                            $scope.$close();
                        }
                    }
                });
            };

        }]);
});