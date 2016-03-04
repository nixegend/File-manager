"use strict";

define(['app', './on-finish-render'], function (app) {
    app.directive('fmTileLayout', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/partials/fm-layout-tile.html',
            link: function (scope, element, attr) {

                function setBoxWidth(runState) {
                    var numOfBoxes = Math.ceil(element[0].offsetWidth / 300) - 1;
                    if (runState || numOfBoxes != scope.boxesInRow && numOfBoxes >= 1) {
                        scope.boxesInRow = numOfBoxes;
                        scope.boxWidth = 100 / numOfBoxes;
                        $timeout(function () {
                            var boxes = element[0].children,
                                b = boxes.length,
                                i = 0;
                            for (; i < b; i++) {
                                boxes[i].style.width = scope.boxWidth + '%';
                            }
                        }, 10);
                    }
                };

                scope.$on('runSetBoxWidth', setBoxWidth);
                window.addEventListener('resize', setBoxWidth, true);
            }
        };
    }]);
});