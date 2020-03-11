'use strict';

function Car(title, price) {
    this.id = getUniqueId();
    this.title = title;
    this.price = price;
    this.owner = null;

    this.setOwner = function(value) {
        this.owner = value;
    }

    this.removeOwner = function() {
        this.owner = null;
    }

    this.setFullInfo = function(obj) {
        this.id = obj.id;
        this.title = obj.title;
        this.price = obj.price;
    }

    this.getId = function() {
        return this.id;
    }

    this.getTitle = function() {
        return this.title;
    }

    this.getPrice = function() {
        return this.price;
    }

    this.getOwner = function(id = false) {
        if (id) {
            return this.owner;
        }

        if (this.owner === null) {
            return 'No owner';
        }

        if (getItemById('dbPersons', this.owner, true)) {
            return getItemById('dbPersons', this.owner, true).getTitle();
        } else {
            return getItemById('dbCompanies', this.owner, true).getTitle();
        }
    }

    this.getViewInfo = function() {
        return [ 
            { title: 'ID', value: this.getId() },
            { title: 'Title', value: this.getTitle() },
            { title: 'Price', value: this.getPrice() },
            { title: 'Owner', value: this.getOwner() }
        ];
    }

    this.getAddInfo = function() {
        return [
            { title: 'Title', placeholder: 'Ex. BMW 325' },
            { title: 'Price', placeholder: 'Enter the price' }
        ];
    }

    this.getEditInfo = function() {
        return [ 
            { 
                title: 'ID', 
                value: this.getId(), 
                placeholder: 'ID'  
            },
            { 
                title: 'Title', 
                value: this.getTitle(),
                placeholder: 'Enter the title'  
            },
            { 
                title: 'Price', 
                value: this.getPrice(),
                placeholder: 'Enter the price'  
            },
            { 
                title: 'Owner', 
                value: this.getOwner(),
                placeholder: 'Select new owner' 
            }
        ];
    }
}