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
getBoard();
setInterval(getBoard, 60000);

//Операции с деньгами
let newMoneyManager = new MoneyManager();

newMoneyManager.addMoneyCallback = (data) => ApiConnector.addMoney(data, response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
    newMoneyManager.setMessage(response.success, response.error || 'Баланс успешно пополнен');
});

newMoneyManager.conversionMoneyCallback = (data) => ApiConnector.convertMoney(data, response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
    newMoneyManager.setMessage(response.success, response.error || 'Деньги успешно сконвертированы');
});

newMoneyManager.sendMoneyCallback = (data) => ApiConnector.transferMoney(data, response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
    newMoneyManager.setMessage(response.success, response.error || 'Деньги успешно отправлены');
});

//Работа с избранным
let favorites = new FavoritesWidget();

ApiConnector.getFavorites((response) => {
    if (response.success) {
        favorites.clearTable();
        favorites.fillTable(response.data);
    }
    newMoneyManager.updateUsersList(response.data);
});

favorites.addUserCallback = (data) => ApiConnector.addUserToFavorites(data, response => {
    if (response.success) {
        favorites.clearTable();
        favorites.fillTable(response.data);
    }
    favorites.setMessage(response.success, response.error || 'Пользователь успешно добавлен');
    newMoneyManager.updateUsersList(response.data);
});

favorites.removeUserCallback = (data) => ApiConnector.removeUserFromFavorites(data, response => {
    if (response.success) {
        favorites.clearTable();
        favorites.fillTable(response.data);
    }
    favorites.setMessage(response.success, response.error || 'Пользователь успешно удален');
    newMoneyManager.updateUsersList(response.data);
});