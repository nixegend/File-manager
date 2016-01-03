define([
	'angular',
	'ngRoute',
    'ngAnimate',
    'uiBootstrap',
    'ngLocalStorage'
	],	function(angular) {
	return angular.module('fileManager', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'LocalStorageModule']);
});