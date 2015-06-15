// Create a new app with the AngularFire module
var app = angular.module("app", ["firebase"]);

// Re-usable factory that generates the $firebaseAuth instance
app.factory("Auth", function($firebaseAuth) {
  var ref = new Firebase("https://ng-auth.firebaseio.com");
  return $firebaseAuth(ref);
});

app.controller("AuthCtrl", function($scope, $http, Auth) {
  // Listens for changes in authentication state
  Auth.$onAuth(function(authData) {
    $scope.authData = authData;

    if (authData) {
      getRepos();
    }
  });

  // Logs in a user with GitHub
  $scope.login = function() {
    Auth.$authWithOAuthPopup("github").catch(function(error) {
      console.error("Error authenticating with GitHub:", error);
    });
  };

  // Logs out the logged-in user
  $scope.logout = function() {
    Auth.$unauth();
  };

  // Retrieves the GitHub repos owned by the logged-in user
  function getRepos() {
    $http.get($scope.authData.github.cachedUserProfile.repos_url, {
      access_token: $scope.authData.github.accessToken
    }).success(function(repos) {
      $scope.repos = repos;
    }).error(function(error) {
      console.error("Error making GitHub API request:", error);
    });
  }
});
