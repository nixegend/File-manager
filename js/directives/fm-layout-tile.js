define(['app', './on-finish-render', '../controllers/FmTileLayoutCtrl'], function (app) {
    app.directive('fmTileLayout', [function () {
        return {
            restrict: 'E',
            replace: true,
            controller: 'FmTileLayoutCtrl',
            templateUrl: '/partials/layout-tile.html',
            link: function (scope, element, attr) {

                function setBoxWidth() {
                    var numOfBoxes = Math.ceil(element[0].offsetWidth / 300) - 1;
                    if (numOfBoxes != scope.boxesInRow && numOfBoxes >= 1) {
                        scope.boxesInRow = numOfBoxes;

                        var boxWidth = 100 / numOfBoxes,
                            boxes = element[0].children;

                        for (var i = 0; i < boxes.length; i++) {
                            boxes[i].style.width = boxWidth + '%';
                        }
                    }
                };

                scope.$on('ngRepeatFinished', setBoxWidth);
                window.addEventListener('resize', setBoxWidth, true);
                scope.$on('contentResizeEvent', setBoxWidth);
            }
        };
    }]);
});