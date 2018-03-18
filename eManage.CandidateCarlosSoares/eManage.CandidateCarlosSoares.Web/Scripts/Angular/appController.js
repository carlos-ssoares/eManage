app.controller("eManageController", ['$scope', '$http', function ($scope, $http) {
    $scope.load = function () {
        //console.log('Loaded');
    }

    $scope.filterByName = function (user) {
        if (!$scope.name) {
            return true;
        } else {
            var keywords = $scope.name.toLowerCase().split(' ');

            for (var i in keywords) {
                var k = keywords[i];
                if (user.name.toLowerCase().indexOf(k) >= 0) {
                    return true;
                }
            }
            return false;
        }
    }

    $scope.loadUsers = function () {
        $http.get("/Home/GetAllUser").then(function (response) {
            $scope.users = response.data;
            //console.log($scope.users);
        });
        return $scope.users;
    }

    $scope.GetUser = function (userId) {
        $http.get("/Home/GetUserById?userId=" + userId).then(function (response) {
            $scope.users = response.data;
            //console.log($scope.users);
        });
        return $scope.users;
    }

    $scope.UpdateUser = function (pUser) {
        $scope.modelTitles = { 'Tittle': 'Update User' };
        $scope.uUser = pUser;
    }

    $scope.Delete = function (pUser) {
        $scope.uUser = pUser;
    }

    $scope.InsertUser = function () {
        $scope.modelTitles = { 'Tittle': 'Insert User' };
        $scope.uUser = { 'UserId': 0, 'Name': '', 'Age': '', 'Address': '' };
    }

    $scope.DeleteUser = function (pUser) {
        //console.log(pUser);
        $http({
            method: 'POST',
            url: '/Home/DelUser',

            data: {
                InputUser: pUser
            }

        }).then(function (response) {
            if (response.data.Success) {
                toastr.success(response.data.Message);

                angular.forEach($scope.users, function (obj, index) {
                    if (obj.$$hashKey === pUser.$$hashKey) {
                        $scope.users.splice(index, 1);
                        return;
                    };
                });
            }
            else {
                toastr.error(response.data.Message);
            }
        });
    }

    $scope.SaveUser = function (pUser) {
        if (pUser.Name == null || pUser.Name.trim() == '') {
            toastr.error('Field Name is required!');
            return false;
        }

        if (pUser.Age == null || pUser.Age < 1) {
            toastr.error('Field Age is required!');
            return false;
        }

        if (pUser.Age > 100) {
            toastr.error('Field Age has to be between 1 and 100!');
            return false;
        }

        var url = '';
        
        if(pUser.UserId == 0){
            url = '/Home/InsertUser';            
        }
        else {
            url = '/Home/UpdateUser';
        }

        $http({
            method: 'POST',
            url: url,

            data: {
                InputUser: pUser
            }

        }).then(function (response) {
            //console.log(response);

            if (response.data.Success) {
                toastr.success(response.data.Message);

                if (pUser.UserId == 0) {
                    pUser.UserId = response.data.objResult.UserId;
                    $scope.loadUsers();
                }
            }
            else {
                toastr.error(response.data.Message);
            }
        });
    }

}]);


