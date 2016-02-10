define(['app', './on-finish-render', '../controllers/FmTileLayoutCtrl'], function (app) {
    app.directive('fmTileLayout', [function () {
        return {
            restrict: 'E',
            replace: true,
            controller: 'FmTileLayoutCtrl',
            templateUrl: '/partials/fm-layout-tile.html',
            link: function (scope, element, attr) {

                function setBoxWidth() {
                    var numOfBoxes = Math.ceil(element[0].offsetWidth / 300) - 1;
                    if (numOfBoxes != scope.boxesInRow && numOfBoxes >= 1) {
                        scope.boxesInRow = numOfBoxes;
                        scope.boxWidth = 100 / numOfBoxes;
                        var boxes = element[0].children,
                            b = boxes.length,
                            i = 0;
                        for (; i < b; i++) {
                            boxes[i].style.width = scope.boxWidth + '%';
                        }
                    }
                };

                scope.$on('tileRepeatFinished', setBoxWidth);
                window.addEventListener('resize', setBoxWidth, true);
                scope.$on('contentResizeEvent', setBoxWidth);
            }
        };
    }]);
});