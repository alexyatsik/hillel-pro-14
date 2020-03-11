'use strict';

function windowHandler() {
    createSwitcher();
}

function switcherHandler(event) {
    showContent(event.target.dataset.switchTo);
}

function crudHandler(event) {
    switch (event.target.dataset.action) {
        case 'add':
            removeForm();
            addNewItem(this.dataset.db);
            break;
        case 'view':
            removeForm();
            showItemInfo(this.dataset.db, event.target.dataset.id);
            break;
        case 'edit':
            removeForm();
            editItem(this.dataset.db, event.target.dataset.id);
            break;
        case 'delete':
            removeForm();
            deleteItem(this.dataset.db, event.target.dataset.id, event.target);
            break;
    }
}

function closeHandler() {
    removeForm();
}

function addButtonHandler(event) {
    const dbName = this.dataset.db;
    const formElements = document.forms.crudForm.elements;
    const formWrapper = document.getElementById('crud-form-wrapper');
    const data = {};
    let isInputCorrect = true;

    for (let i = 0; i < formElements.length; i++) {
        if (!formElements[i].name) {
            continue;
        }
        data[formElements[i].name] = formElements[i].value; 
    }

    let checkedData = checkFieldsWithRegExp(data);

    removeDomElementsByClass('error-message');

    for (let key in checkedData) {
        if (!checkedData[key]) {
            formWrapper.insertBefore(errorMessage(key), formWrapper.firstElementChild);
            isInputCorrect = false;
        }
    }

    let newItem;
    switch (dbName) {
        case 'dbCars':
            newItem = new Car;
            break;
        case 'dbPersons':
            newItem = new Person;
            break;
        case 'dbCompanies':
            newItem = new Company;
            break;
    }

    newItem.setFullInfo(checkedData);

    if (isInputCorrect) {
        addItemToLocalStorage(dbName, newItem);
        if (event.target.dataset.action === 'apply') {
            const editedRow = document.querySelector(`tr[data-id="${newItem.getId()}"]`);
            editedRow.querySelector('td[data-field-type="name"').innerHTML = newItem.getTitle();
        } else {
            addItemToContent(newItem);
        }
        removeForm();
    }
}

function sellButtonHandler() {
    removeDomElementById('cars-manager-error-message');

    const owner = getItemById(this.dataset.db, this.dataset.owner, true);
    const car = getItemById('dbCars', this.dataset.car, true);
    car.setOwner(null);
    owner.changeBalance(car.getPrice());
    owner.removeCar(this.dataset.car);
    addItemToLocalStorage('dbCars', car);
    addItemToLocalStorage(this.dataset.db, owner);
    removeForm();
    editItem(this.dataset.db, this.dataset.owner);
}

function buyButtonHandler() {
    removeDomElementById('cars-manager-error-message');

    const owner = getItemById(this.dataset.db, this.dataset.owner, true);
    const car = getItemById('dbCars', this.dataset.car, true);
    const balanceMinusPrice = parseInt(owner.getBalance()) - car.getPrice();
    if (balanceMinusPrice >= 0) {
        owner.setBalance(balanceMinusPrice);
        owner.addCar(car.getId());
        car.setOwner(owner.getId());
        addItemToLocalStorage('dbCars', car);
        addItemToLocalStorage(this.dataset.db, owner);
        removeForm();
        editItem(this.dataset.db, this.dataset.owner);
    } else {
        
        const carsManager = document.getElementById('cars-manager');
        const errorMessage = document.createElement('div');
        errorMessage.setAttribute('id', 'cars-manager-error-message')
        errorMessage.innerHTML = 'Insufficient funds';
        errorMessage.classList.add('error-message');
        carsManager.insertBefore(errorMessage, carsManager.firstElementChild);
    }
}

function confirmationHandler(event) {
    const deleteButtonRef = document.querySelector(`[data-id="${this.dataset.id}"][data-action="delete"]`);
    
    if (event.target.dataset.action === 'delete-confirmed') {
        deleteFromBase(this.dataset.db, this.dataset.id);
        deleteFromContent(this.dataset.id); 
        deleteButtonRef.hidden = false;
        this.remove()  
    } else if (event.target.dataset.action === 'delete-canceled') {
        deleteButtonRef.hidden = false;
        this.remove();
    }
}