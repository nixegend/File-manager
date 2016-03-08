require.config({
    paths: {
        'ngLocalStorage': '../bower_components/angular-local-storage/dist/angular-local-storage.min',
        'uiBootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'ngAnimate': '../bower_components/angular-animate/angular-animate.min',
        'ngRoute': '../bower_components/angular-route/angular-route.min',
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
        'angular': '../bower_components/angular/angular.min',
        'lodash': '../bower_components/lodash/dist/lodash.min',
        'jquery': '../bower_components/jquery/dist/jquery.min'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'lodash': {
            exports: '_'
        },
        'ngRoute': {
            deps: ['angular']
        },
        'ngLocalStorage': {
            deps: ['angular']
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'uiBootstrap': {
            deps: ['angular']
        },
        'ngAnimate': {
            deps: ['angular']
        }
    }
});