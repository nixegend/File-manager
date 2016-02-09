define(['app'], function (app) {
    app.directive('onFinishRenderItems', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) scope.$emit(attr.onFinishRenderItems);
            }
        }
    }]);
});