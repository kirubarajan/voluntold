angular.module('starter.controllers', ['firebase'])

.controller('ConfirmCtrl', ['$scope', '$state', function($scope, $state) {

  // loads Organizations page

  $scope.next = function () {
    $state.go('myorg');
  };

}])

.controller('MyOrgCtrl', ['$scope', '$state', '$rootScope', 'Organizations', function($scope, $state, $rootScope, Organizations) {

  // initialize query object, and sets local array of organizations to Firebase array in the cloud

  $scope.organizations = Organizations;
  $scope.input = {};

  // removes helping text and loads About page of organization, passing on JSON object of organization for generating the view dynamically

  $scope.about = function (org) {
    $rootScope.helperText = "";
    $rootScope.helperText2 = "";

    $rootScope.org = org;
    $state.go('about');

  };

  // removes helping text and loads page for creating a new organization

  $scope.add = function () {
    $rootScope.helperText = "";
    $rootScope.helperText2 = "";
    $state.go('neworg');
  };

  $scope.search = function () {

    // if query isn't empty

    if ($scope.input.query)
    {

      // initalizing array of results

      $rootScope.results = [];

      // iterates over loop of organizations

      for (i = 0; i < $scope.organizations.length; ++i)
      {

        // if organization name contains query string (case insensitive)

        if (!$scope.organizations[i].name.toString().toLowerCase().indexOf($scope.input.query.toString().toLowerCase()))
        {

          // adds organization's JSON object to global array of results

          $rootScope.results.push({name: $scope.organizations[i].name, avatar: $scope.organizations[i].avatar, description: $scope.organizations[i].description, location: $scope.organizations[i].location, website: $scope.organizations[i].website, email: $scope.organizations[i].email, image: $scope.organizations[i].image});
        }

      }

      // transitions to the page of results

      $state.go('search');

    }

  };

  // loads list page

  $scope.list = function () {
    $state.go('list');
  };


}])

.controller('NewOrgCtrl', ['$scope', '$state', '$ionicPopup', '$rootScope', 'Organizations', function($scope, $state, $ionicPopup, $rootScope, Organizations) {

  $scope.back = function() {

    // creates popup window for if user tries going back, in order to confirm user's decision

    var confirmPopup = $ionicPopup.confirm ({
      title: 'Do you want to return?',
      template: 'Warning: all info will be lost.'
    });

    confirmPopup.then(function(res) {
      if(res) {

        // if agrees, transitions to state of Organizations page

        $state.go('myorg');
      } else {
        console.log('You are not sure');
      }
    });

  };

  // initalizes local array of Organizations to Firebase array, in the cloud, and input object (org)

  $scope.org = {};
  $scope.organizations = Organizations;

  // saves organization in (firebase) array

  $scope.save = function () {

    // if all fields are inputted

    if ($scope.org.name && $scope.org.avatar && $scope.org.image && $scope.org.description && $scope.org.size && $scope.org.email && $scope.org.website && $scope.org.location)
    {

      // creates and adds JSON object to Firebase array of organizations in the cloud, according to input fields

      $scope.organizations.$add({'name': $scope.org.name, 'avatar': $scope.org.avatar, 'image': $scope.org.image, 'description': $scope.org.description, 'size': $scope.org.size, 'email': $scope.org.email, 'website': $scope.org.website, 'location': $scope.org.location});

      // transitions to state of Organizations page

      $state.go('myorg');
    }

  };

}])

.controller('AboutCtrl', ['$scope', '$state', '$rootScope', '$ionicPopup', function($scope, $state, $rootScope, $ionicPopup) {

  // goes back

  $scope.back = function () {
    $state.go('myorg');
  };

  // adds current organization to list of organizations to volunteer for

  $scope.add = function (org) {

    // confirm's user's action using popup window

    var confirmPopup = $ionicPopup.confirm ({
      title: 'Are you sure?',
      template: 'Do you want to add ' + org.name + ' to your list?'
    });

    confirmPopup.then(function(res) {
      if(res) {

        // adds organization to array of organizations to apply for

        $rootScope.list.push({name: org.name, description: org.description, location: org.location, website: org.website, email: org.email, image: org.image});

        // transitions to state of My List page

        $state.go('list');
      } else {
        console.log('You are not sure');
      }
    });

  };

}])

.controller('ListCtrl', ['$scope', '$state', '$rootScope', '$ionicPlatform', '$ionicPopup', function($scope, $state, $rootScope, $ionicPlatform,$ionicPopup) {

  // goes back to Organizations page

  $scope.back = function () {
    $state.go('myorg');
  };

  // goes to About page of organization and sets org object to the organization that was clicked

  $scope.about = function (org) {
    $rootScope.org = {};
    $rootScope.org = org;
    $state.go('about');
  };

  // shares list of organizations to volunteer for

  $scope.share = function() {

    // asks user if they really wish to share list

    var confirmPopup = $ionicPopup.confirm ({
      title: 'Are you sure?',
      template: 'Do you want to email your list?'
    });

    confirmPopup.then(function(res) {
      if(res) {

        // creates body text by iterating through all organizations

        $scope.bodyText = '<h1> My List: </h1> <br> <br> ';

        for (i = 0; i < $rootScope.list.length; i++)
        {

          // adding name of organization

          $scope.bodyText += '<h2>';
          $scope.bodyText += $rootScope.list[i].name;
          $scope.bodyText += '</h2> <br>'

          // adding location of organization

          $scope.bodyText += '<h3>';
          $scope.bodyText += $rootScope.list[i].location;
          $scope.bodyText += '</h3> <br>';

          // adding clickable email of organization

          $scope.bodyText += '<a href="mailto:'
          $scope.bodyText += $rootScope.list[i].email;
          $scope.bodyText += '"> </a> <br>';

          // adding clickable website of organization

          $scope.bodyText += '<a href="'
          $scope.bodyText += $rootScope.list[i].website;
          $scope.bodyText += '"> </a> <br> <br>';

        }

        // sends email

        window.plugin.email.open({
          to:          null, // email addresses for TO field
          cc:          null, // email addresses for CC field
          bcc:         null, // email addresses for BCC field
          attachments: null, // file paths or base64 data streams
          subject:    "Organizations to Volunteer For", // subject of the email
          body:       $scope.bodyText, // email body (for HTML, set isHtml to true)
          isHtml:    true, // indicats if the body is HTML or plain text

          }, function () {
            console.log('email view dismissed');
            $state.go('list');
          },

        this);

      } else {
        console.log('You are not sure');
      }
    });





  }

}])

.controller('SearchCtrl', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope) {


  // generates apology if no organizations from search result

  $scope.sorry = '';

  if ($rootScope.results.length == 0)
  {
    $scope.sorry = "Sorry, we couldn't find any matches. Try being more specific."
  }
  else
  {
    $scope.sorry = '';
  }

  // goes back to Organization page

  $scope.back = function () {

    $state.go('myorg');

  };

  // goes to organization's About page

  $scope.about = function (org) {

    // passes respective organization JSON object which was pressed, to dynamically generate view in About page/state

    $rootScope.org = org;
    $state.go('about');

  };

}])

.controller('SplashCtrl', ['$scope', '$state', function($scope, $state) {

  // goes to Confirm page

  $scope.next = function () {
    $state.go('confirm');
  };

}]);
