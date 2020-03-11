'use strict';

function Company(title) {
    this.id = getUniqueId();
    this.title = title;

    Owner.call(this);

    this.setFullInfo = function(obj) {
        this.id = obj.id;
        this.title = obj.title;
        this.setBalance(obj.balance);
    }

    this.getId = function() {
        return this.id;
    }

    this.getTitle = function() {
        return this.title;
    }

    this.getViewInfo = function() {
        return [ 
            { title: 'ID', value: this.getId() },
            { title: 'Title', value: this.getTitle() },
            { title: 'Balance', value: this.getBalance() },
            { title: 'Cars', value: this.getCars() }
        ];
    }

    this.getAddInfo = function() {
        return [
            { title: 'Title', placeholder: 'Enter the title' },
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
                title: 'Title', 
                value: this.getTitle(),
                placeholder: 'Enter the title'  
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