define(['app', '../controllers/FmContainerCtrl'], function (app) {

    app.directive('fmContainer', ['$rootScope', 'localStorageService', function ($rootScope, localStorageService) {
        return {
            restrict: 'E',
            replace: true,
            controller: 'FmContainerCtrl',
            templateUrl: '/partials/fm-container.html',
            link: function (scope, element, attr) {

                var header = document.querySelector('.fm-header');

                var fmUI = {
                    sidebar: document.querySelector('.fm-sidebar'),
                    content: document.querySelector('.fm-content'),
                    eleOffsetLeft: element[0].offsetLeft,
                    eleWidth: element[0].offsetWidth
                };

                element[0].style.height = window.innerHeight - header.offsetHeight + 'px';

                scope.dragResizer = function (e) {
                    var thisLeftColOffset = fmUI.sidebar.offsetLeft;

                    angular.element(document).on('mousemove', function (e) {
                        var leftColWidth = (e.pageX - fmUI.eleOffsetLeft) - thisLeftColOffset;
                        var pos = leftColWidth * 100 / fmUI.eleWidth;

                        if (leftColWidth <= 100) return;

                        $rootScope.fmSettings.sidebarWidth = pos;
                        $rootScope.fmSettings.contentWidth = 100 - pos;

                        fmUI.sidebar.style.width = pos + '%';
                        fmUI.content.style.width = 100 - pos + '%';

                        e.preventDefault();
                    });

                    angular.element(document).on('mouseup', function () {
                        angular.element(document).unbind('mouseup mousemove');
                        localStorageService.set('fm', $rootScope.fmSettings);
                    });

                    return false;
                };

                window.addEventListener('resize', function () {
                    fmUI.eleWidth = element[0].offsetWidth;
                    fmUI.eleOffsetLeft = element[0].offsetLeft;
                    element[0].style.height = window.innerHeight - header.offsetHeight + 'px';
                }, true);

            }
        };
    }]);

});