'use strict';
//Выход из личного кабинета
let logoutBtn = new LogoutButton();

logoutBtn.action = () => ApiConnector.logout(response => {
    if (response.success) {
        location.reload();
    }
});

//Получение информации о пользователе
ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

//Получение текущих курсов валюты
let newRatesBoard = new RatesBoard();

function getBoard () {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            newRatesBoard.clearTable();
            newRatesBoard.fillTable(response.data);
        }
    });
}

setInterval(getBoard(), 60000);

//Операции с деньгами
let newMoneyManager = new MoneyManager();

newMoneyManager.addMoneyCallback = (data) => ApiConnector.addMoney(data, response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
        newMoneyManager.setMessage(response.success, 'Баланс успешно пополнен');
    } else {
        newMoneyManager.setMessage(response.error, 'Ошибка при пополнении баланса. Проверьте корректность введенных данных');
    }
});

newMoneyManager.conversionMoneyCallback = (data) => ApiConnector.convertMoney(data, response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
        newMoneyManager.setMessage(response.success, 'Деньги успешно сконвертированы');
    } else {
        newMoneyManager.setMessage(response.error, 'Ошибка при конвертации денежных средств. Проверьте корректность введенных данных');
    }
});

newMoneyManager.sendMoneyCallback = (data) => ApiConnector.transferMoney(data, response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
        newMoneyManager.setMessage(response.success, 'Деньги успешно отправлены');
    } else {
        newMoneyManager.setMessage(response.error, 'Ошибка при осуществлении перевода. Проверьте корректность введенных данных');
    }
});

//Работа с избранным
let favorites = new FavoritesWidget();

ApiConnector.getFavorites((response) => {
    if (response.success) {
        favorites.clearTable();
        favorites.fillTable(response.data);
    }
});

favorites.addUserCallback = (data) => ApiConnector.addUserToFavorites(data, response => {
    if (response.success) {
        favorites.clearTable();
        favorites.fillTable(response.data);
        favorites.setMessage(response.success, 'Пользователь успешно добавлен');
    } else {
        favorites.setMessage(response.error, 'Ошибка при добавлении пользователя');
    }
});

favorites.removeUserCallback = (data) => ApiConnector.removeUserFromFavorites(data, response => {
    if (response.success) {
        favorites.clearTable();
        favorites.fillTable(response.data);
        favorites.setMessage(response.success, 'Пользователь успешно удален');
    } else {
        favorites.setMessage(response.error, 'Ошибка при удалении пользователя');
    }
});