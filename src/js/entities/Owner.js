'use strict';

function Owner() {
    this.balance = 0;
    this.cars = [];

    this.setBalance = function(value) {
        this.balance = parseInt(value);
    }

    this.changeBalance = function(value) {
        this.balance += parseInt(value);
    }

    this.addCar = function(value) {
        this.cars.push(value);
    }

    this.removeCar = function(carId) {
        for (let i = 0; i < this.cars.length; i++) {
            if (carId === this.cars[i]) {
                this.cars.splice(i, 1);
            }
        }
    }

    this.getBalance = function() {
        return this.balance.toString();
    }

    this.getCarsIdList = function () {
        return this.cars.slice();
    }

    this.getCars = function() {
        let result;
        if (this.cars.length === 0) {
            result = 'No cars';
        } else {
            result = this.getCarsList();
        }
        
        return result;
    }

    this.getCarsList = function() {
        let result = '';
        for (let i = 0; i < this.cars.length; i++) {
            result += `<div>${getItemById('dbCars', this.cars[i], true).getTitle()}</div>`;
        }
        return result;
    }

    this.makeCarsManager = function() {
        return '<div id="cars-manager"></div>';
    }
}