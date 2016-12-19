(function() {
    var joinroomController = function($scope, webSocketService, userInfoModel, $location) {
        $scope.roomnumber = '';
        var join = function() {
            if($scope.roomnumber>=1000 && $scope.roomnumber<=9999) {
                userInfoModel.roomnumber = $scope.roomnumber;
                if(userInfoModel.mode == 1) {
                    $location.path("/room");
                } else {
                    $location.path("/offlineroom");
                }
                // $scope.$apply();
            } else {
                //TODO: 房间号输入错误提示
            }
        };
        $scope.join = join;
    };
    angular.module('lyingman').controller('joinroomController', joinroomController);
})();
