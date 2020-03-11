'use strict';

function Person(name) {
    this.id = getUniqueId();
    this.name = name;

    Owner.call(this);

    this.setFullInfo = function(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.setBalance(obj.balance);
    }

    this.getId = function() {
        return this.id;
    }

    this.getTitle = function() {
        return this.name;
    }

    this.getViewInfo = function() {
        return [ 
            { title: 'ID', value: this.getId() },
            { title: 'Name', value: this.getTitle() },
            { title: 'Balance', value: this.getBalance() },
            { title: 'Cars', value: this.getCars() }
        ];
    }

    this.getAddInfo = function() {
        return [
            { title: 'Name', placeholder: 'Enter the name' },
            { title: 'Balance', placeholder: 'Enter the current balance' }
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
                title: 'Name', 
                value: this.getTitle(),
                placeholder: 'Enter the name'  
            },
            { 
                title: 'Balance', 
                value: this.getBalance(),
                placeholder: 'Enter the new balance'  
            },
            { 
                title: 'Cars', 
                value: this.makeCarsManager(),
                placeholder: 'Select new car' 
            }
        ];
    }
}