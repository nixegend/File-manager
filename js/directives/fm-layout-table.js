"use strict";

define(['app'], function (app) {
    app.directive('fmTableLayout', [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/partials/fm-layout-table.html'
        };
    }]);
});