"use strict";

define([
    'app',
    '../directives/fm-header',
    '../directives/fm-container'
], function (app) {
    app.controller('FileManagerCtrl', ['$scope', '$rootScope', 'localStorageService',
        function ($scope, $rootScope, localStorageService) {

            if (!localStorageService.get('fm')) {

                var settings = {
                    sidebar: true,
                    showExt: true,
                    showTypeCol: true,
                    showSizeCol: true,
                    showDateCol: true,
                    sidebarWidth: '20',
                    contentWidth: '80',
                    filesInSidebar: false,
                    layoutView: 'table'
                };

                localStorageService.set('fm', settings);
                $rootScope.fmSettings = settings;
            } else {
                $rootScope.fmSettings = localStorageService.get('fm');
            };

            var sortArr = [
                { name: 'Name', option: 'name' },
                { name: 'Type', option: 'ext' },
                { name: 'Size', option: 'size' },
                { name: 'Date', option: 'date' }
            ];

            $rootScope.def = {
                menuFoldersTree: '/partials/fm-menu-folder-tree.html',
                contextMenuState: false,
                disabledMenuItem: true,
                disabledPaste: true,
                allSelected: false,
                tempCopyCutArr: [],
                criteria: null,
                reverse: true,
                selectedOption: sortArr[0],
                sortOptions: sortArr
            };

        }]);
});