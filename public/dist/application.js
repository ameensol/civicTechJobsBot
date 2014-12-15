"use strict";var ApplicationConfiguration=function(){var applicationModuleName="mean",applicationModuleVendorDependencies=["ngResource","ngCookies","ngAnimate","ngTouch","ngSanitize","ui.router","ui.bootstrap","ui.utils"],registerModule=function(moduleName,dependencies){angular.module(moduleName,dependencies||[]),angular.module(applicationModuleName).requires.push(moduleName)};return{applicationModuleName:applicationModuleName,applicationModuleVendorDependencies:applicationModuleVendorDependencies,registerModule:registerModule}}();angular.module(ApplicationConfiguration.applicationModuleName,ApplicationConfiguration.applicationModuleVendorDependencies),angular.module(ApplicationConfiguration.applicationModuleName).config(["$locationProvider",function($locationProvider){$locationProvider.hashPrefix("!")}]),angular.element(document).ready(function(){"#_=_"===window.location.hash&&(window.location.hash="#!"),angular.bootstrap(document,[ApplicationConfiguration.applicationModuleName])}),ApplicationConfiguration.registerModule("core"),ApplicationConfiguration.registerModule("jobs"),ApplicationConfiguration.registerModule("scrapes"),ApplicationConfiguration.registerModule("users"),angular.module("core").config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){$urlRouterProvider.otherwise("/"),$stateProvider.state("home",{url:"/",templateUrl:"modules/core/views/home.client.view.html"})}]),angular.module("core").controller("HeaderController",["$scope","Authentication","Menus",function($scope,Authentication,Menus){$scope.authentication=Authentication,$scope.isCollapsed=!1,$scope.menu=Menus.getMenu("topbar"),$scope.toggleCollapsibleMenu=function(){$scope.isCollapsed=!$scope.isCollapsed},$scope.$on("$stateChangeSuccess",function(){$scope.isCollapsed=!1})}]),angular.module("core").controller("HomeController",["$scope","Authentication","$http",function($scope,Authentication){$scope.authentication=Authentication,$scope.info="";var validUsers=["civicjobsnyc","tkdtothemax1"];$scope.authentication.user&&"twitter"===$scope.authentication.user.provider?validUsers.indexOf($scope.authentication.user.username)>-1?$scope.authSuccess=!0:($scope.authSuccess=!1,$scope.info="Current user does not have access privileges"):$scope.authSuccess=!1}]),angular.module("core").service("Menus",[function(){this.defaultRoles=["*"],this.menus={};var shouldRender=function(user){if(!user)return this.isPublic;if(~this.roles.indexOf("*"))return!0;for(var userRoleIndex in user.roles)for(var roleIndex in this.roles)if(this.roles[roleIndex]===user.roles[userRoleIndex])return!0;return!1};this.validateMenuExistance=function(menuId){if(menuId&&menuId.length){if(this.menus[menuId])return!0;throw new Error("Menu does not exists")}throw new Error("MenuId was not provided")},this.getMenu=function(menuId){return this.validateMenuExistance(menuId),this.menus[menuId]},this.addMenu=function(menuId,isPublic,roles){return this.menus[menuId]={isPublic:isPublic||!1,roles:roles||this.defaultRoles,items:[],shouldRender:shouldRender},this.menus[menuId]},this.removeMenu=function(menuId){this.validateMenuExistance(menuId),delete this.menus[menuId]},this.addMenuItem=function(menuId,menuItemTitle,menuItemURL,menuItemType,menuItemUIRoute,isPublic,roles,position){return this.validateMenuExistance(menuId),this.menus[menuId].items.push({title:menuItemTitle,link:menuItemURL,menuItemType:menuItemType||"item",menuItemClass:menuItemType,uiRoute:menuItemUIRoute||"/"+menuItemURL,isPublic:null===isPublic||"undefined"==typeof isPublic?this.menus[menuId].isPublic:isPublic,roles:null===roles||"undefined"==typeof roles?this.menus[menuId].roles:roles,position:position||0,items:[],shouldRender:shouldRender}),this.menus[menuId]},this.addSubMenuItem=function(menuId,rootMenuItemURL,menuItemTitle,menuItemURL,menuItemUIRoute,isPublic,roles,position){this.validateMenuExistance(menuId);for(var itemIndex in this.menus[menuId].items)this.menus[menuId].items[itemIndex].link===rootMenuItemURL&&this.menus[menuId].items[itemIndex].items.push({title:menuItemTitle,link:menuItemURL,uiRoute:menuItemUIRoute||"/"+menuItemURL,isPublic:null===isPublic||"undefined"==typeof isPublic?this.menus[menuId].items[itemIndex].isPublic:isPublic,roles:null===roles||"undefined"==typeof roles?this.menus[menuId].items[itemIndex].roles:roles,position:position||0,shouldRender:shouldRender});return this.menus[menuId]},this.removeMenuItem=function(menuId,menuItemURL){this.validateMenuExistance(menuId);for(var itemIndex in this.menus[menuId].items)this.menus[menuId].items[itemIndex].link===menuItemURL&&this.menus[menuId].items.splice(itemIndex,1);return this.menus[menuId]},this.removeSubMenuItem=function(menuId,submenuItemURL){this.validateMenuExistance(menuId);for(var itemIndex in this.menus[menuId].items)for(var subitemIndex in this.menus[menuId].items[itemIndex].items)this.menus[menuId].items[itemIndex].items[subitemIndex].link===submenuItemURL&&this.menus[menuId].items[itemIndex].items.splice(subitemIndex,1);return this.menus[menuId]},this.addMenu("topbar")}]),angular.module("jobs").config(["$stateProvider",function($stateProvider){$stateProvider.state("listJobs",{url:"/jobs",templateUrl:"modules/jobs/views/list-jobs.client.view.html"}).state("createJob",{url:"/jobs/create",templateUrl:"modules/jobs/views/create-job.client.view.html"}).state("viewJob",{url:"/jobs/:jobId",templateUrl:"modules/jobs/views/view-job.client.view.html"}).state("editJob",{url:"/jobs/:jobId/edit",templateUrl:"modules/jobs/views/edit-job.client.view.html"})}]),angular.module("jobs").controller("JobsController",["$scope","$stateParams","$location","Authentication","Jobs",function($scope,$stateParams,$location,Authentication,Jobs){$scope.authentication=Authentication,$scope.create=function(){var job=new Jobs({name:this.name});job.$save(function(response){$location.path("jobs/"+response._id),$scope.name=""},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.remove=function(job){if(job){job.$remove();for(var i in $scope.jobs)$scope.jobs[i]===job&&$scope.jobs.splice(i,1)}else $scope.job.$remove(function(){$location.path("jobs")})},$scope.update=function(){var job=$scope.job;job.$update(function(){$location.path("jobs/"+job._id)},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.find=function(){$scope.jobs=Jobs.query()},$scope.findOne=function(){$scope.job=Jobs.get({jobId:$stateParams.jobId})}}]),angular.module("jobs").factory("Jobs",["$resource",function($resource){return $resource("jobs/:jobId",{jobId:"@_id"},{update:{method:"PUT"}})}]),angular.module("scrapes").config(["$stateProvider",function($stateProvider){$stateProvider.state("listScrapes",{url:"/scrapes",templateUrl:"modules/scrapes/views/list-scrapes.client.view.html"}).state("createScrape",{url:"/scrapes/create",templateUrl:"modules/scrapes/views/create-scrape.client.view.html"}).state("viewScrape",{url:"/scrapes/:scrapeId",templateUrl:"modules/scrapes/views/view-scrape.client.view.html"}).state("editScrape",{url:"/scrapes/:scrapeId/edit",templateUrl:"modules/scrapes/views/edit-scrape.client.view.html"})}]),angular.module("scrapes").controller("ScrapesController",["$scope","$stateParams","$location","Authentication","Scrapes",function($scope,$stateParams,$location,Authentication,Scrapes){$scope.authentication=Authentication,$scope.activate=function(){Scrapes.activate(function(res){$scope.setStatus(res)})},$scope.deactivate=function(){Scrapes.deactivate(function(res){$scope.setStatus(res)})},$scope.checkStatus=function(){Scrapes.check(function(res){console.log(res),$scope.setStatus(res)})},$scope.setStatus=function(scraper){if(console.log(scraper),scraper.status&&scraper.time>0){$scope.status="Active";var now=(new Date).getTime();console.log(now),console.log(scraper.time),$scope.pending=scraper.time}else $scope.status="Inactive",$scope.pending=null},$scope.create=function(){var scrape=new Scrapes({name:this.name});scrape.$save(function(response){$location.path("scrapes/"+response._id),$scope.name=""},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.remove=function(scrape){if(scrape){scrape.$remove();for(var i in $scope.scrapes)$scope.scrapes[i]===scrape&&$scope.scrapes.splice(i,1)}else $scope.scrape.$remove(function(){$location.path("scrapes")})},$scope.update=function(){var scrape=$scope.scrape;scrape.$update(function(){$location.path("scrapes/"+scrape._id)},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.find=function(){$scope.scrapes=Scrapes.query()},$scope.findOne=function(){$scope.scrape=Scrapes.get({scrapeId:$stateParams.scrapeId})}}]),angular.module("scrapes").factory("Scrapes",["$resource",function($resource){return $resource("scrapes/:scrapeId",{scrapeId:"@_id"},{update:{method:"PUT"},activate:{method:"POST",url:"scraper"},check:{method:"GET",url:"scraper"},deactivate:{method:"DELETE",url:"scraper"}})}]),angular.module("users").config(["$httpProvider",function($httpProvider){$httpProvider.interceptors.push(["$q","$location","Authentication",function($q,$location,Authentication){return{responseError:function(rejection){switch(rejection.status){case 401:Authentication.user=null,$location.path("signin");break;case 403:}return $q.reject(rejection)}}}])}]),angular.module("users").config(["$stateProvider",function($stateProvider){$stateProvider.state("profile",{url:"/settings/profile",templateUrl:"modules/users/views/settings/edit-profile.client.view.html"}).state("password",{url:"/settings/password",templateUrl:"modules/users/views/settings/change-password.client.view.html"}).state("accounts",{url:"/settings/accounts",templateUrl:"modules/users/views/settings/social-accounts.client.view.html"}).state("signup",{url:"/signup",templateUrl:"modules/users/views/authentication/signup.client.view.html"}).state("signin",{url:"/signin",templateUrl:"modules/users/views/authentication/signin.client.view.html"}).state("forgot",{url:"/password/forgot",templateUrl:"modules/users/views/password/forgot-password.client.view.html"}).state("reset-invlaid",{url:"/password/reset/invalid",templateUrl:"modules/users/views/password/reset-password-invalid.client.view.html"}).state("reset-success",{url:"/password/reset/success",templateUrl:"modules/users/views/password/reset-password-success.client.view.html"}).state("reset",{url:"/password/reset/:token",templateUrl:"modules/users/views/password/reset-password.client.view.html"})}]),angular.module("users").controller("AuthenticationController",["$scope","$http","$location","Authentication",function($scope,$http,$location,Authentication){$scope.authentication=Authentication,$scope.authentication.user&&$location.path("/"),$scope.signup=function(){$http.post("/auth/signup",$scope.credentials).success(function(response){$scope.authentication.user=response,$location.path("/")}).error(function(response){$scope.error=response.message})},$scope.signin=function(){$http.post("/auth/signin",$scope.credentials).success(function(response){$scope.authentication.user=response,$location.path("/")}).error(function(response){$scope.error=response.message})}}]),angular.module("users").controller("PasswordController",["$scope","$stateParams","$http","$location","Authentication",function($scope,$stateParams,$http,$location,Authentication){$scope.authentication=Authentication,$scope.authentication.user&&$location.path("/"),$scope.askForPasswordReset=function(){$scope.success=$scope.error=null,$http.post("/auth/forgot",$scope.credentials).success(function(response){$scope.credentials=null,$scope.success=response.message}).error(function(response){$scope.credentials=null,$scope.error=response.message})},$scope.resetUserPassword=function(){$scope.success=$scope.error=null,$http.post("/auth/reset/"+$stateParams.token,$scope.passwordDetails).success(function(response){$scope.passwordDetails=null,Authentication.user=response,$location.path("/password/reset/success")}).error(function(response){$scope.error=response.message})}}]),angular.module("users").controller("SettingsController",["$scope","$http","$location","Users","Authentication",function($scope,$http,$location,Users,Authentication){$scope.user=Authentication.user,$scope.user||$location.path("/"),$scope.hasConnectedAdditionalSocialAccounts=function(){for(var i in $scope.user.additionalProvidersData)return!0;return!1},$scope.isConnectedSocialAccount=function(provider){return $scope.user.provider===provider||$scope.user.additionalProvidersData&&$scope.user.additionalProvidersData[provider]},$scope.removeUserSocialAccount=function(provider){$scope.success=$scope.error=null,$http.delete("/users/accounts",{params:{provider:provider}}).success(function(response){$scope.success=!0,$scope.user=Authentication.user=response}).error(function(response){$scope.error=response.message})},$scope.updateUserProfile=function(isValid){if(isValid){$scope.success=$scope.error=null;var user=new Users($scope.user);user.$update(function(response){$scope.success=!0,Authentication.user=response},function(response){$scope.error=response.data.message})}else $scope.submitted=!0},$scope.changeUserPassword=function(){$scope.success=$scope.error=null,$http.post("/users/password",$scope.passwordDetails).success(function(){$scope.success=!0,$scope.passwordDetails=null}).error(function(response){$scope.error=response.message})}}]),angular.module("users").factory("Authentication",[function(){var _this=this;return _this._data={user:window.user},_this._data}]),angular.module("users").factory("Users",["$resource",function($resource){return $resource("users",{},{update:{method:"PUT"}})}]);