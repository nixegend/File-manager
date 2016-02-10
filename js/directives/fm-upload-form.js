define(['app'], function (app) {

    app.directive('fmUploadForm', ['$rootScope', 'localStorageService', function ($rootScope, localStorageService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/partials/fm-upload-form.html',
            link: function (scope, element, attr) {

            }
        };
    }]);

});