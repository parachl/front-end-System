// import { BehaviorSubject } from 'rxjs';

// import config from 'config';
import React, { useState } from 'react';
import { handleResponse } from './handle-response';
import api from "../api/GetApi";
// const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    getMenu,

    // currentUser: currentUserSubject.asObservable(),
    // get currentUserValue () { return currentUserSubject.value }
};

const baseURL = "localhost:8080/demo/api";

function login(username, password) {
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ username, password })
    //     };

    //     return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
    //         .then(handleResponse)
    //         .then(user => {
    //             // store user details and jwt token in local storage to keep user logged in between page refreshes
    //             localStorage.setItem('currentUser', JSON.stringify(user));
    //             currentUserSubject.next(user);

    //             return user;
    //         });
}


function getMenu() {
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // currentUserSubject.next(null);
}
