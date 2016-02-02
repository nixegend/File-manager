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

        this.getSumSizes = function (arrObj) {
            return (function sum(arr) {
                var s = 0;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].folder) {
                        s += sum(arr[i].content);
                    } else if (arr[i].file) {
                        s += arr[i].size;
                    }
                }
                return s;
            })(arrObj);
        };

        this.convertToKb = function (size) {
            var arr = [], k = 0;
            return (function getSize(s) {
                if (k == 3) {
                    arr.push((s % 10) + ',');
                    k = 0;
                } else {
                    arr.push(s % 10);
                }
                s = parseInt(s / 10);
                k++;
                return s ? getSize(s) : arr.reverse().join('');
            })(size);
        };

        return this;
    }]);
});