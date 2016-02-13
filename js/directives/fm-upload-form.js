define(['app'], function (app) {

    app.directive('uploadBox', ['$rootScope', 'localStorageService', '$http',
        function ($rootScope, localStorageService, $http) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {

                    console.log(scope);

                    var upload = function (files) {
                        var data = new FormData();
                        angular.forEach(files, function (value) {
                            data.append("files[]", value);
                        });

                        // data.append("objectId", ngModel.$viewValue);

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
                    };

                    element.on('dragover', function (e) {
                        console.log(e);
                        e.preventDefault();
                        e.stopPropagation();
                    });
                    element.on('dragenter', function (e) {
                        console.log(e);
                        e.preventDefault();
                        e.stopPropagation();
                    });

                    element.on('drop', function (e) {
                        console.log(e);
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.dataTransfer) {
                            if (e.dataTransfer.files.length > 0) {
                                // upload(e.originalEvent.dataTransfer.files);
                            }
                        }
                        return false;
                    });

                }
            };
        }]);

});