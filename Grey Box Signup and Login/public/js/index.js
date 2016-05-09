var greyBoxLogin = angular.module("greyBoxLogin", ['ngAnimate', 'firebase']);

greyBoxLogin.controller('showForm', ['$scope', '$firebaseAuth', function($scope, $firebaseAuth) {

  var ref = new Firebase("https://grey-box-login.firebaseio.com/");
  var auth = $firebaseAuth(ref);
  
  $scope.login = function() {
    auth.$authWithPassword({
        email: $scope.login.email,
        password: $scope.login.password
      }).then(function(regUser) {
        $scope.loginMessage = "Welcome back";
        $scope.login.email = '';
        $scope.login.password = '';
      }).catch(function(error) {
       $scope.loginMessage = error.message;
       $scope.login.email = '';
       $scope.login.password = '';
      });
    
  };
  

  
}]);

greyBoxLogin.controller('signupForm', ['$scope', '$firebaseAuth', function($scope, $firebaseAuth) {

  var ref = new Firebase("https://grey-box-login.firebaseio.com/");
  var auth = $firebaseAuth(ref);

  $scope.showSignupForm = function() {
    $scope.signupForm = !$scope.signupForm;
  }

  $scope.submit = function() {
    auth.$createUser({
      email: $scope.signup.email,
      password: $scope.signup.password
    }).then(function(regUser) {
      
      var regRef = new Firebase("https://grey-box-login.firebaseio.com/" + 'users').child(regUser.uid).set({
        date: Firebase.ServerValue.TIMESTAMP,
        regUser: regUser.uid, 
        firstname: $scope.signup.firstName,
        lastname: $scope.signup.lastName,
        email: $scope.signup.email
      });
      $scope.message = "Welcome to the Grey Box family ";
    }).catch(function(error) {
      $scope.message = error.message;
    });
  };

}]);

greyBoxLogin.directive('confirmPassword', ConfirmPassword);

function ConfirmPassword() {

  var linkFn = function(scope, element, attributes, ngModel) {
    ngModel.$validators.confirmPassword = function(modelValue) {
      return modelValue == scope.password;
    };

    scope.$watch("password", function() {
      ngModel.$validate();
    });
  };

  return {
    require: "ngModel",
    scope: {
      password: "=confirmPassword"
    },
    link: linkFn
  };
};