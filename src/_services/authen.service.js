import { handleResponse } from './handle-response';
import { BehaviorSubject } from 'rxjs';
import axios from "axios";
import api from "../../src/api/GetApi";

const baseURL = "http://localhost:8080/demo/";
export const AuthenService = {
    checkPermission,
    login,
    logout,
    callApi
};


function checkPermission(menu, action) {
    let result = false;
    const listMenu = JSON.parse(localStorage.getItem('listMenu'));
    let found = false;
    console.log('listMenu >', listMenu);
    for (let i = 0; i < listMenu.listGroupMenu.length; i++) {
        if (undefined !== listMenu.listGroupMenu[i].listMenu && null !== listMenu.listGroupMenu[i].listMenu && !found) {
            for (let e = 0; e < listMenu.listGroupMenu[i].listMenu.length; e++) {
                if (menu === listMenu.listGroupMenu[i].listMenu[e].menuName && !found) {
                    if (listMenu.listGroupMenu[i].listMenu[e].roleRight.indexOf(action) !== -1 && !found) {
                        result = true;
                        found = true;
                    }
                    if (menu === listMenu.listGroupMenu[i].listMenu[e].menuName && action === 'L') {
                        result = true;
                        found = true;
                    }
                }
            }
        } else if ((undefined === listMenu.listGroupMenu[i].listMenu && !found) || (null === listMenu.listGroupMenu[i].listMenu && !found)) {
            if (menu === listMenu.listGroupMenu[i].groupMenuName) {
                if (listMenu.listGroupMenu[i].roleRight.indexOf(action) !== -1) {
                    result = true;
                    found = true;
                }
            }
        }
    }
    // result = listMenu.includes(menu);
    return result;

}

function login(username, password) {
    const userObj = { userName:username, password:password };
    let user = null;
    console.log('login userObj', userObj);
    const { status, data } =  api.post("/verifyLogin", userObj);
    if (status === 200) {
        if (data.isLogin) {
            localStorage.setItem('currentUser', JSON.stringify(data));
            // login(user);
        } else {
            alert('username or password is incorrect');
        }
    } else {
        alert('error');
    }

    return data;
}


function callApi(type) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    console.log('callApi user',user);
    let defaultOptions = {};
    if(user && user.token){
         defaultOptions = {
            baseURL,
            method: [type],
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8",
                Authorization: 'Bearer ' + user.token
            },
        };
    }else{
        defaultOptions = {
            baseURL,
            method: [type],
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8",
            },
        };
    }
// if(type === 'post'){
//     axios.post(baseURL+path, userObj, {
//         headers: {
//                         Accept: "application/json",
//                         "Content-Type": "application/json; charset=utf-8",
//                         Authorization: 'Bearer ' + userObj.token
//                     },
//       })
//       .then((response) => {
//         console.log('response data',response.data[0]);
//         return response.data[0];
//       })
//       .catch((error) => {
       
//       })
// }
   
  
    return axios.create(defaultOptions);
}




function logout() {
    // remove user from local storage to log user out
    localStorage.clear();
    
}