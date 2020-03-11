'use strict';

function createSwitcher() {
    const parent = document.getElementById('app');
    const root = createAndAppend(parent, 'div');
    root.classList.add('switcher');
    root.addEventListener('click', switcherHandler, event);
    createInputButton(root, 'Cars').dataset.switchTo = 'dbCars';
    createInputButton(root, 'Persons').dataset.switchTo = 'dbPersons';
    createInputButton(root, 'Companies').dataset.switchTo = 'dbCompanies';
}

function showContent(dbName) {
    const oldCrud = document.getElementById('crud');
    if (oldCrud) {
        oldCrud.remove();
    }

    const app = document.getElementById('app');
    const crud = createAndAppend(app, 'div');
    crud.setAttribute('id', 'crud');
    crud.dataset.db = dbName;
    crud.addEventListener('click', crudHandler, event);

    const caption = dbName.slice(2);
    createAndAppend(crud, 'h1', caption);

    createInputButton(crud, 'Add new').dataset.action = 'add';

    createContent(dbName);
}

function createContent(dbName) {
    const contentTable = createAndAppend(document.getElementById('crud'), 'table');
    contentTable.border = '1';
    contentTable.setAttribute('id', 'content-table')

    const tr = createAndAppend(contentTable, 'tr');
    createAndAppend(tr, 'th', 'Title/Name');
    createAndAppend(tr, 'th', 'Actions');

    const db = getFromLocalStorage(dbName);
    switch (dbName) {
        case 'dbCars': 
            for (let i = 0; i < db.length; i++) {
                Object.setPrototypeOf(db[i], new Car);
                addItemToContent(db[i]);
            }
            break;
        case 'dbPersons': 
            for (let i = 0; i < db.length; i++) {
                Object.setPrototypeOf(db[i], new Person);
                addItemToContent(db[i]);
            }
            break;
        case 'dbCompanies': 
            for (let i = 0; i < db.length; i++) {
                Object.setPrototypeOf(db[i], new Company);
                addItemToContent(db[i]);
            }
            break;
    }
}

function addItemToContent(item) {
    const contentTable = document.getElementById('content-table');
    const tr = createAndAppend(contentTable, 'tr');
    tr.dataset.id = item.id;
    createAndAppend(tr, 'td', item.getTitle()).dataset.fieldType = 'name';
    const actionsTd = createAndAppend(tr, 'td');
    actionsPanel(actionsTd, item.id);
}

function actionsPanel(parent, id) {
    const wrapper = createAndAppend(parent, 'div');
    const viewB = createInputButton(wrapper, 'View');
    const editB = createInputButton(wrapper, 'Edit');
    const deleteB = createInputButton(wrapper, 'Delete');

    viewB.dataset.id = id;
    viewB.dataset.action = 'view';
    editB.dataset.id = id;
    editB.dataset.action = 'edit';
    deleteB.dataset.id = id;
    deleteB.dataset.action = 'delete';

    return wrapper;
}

function removeForm() {
    removeDomElementById('crud-form-wrapper');
}

function formBasement() {
    const crud = document.getElementById('crud');
    const wrapper = createAndAppend(crud, 'div');
    wrapper.setAttribute('id', 'crud-form-wrapper');
}

function showItemInfo(dbName, itemId) {
    formBasement();
    const wrapper = document.getElementById('crud-form-wrapper');
    const table = createAndAppend(wrapper, 'table');
    table.border = '1';

    const currentItem = getItemById(dbName, itemId, true).getViewInfo();
    for (let i = 0; i < currentItem.length; i++) {
        const tr = createAndAppend(table, 'tr');
        createAndAppend(tr, 'th', currentItem[i].title);
        createAndAppend(tr, 'td', currentItem[i].value);
    }

    createInputButton(wrapper, 'Close').addEventListener('click', closeHandler);
}

function addNewItem(dbName) {
    formBasement();
    const wrapper = document.getElementById('crud-form-wrapper');
    const form = createAndAppend(wrapper, 'form');
    form.setAttribute('id', 'crudForm');
    const table = createAndAppend(form, 'table');
    table.border = '1';

    let templateObj;
    switch (dbName) {
        case 'dbCars':
            templateObj = new Car;
            break;
        case 'dbPersons':
            templateObj = new Person;
            break;
        case 'dbCompanies':
            templateObj = new Company;
            break;
    }

    const template = templateObj.getAddInfo();

    const tr = createAndAppend(table, 'tr');    
    createAndAppend(tr, 'th', 'ID');
    const inputWrapper = createAndAppend(tr, 'td');
    const idField = createInputText(inputWrapper, 'id');
    idField.setAttribute('value', templateObj.getId());
    idField.disabled = true;
    for (let i = 0; i < template.length; i++) {
        const tr = createAndAppend(table, 'tr');
        createAndAppend(tr, 'th', template[i].title);
        const inputNest = createAndAppend(tr, 'td');
        createInputText(inputNest, template[i].title.toLowerCase(), template[i].placeholder);
    }

    const btnAdd = createInputButton(wrapper, 'Add');
    btnAdd.dataset.db = dbName;
    btnAdd.addEventListener('click', addButtonHandler);

    createInputButton(wrapper, 'Close').addEventListener('click', closeHandler);
}

function editItem(dbName, itemId) {
    formBasement();
    const wrapper = document.getElementById('crud-form-wrapper');
    const form = createAndAppend(wrapper, 'form');
    form.setAttribute('id', 'crudForm');
    const table = createAndAppend(form, 'table');
    table.border = '1';

    const currentItem = getItemById(dbName, itemId, true).getEditInfo();
    for (let i = 0; i < currentItem.length; i++) {
        const tr = createAndAppend(table, 'tr');
        createAndAppend(tr, 'th', currentItem[i].title);
        if (currentItem[i].title === 'Cars') {
            createAndAppend(tr, 'td', currentItem[i].value);
            carsManager(dbName, itemId);
        } else {
            const inputNest = createAndAppend(tr, 'td');
            const input = createInputText(
                inputNest, 
                currentItem[i].title.toLowerCase(), 
                currentItem[i].placeholder
            );
            if (currentItem[i].title === 'ID' || currentItem[i].title === 'Owner') {
                input.disabled = true;
            }
            input.setAttribute('value', currentItem[i].value);
        }
    }

    const btnApply = createInputButton(wrapper, 'Apply');
    btnApply.dataset.db = dbName;
    btnApply.dataset.action = 'apply';
    btnApply.addEventListener('click', addButtonHandler, event);

    createInputButton(wrapper, 'Close').addEventListener('click', closeHandler);
}

function deleteItem(dbName, itemId, deleteButtonRef) {
    deleteButtonRef.hidden = true;

    const confirmationPanelWrapper = document.createElement('span');
    deleteButtonRef.parentElement.insertBefore(confirmationPanelWrapper, deleteButtonRef);
    confirmationPanelWrapper.addEventListener('click', confirmationHandler, event);
    confirmationPanelWrapper.dataset.db = dbName;
    confirmationPanelWrapper.dataset.id = itemId;

    const btnCancel = createInputButton(confirmationPanelWrapper, 'Cancel');
    btnCancel.dataset.action = 'delete-canceled';

    const btnDelete = createInputButton(confirmationPanelWrapper, 'Delete');
    btnDelete.classList.add('delete-confirm');
    btnDelete.dataset.action = 'delete-confirmed';
}

function deleteFromBase(dbName, itemId) {
    if (dbName === 'dbCars') {
        const ownerId = getItemById(dbName, itemId, true).getOwner(true);
        if (ownerId) {
            let owner = getItemById('dbPersons', ownerId, true);
            if (owner) {
                owner.removeCar(itemId);
                addItemToLocalStorage('dbPersons', owner);
            } else {
                owner = getItemById('dbCompanies', ownerId, true);
                owner.removeCar(itemId);
                addItemToLocalStorage('dbCompanies', owner);
            }
            
        }
    } else {
        const carsIdList = getItemById(dbName, itemId, true).getCarsIdList();
        for (let i = 0; i < carsIdList.length; i++) {
            const currentCar = getItemById('dbCars', carsIdList[i], true);
            currentCar.removeOwner();
            addItemToLocalStorage('dbCars', currentCar);
        }
    }

    removeItemFromLocalStorage(dbName, itemId);
}

function deleteFromContent(itemId) {
    const target = document.querySelector(`tr[data-id="${itemId}"]`);
    if (target) {
        target.remove();
    }
}

function carsManager(dbName, itemId) {
    const carsManager = document.getElementById('cars-manager');
    const owner = getItemById(dbName, itemId, true);
    const carsIds = owner.getCarsIdList();
    const carsDb = getFromLocalStorage('dbCars');
    let isCarForSale = false;
    let isCarForBuy = false;

    for (let i = 0; i < carsIds.length; i++) {
        isCarForSale = true;
        const carWrapper = createAndAppend(carsManager, 'div');
        createAndAppend(
            carWrapper, 
            'span', 
            `${getItemById('dbCars', carsIds[i], true).getTitle()} | 
             ${getItemById('dbCars', carsIds[i], true).getPrice()}$`
        );
        const btnSell = createInputButton(carWrapper, 'Sell');
        btnSell.addEventListener('click', sellButtonHandler);
        btnSell.dataset.car = carsIds[i];
        btnSell.dataset.owner = owner.getId();
        btnSell.dataset.db = dbName;
    }
    if (!isCarForSale) {
        const carWrapper = createAndAppend(carsManager, 'div');
        createAndAppend(carWrapper, 'div', 'No car to sell');
    }

    for (let i = 0; i < carsDb.length; i++) {
        if (!carsDb[i].owner) {
            isCarForBuy = true;
            const carWrapper = createAndAppend(carsManager, 'div');
            createAndAppend(carWrapper, 'span', `${carsDb[i].title} | ${carsDb[i].price}$`);

            const btnBuy = createInputButton(carWrapper, 'Buy');
            btnBuy.addEventListener('click', buyButtonHandler);
            btnBuy.dataset.car = carsDb[i].id;
            btnBuy.dataset.owner = owner.getId();
            btnBuy.dataset.db = dbName;
        }
    }
    if (!isCarForBuy) {
        const carWrapper = createAndAppend(carsManager, 'div');
        createAndAppend(carWrapper, 'div', 'No car for buy');
    }
}

