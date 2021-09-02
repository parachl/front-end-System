import React, { useState, useEffect } from 'react';
import { Container } from './Container';
import { Wrapper } from './Wrapper';
import styles from './Login.module.css';
import { useHistory } from 'react-router-dom';
import logo from '../../image/Thai-Life-Logo.jpg';
import { Button } from 'reactstrap';
import { AuthenService } from '../../_services/authen.service';
import api from '../../api/GetApi';
import apiLogin from '../../api/GetApiLogin';
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    localStorage.clear();
    const history = useHistory();

    const styleButtonLogin = {
        background: '#007ac2',
      };

    const verifyLogin = async (username, password) => {
        const userName = username;
        const userObj = { userName,password };
        console.log('userObj', userObj);
        // AuthenService.login(username,password);
        //  const user = JSON.parse(localStorage.getItem('currentUser'));
        //  console.log('userObj user', user);
         const { status, data } = await api.post("/verifyLogin", userObj);
         if (status === 200) {
             if (data.isLogin) {
                console.log('verifyLogin data', data);
                 localStorage.setItem('currentUser', JSON.stringify(data));
                 login(userObj);
             } else {
                 alert('username or password is incorrect');
             }
         } else {
             alert('error');
         }

    }

    const login = async (userObj) => {
        // const { status, data } = AuthenService.callApi(user,"/getMenu","GET").get("/role/listRole");
        const requestOne = await AuthenService.callApi("POST").post("/getMenu",userObj);
        const requestTwo = await AuthenService.callApi("POST").post("/listMenu",userObj);
   
        axios
            .all([requestOne, requestTwo])
            .then(
                axios.spread((...responses) => {
                    const responseOne = responses[0];
                    const responseTwo = responses[1];
                    if (responseOne.status === 200) {
                        console.log("data >>", responseOne.data);
                        localStorage.setItem('listMenu', JSON.stringify(responseOne.data));
                        history.push("/main");

                    } else {
                        alert('error');
                    }
                    if (responseTwo.status === 200) {
                        console.log("data >>", responseTwo.data);
                        localStorage.setItem('listMenuSetting', JSON.stringify(responseTwo.data));

                    } else {
                        alert('error');
                    }
                })
            )
            .catch(errors => {
                // react on errors.
                console.error(errors);
            });



    }

    return (
        <Container>
            <Wrapper>
                <form>
                    <div className={styles.smBox}>
                        <img className={styles.bglogo} alt={logo} src={logo} />
                        <h2 className={styles.textLogin}>Login</h2>
                    </div>
                    <div className="form-group">
                        <label>User</label>
                        <input type="email" className="form-control" placeholder="Enter user" value={username} onChange={(e) => {
                            setUsername(e.target.value);
                        }} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={(e) => {
                            setPassword(e.target.value);
                        }} />
                    </div>
                    <div className="text-center">
                        <Button type="button" style={styleButtonLogin} onClick={() => verifyLogin(username, password)}>Submit</Button>
                    </div>
                    <p>Version : 1.0.1</p>
                </form>
            </Wrapper>
        </Container>
    );
}

export default Login;