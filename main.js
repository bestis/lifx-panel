var app = angular.module('lifxApp', ['rzModule','directive.ngColorwheel']);

app.config(function($logProvider){
	$logProvider.debugEnabled(true);
});

app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
});

app.controller('LifxController', ['$scope','$log','$http', function($scope, $log, $http) {
	var lifx = this;
	$log.log('Init');
	$scope.loading = false;
	$scope.lights = [];
	$scope.groups = [];
	$scope.locations = [];
	$scope.current = 'all';
	$scope.selector = 'all';
	$scope.zones = '';
	$scope.tab = 'color';
	$scope.color = '#ffffff';
	$scope.kelvin = 3500;
	$scope.brightness = 50;
	$scope.duration = 0;
	$scope.color1 = '#ffffff';
	$scope.from_color = '#000000';
	$scope.period = 10;
	$scope.cycles = 1000;
	$scope.peak = 75;
	$scope.init = function() {
		var token = localStorage.getItem('lifxToken');
		if (token) {
			$scope.token = token;
			$http.defaults.headers.common.Authorization = 'Bearer '+token;
			$scope.loading = true;
			$http({
				method: 'GET',
				url: 'https://api.lifx.com/v1/lights/all'
			}).then(function successCallback(response) {
				$log.log(response);
			        $scope.lights = [];
			        $scope.groups = [];
			        $scope.locations = [];
				if (response.data) {
					for (var i in response.data) {
						$scope.lights.push(response.data[i]);
					}
				}
				for (var i in $scope.lights) {
					if ($scope.lights[i].group) {
						var known = false;
						for (var ii in $scope.groups) {
							if ($scope.lights[i].group.id == $scope.groups[ii].id) {
								known = true;
								break;
							}
						}
						if (!known) {
							$scope.groups.push($scope.lights[i].group);
						}
					}
					
					if ($scope.lights[i].location) {
						var known = false;
						for (var ii in $scope.locations) {
							if ($scope.lights[i].location.id == $scope.locations[ii].id) {
								known = true;
								break;
							}
						}
						if (!known) {
							$scope.locations.push($scope.lights[i].location);
						}
					}
				}
				$scope.updateSelector();
				$log.log('Found following lamps:', $scope.lights, $scope.groups, $scope.locations);
				$scope.loading = false;
			}, function errorCallback(response) {
				$log.log(response);
				if (response.data && response.data.error) {
					$scope.tokenError = response.data.error;
				} else {
					$scope.tokenError = 'Unkown error with token';
				}
				$scope.clearToken();
				$scope.loading = false;
			});
		}
	};
	$scope.updateSelector = function() {
		$scope.selector = $scope.current + ($scope.zones ? '|'+$scope.zones : '');
	};
	$scope.init();
	$scope.setToken = function() {
		localStorage.setItem('lifxToken',this.newToken);
		$scope.token = this.newToken;
		$http.defaults.headers.common.Authorization = 'Bearer '+this.newToken;
		$scope.init();
	};
	$scope.clearToken = function() {
		localStorage.removeItem('lifxToken');
		$scope.token = null;
		$http.defaults.headers.common.Authorization = '';
	};
	$scope.postRequest = function(selector, action, data) {
		$log.log('Sending request with selector:'+selector+' to action:'+action);
		$http({
			method: 'POST',
			url: 'https://api.lifx.com/v1/lights/'+selector+'/'+action,
			data: data
		}).then(function successCallback(response) {
			$log.log(response);
		}, function errorCallback(response) {
			$log.log(response);
		});
	};
	$scope.putRequest = function(selector, action, data) {
		$log.log('Sending request with selector:'+selector+' to action:'+action+" with data", data);
		$http({
			method: 'PUT',
			url: 'https://api.lifx.com/v1/lights/'+selector+'/'+action,
			data: data
		}).then(function successCallback(response) {
			$log.log(response);
		}, function errorCallback(response) {
			$log.log(response);
		});
	};
	$scope.setColor = function(selector, color, brightness, kelvin, duration) {
		if (color=='#ffffff') {
			color = color+" kelvin:"+kelvin;
		}
		var data = {
			power_on: true,
			color: color,
			brightness: brightness/100,
			duration: duration
		};
		$scope.putRequest(selector, 'state', data);
		$log.log(selector,data);
	};
	$scope.setEffect1 = function(selector, effect, color1, from_color, period, cycles, peak) {
		var data = {
			power_on: true,
			color: color1,
			from_color: from_color,
			period: period,
			cycles: cycles,
			peak: peak/100,
			persist: false
		};
		$scope.postRequest(selector, 'effects/'+effect, data);
		$log.log(selector,data);
	};
	$scope.powerCycle = function(selector) {
		var data = {
			states: [
				{ brightness: 1.0 },
				{ brightness: 0.75 },
				{ brightness: 0.5 },
				{ brightness: 0.25 },
				{ power_on: false }

			],
			defaults: {
				power_on: true,
				saturation: 0,
				duration: 0
			}
		};
		$scope.postRequest(selector, 'cycle', data);
		$log.log(selector,data);
	};
}]);
