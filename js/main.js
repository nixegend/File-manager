require(['config'], function() {
    require([
        'angular',
        './app',
        './controllers/FileManagerCtrl'
    ], function(angular, app) {
        app.config(['$routeProvider', 'localStorageServiceProvider',
            function($routeProvider, localStorageServiceProvider) {
                localStorageServiceProvider
                    .setPrefix('langManager')
                    .setStorageType('localStorage');

                $routeProvider.otherwise({
                    redirectTo: '/file-manager'
                })
                    .when('/file-manager', {
                        templateUrl: '/partials/file-manager.html',
                        controller: 'FileManagerCtrl'
                    });

            }]);

        angular.element(document).ready(function() {
            angular.bootstrap(document, ['fileManager']);
        });

    });
});