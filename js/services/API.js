define(['app'], function (app) {
    app.service('api', ['$http', '$q', function ($http, $q) {

        this.getJSONresponse = function (file) {
            var def = $q.defer();
            $http.get('/js/json/' + file + '.json').success(function (data, status, headers, config) {
                def.resolve(data);
            }).error(function (data, status, headers, config) {
                console.log(status);
                alert('Can not get ' + file + '.json');
                def.reject('Failed to get ' + file + '.json');
            });

            return def.promise;
        };

        return this;
    }]);
});