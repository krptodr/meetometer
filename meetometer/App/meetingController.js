/// <reference path="_all.ts" />
var meetometer;
(function (meetometer) {
    'use strict';
    var meetingController = (function () {
        function meetingController($scope, $http, $timeout, storageService) {
            var _this = this;
            this.$scope = $scope;
            this.$http = $http;
            this.$timeout = $timeout;
            this.storageService = storageService;
            var settings = storageService.getSettings();
            $scope.loginErrorMessage = "";
            $scope.username = "test";
            $scope.password = "test123test!";
            $scope.people = settings.people;
            $scope.avgSalary = settings.avgSalary;
            $scope.meetings = storageService.getMeetings();
            $scope.$watch("meetings", function () { return _this.saveMeetings(); }, true);
            $scope.$watch("people", function () { return _this.saveSettings(); });
            $scope.$watch("avgSalary", function () { return _this.saveSettings(); });
            $scope.running = false;
            $scope.cost = 0;
            $scope.duration = 0;
            $scope.vm = this;
        }
        meetingController.prototype.saveSettings = function () {
            this.storageService.saveSettings(new meetometer.settingsModel(this.$scope.people, this.$scope.avgSalary));
        };
        meetingController.prototype.saveMeetings = function () {
            this.storageService.saveMeetings(this.$scope.meetings);
        };
        meetingController.prototype.calcCost = function (ppl, avgSalary, seconds) {
            // Mandatory social taxes company must pay for employees are 31.42%
            return 1.3142 * seconds * (ppl * avgSalary) / (176 * 60 * 60);
        };
        meetingController.prototype.tick = function () {
            var _this = this;
            var work = function () {
                _this.$scope.cost += _this.calcCost(_this.$scope.people, _this.$scope.avgSalary, 1);
                _this.$scope.duration++;
                _this.cancelPromise = _this.$timeout(work, 1000);
            };
            this.cancelPromise = this.$timeout(work, 1000);
        };
        meetingController.prototype.start = function () {
            this.$scope.running = true;
            this.tick();
        };
        meetingController.prototype.stop = function () {
            this.$scope.running = false;
            this.$timeout.cancel(this.cancelPromise);
        };
        meetingController.prototype.reset = function () {
            this.$scope.cost = 0;
            this.$scope.duration = 0;
        };
        meetingController.prototype.storeCurrentMeeting = function () {
            if (this.$scope.running) {
                this.stop();
            }
            var meetingToStore = new meetometer.meetingModel(this.$scope.meetings.length + 1, new Date(), this.$scope.people, this.$scope.avgSalary, this.$scope.duration);
            this.$scope.meetings.push(meetingToStore);
            this.reset();
        };
        meetingController.prototype.deleteMeeting = function (meetingToDelete) {
            var index = this.$scope.meetings.indexOf(meetingToDelete);
            if (index > -1) {
                this.$scope.meetings.splice(index, 1);
            }
        };
        meetingController.$inject = ["$scope", "$http", "$timeout", "storageService"];
        return meetingController;
    }());
    meetometer.meetingController = meetingController;
})(meetometer || (meetometer = {}));
//# sourceMappingURL=meetingcontroller.js.map