"use strict";

define(['app'], function (app) {

    app.directive('uploadBox', ['$timeout', '$rootScope', 'localStorageService', '$http',
        function ($timeout, $rootScope, localStorageService, $http) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {

                    scope.upload = [];

                    function uploader(files) {
                        var data = new FormData();

                        for (var i = 0; i < files.length; i++) {
                            data.append("files[]", files[i]);
                        }

                        console.log(data);
                        /*
                                                $http({
                                                    method: 'POST',
                                                    url: attrs.to,
                                                    data: data,
                                                    withCredentials: true,
                                                    headers: { 'Content-Type': undefined },
                                                    transformRequest: angular.identity
                                                }).success(function () {
                                                    console.log("Uploaded");
                                                }).error(function () {
                                                    console.log("Error");
                                                });
                        */



                        $timeout(function () {
                            scope.upload;
                        });
                    };


                    function addFileToList(fileList, callback) {
                        var arr = [];
                        for (var i = 0; i < fileList.length; i++) {
                            var obj = fileList[i];
                            var docName = obj.name.split('.');
                            obj['extType'] = docName.pop();
                            obj['newName'] = docName.join('.');
                            obj['progress'] = null;
                            obj['status'] = null;
                            obj['xhrRequest'] = null;

                            scope.upload.push(obj);
                            arr.push(obj);
                            console.log(scope.upload);
                        }

                        if (typeof (callback) == 'function') callback(arr);
                    };

                    element.on('dragover', function (e) {
                        // console.log(e);
                        element.addClass('active');
                        e.preventDefault();
                        e.stopPropagation();
                    });

                    element.on('dragenter', function (e) {
                        // console.log(e);
                        element.addClass('active');
                        e.preventDefault();
                        e.stopPropagation();
                    });

                    element.on('dragleave', function (e) {
                        // console.log(e);
                        element.removeClass('active');
                        e.preventDefault();
                        e.stopPropagation();
                    });

                    element.on('drop', function (e) {
                        console.log(e);
                        element.removeClass('active');
                        if (e.dataTransfer && e.dataTransfer.files.length > 0) {
                            addFileToList(e.dataTransfer.files, uploader);
                        }
                        e.preventDefault();
                        e.stopPropagation();
                    });

                }
            };
        }]);

});