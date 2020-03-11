'use strict';

function createAndAppend(parent, tagName, content) {
    const tag = document.createElement(`${tagName}`);

    if (content) {
        tag.innerHTML = content;
    }

    parent.appendChild(tag);

    return parent.lastElementChild;
}

function createInputText(parent, name, placeholder) {
    const textInput = createAndAppend(parent, 'input');
    textInput.setAttribute('name', name);

    if (placeholder) {
        textInput.setAttribute('placeholder', placeholder);
    }
    
    textInput.classList.add('input-text');

    return parent.lastElementChild;
}

function createInputButton(parent, value) {
    const button = createAndAppend(parent, 'input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', value);
    button.classList.add('input-button');
    
    return parent.lastElementChild;
}

function addItemToLocalStorage(dbName, item) {
    const db = getFromLocalStorage(dbName);

    for (let i = 0; i < db.length; i++) {
        if (item.getId() === db[i].id) {
            db.splice(i, 1);
            break;
        }
    }
    db.push(item);
    localStorage.setItem(dbName, JSON.stringify(db));
}

function removeItemFromLocalStorage(dbName, itemId) {
    const db = getFromLocalStorage(dbName);

    for (let i = 0; i < db.length; i++) {
        if (db[i].id === itemId) {
            db.splice(i, 1);
            break;
        }
    }

    localStorage.setItem(dbName, JSON.stringify(db));
}

function getFromLocalStorage(dbName) {
    return JSON.parse(localStorage.getItem(dbName)) || [];
}

function getItemById(dbName, itemId, setPrototype = false) {
    const db = getFromLocalStorage(dbName);
    let item;
    for (let i = 0; i < db.length; i++) {
        if (db[i].id === itemId) {
            item = db[i];

            if (setPrototype) {
                switch (dbName) {
                    case 'dbCars':
                        Object.setPrototypeOf(item, new Car);
                        break;
                    case 'dbPersons':
                        Object.setPrototypeOf(item, new Person);
                        break;
                    case 'dbCompanies':
                        Object.setPrototypeOf(item, new Company);
                        break;
                }
            }
            return item;
        }
    }
    return false;
}

function getPrototypedCollection(dbName) {
    const db = getFromLocalStorage(dbName);
    switch (dbName) {
        case 'dbCars':
            
            break;
        case 'dbPersons':
            
            break;
        case 'dbCompanies':
        
        break;
    }
    return db;
}

function getUniqueId() {
    return Math.floor((Date.now() * Math.random()) % 100000).toString();
}

function checkFieldsWithRegExp(obj) {
    const regTemplate = {
        name: /^[A-Z][a-z]{1,30} [A-Z][a-z]{1,30}$/,
        title: /^[A-Z][A-z]{1,30}( [A-Z][a-z]{1,30}| \d{1,3})*$/,
        price: /^\d+$/,
        balance: /^-?\d+$/,
    }

    for (let key in obj) {
        if (key === 'id' || key === 'owner') {
            continue;
        }
        const result = obj[key].match(regTemplate[key]);
        result ? obj[key] = result[0] : obj[key] = false;
    }

    return obj;
}

function errorMessage(key) {
    const fieldName = key.split('')[0].toUpperCase() + key.slice(1);

    const errorWrapper = document.createElement('div');
    errorWrapper.classList.add('error-message');
    errorWrapper.innerHTML = `Field ${fieldName} has incorrect input`;

    return errorWrapper;
}

function removeDomElementsByClass(className) {
    const elements = document.querySelectorAll(`.${className}`);
    for (let i = 0; i < elements.length; i++) {
        elements[i].remove();
    }
}

function removeDomElementById(id) {
    const elem = document.getElementById(id);
    if (elem) {
        elem.remove();
    }
}

