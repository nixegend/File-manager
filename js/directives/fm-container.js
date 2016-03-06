"use strict";

define(['app', '../controllers/FmContainerCtrl'], function (app) {
    app.directive('fmContainer', ['$rootScope', 'localStorageService', '$timeout',
        function ($rootScope, localStorageService, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                controller: 'FmContainerCtrl',
                templateUrl: '/partials/fm-container.html',
                link: function (scope, element, attr) {

                    scope.dragResizer = function (e) {
                        var eleOffsetLeft = element[0].offsetLeft;
                        var eleWidth = element[0].offsetWidth;

                        angular.element(document).on('mousemove', function (e) {
                            var leftColWidth = e.pageX - eleOffsetLeft;
                            var pos = leftColWidth * 100 / eleWidth;
                            var contPxWidth = eleWidth - leftColWidth;

                            if (leftColWidth <= 100 || contPxWidth <= 320) return false;

                            $timeout(function () {
                                $rootScope.fmSettings.sidebarWidth = pos;
                                $rootScope.fmSettings.contentWidth = 100 - pos;
                            });

                            scope.$broadcast('runSetBoxWidth');
                            e.preventDefault();
                        });

                        angular.element(document).on('mouseup', function () {
                            angular.element(document).unbind('mouseup mousemove');
                            localStorageService.set('fm', $rootScope.fmSettings);
                        });

                        return false;
                    };

                }
            };
        }]);

});