"use strict";

define(['app', '../services/fm-api', '../directives/fm-upload-form'], function (app) {
    app.controller('FmHeaderCtrl', ['$scope', '$filter', '$rootScope', '$uibModal', 'fmAPI', 'localStorageService',
        function ($scope, $filter, $rootScope, $uibModal, fmAPI, localStorageService) {

            $scope.newDir = {
                data: [],

                add: function (obj) {
                    this.data.unshift({
                        content: [],
                        date: $filter('date')(new Date(), "MM/dd/yyyy"),
                        time: $filter('date')(new Date(), "h:mm:ss' 'a"),
                        isDir: true,
                        name: "New Folder",
                        path: obj.path + "/",
                        size: 0
                    });
                },

                remove: function (index) {
                    this.data.splice(index, 1);
                },

                create: function (obj, index) {
                    fmAPI.checkSimilarNames(obj.content, this.data[index].name, function (exist) {
                        if (exist) {
                            alert('The folder "' + $scope.newDir.data[index].name + '" already exists');
                        } else {
                            var dir = $scope.newDir.data.splice(index, 1)[0];
                            dir.path += dir.name;
                            obj.content.push(dir);
                            $scope.$broadcast('runSetBoxWidth', true);
                        }
                    });
                }
            };

            var history = $scope.history = {
                step: 0,
                data: [],
                btnBackward: true,
                btnForward: true,

                goBackward: function () {
                    this.step--;

                    if (this.step > 0) {
                        this.step = (this.step == this.data.length - 1) ? this.step - 1 : this.step;
                        $scope.objClickEventAction(this.data[this.step], true);
                        this.btnForward = false;
                    } else {
                        this.step = 0;
                        this.btnBackward = true;
                        $scope.objClickEventAction(this.data[this.step], true);
                    }
                },

                goForward: function () {
                    this.step++;

                    if (this.step < this.data.length - 1) {
                        $scope.objClickEventAction(this.data[this.step], true);
                        this.btnBackward = false;
                    } else {
                        this.btnForward = true;
                        $scope.objClickEventAction(this.data[this.step], true);
                        this.step = this.data.length;
                    }
                }
            };

            $scope.objClickEventAction = function (obj, stateHistory) {
                if (obj.isDir) {

                    if (!stateHistory) {
                        history.data.push(obj);
                        history.btnBackward = false;
                        history.btnForward = true;
                        history.step = history.data.length;
                    }

                    fmAPI.cancelSelected($scope.currentDir.content, function () {
                        $scope.currentDir = obj;
                        $scope.newDir.data = [];
                    });

                    $scope.writeNewPathState = false;
                    $scope.breadcrumbArr = (obj.storage) ? [] : obj.path.split('/').slice(2);
                } else {

                }
            };

            $scope.breadcrumbWalker = function (index, last) {
                if (!last) {
                    var destArr = $scope.breadcrumbArr.slice(0, index + 1);
                    var obj = $scope.foldersTree;

                    for (var i = 0; i < index + 1; i++) {
                        obj = $filter('filter')(obj.content, { name: destArr[i] })[0];
                        if (i === index) $scope.objClickEventAction(obj);
                    }
                }
            };

            $scope.applyNewPath = function (obj) {
                $scope.writeNewPathState = !$scope.writeNewPathState;

                if ($scope.writeNewPathState) {
                    if ($scope.breadcrumbArr && $scope.breadcrumbArr.length > 0) {
                        obj.path = $scope.breadcrumbArr.join('/');
                    }
                } else if (obj.path) {
                    console.log(obj.path.split('/'));

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
                            sp: $rootScope.fmSettings,
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
                    templateUrl: '/partials/fm-upload-form.html'
                });
            };

        }]);
});