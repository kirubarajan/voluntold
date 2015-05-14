// Voluntold

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controllers', 'firebase'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function($scope, $rootScope) {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  });

  // initializing global variables of organization arrays, and helper texts

  $rootScope.results = [];
  $rootScope.list = [];
  $rootScope.helperText = "Press the new button to add your own organizations!";
  $rootScope.helperText2 = "or click on an Organization Card to learn about existing organizations";

})

// service for retriving array of orgazniations, which can be accessed from any controller

.factory('Organizations', ['$firebaseArray', function($firebaseArray) {

  var ref = new Firebase('https://voluntold.firebaseio.com/organizations');
  return $firebaseArray(ref);

}])

// defining states of different views, and creating the reference to its .html file and URL

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('splash', {
            url: '/splash',
            templateUrl: 'templates/splash.html',
            controller: 'SplashCtrl'
        })

        $stateProvider
            .state('confirm', {
                url: '/confirm',
                templateUrl: 'templates/confirm.html',
                controller: 'ConfirmCtrl'
            })

            $stateProvider
                .state('myorg', {
                    url: '/myorg',
                    templateUrl: 'templates/myorg.html',
                    controller: 'MyOrgCtrl'
                })

                $stateProvider
                    .state('about', {
                        url: '/about',
                        templateUrl: 'templates/about.html',
                        controller: 'AboutCtrl'
                    })

                    $stateProvider
                        .state('neworg', {
                            url: '/neworg',
                            templateUrl: 'templates/neworg.html',
                            controller: 'NewOrgCtrl'
                        })

                        $stateProvider
                            .state('list', {
                                url: '/list',
                                templateUrl: 'templates/list.html',
                                controller: 'ListCtrl'
                            })

                            $stateProvider
                                .state('search', {
                                    url: '/search',
                                    templateUrl: 'templates/search.html',
                                    controller: 'SearchCtrl'
                                })
                                
    // defaults URL/state to the splash screen (first screen)

    $urlRouterProvider.otherwise('/splash');
});
