import React, { useState, useEffect } from 'react';

import SideBar from "./MenuBar/SideBar";
import { BrowserRouter, Switch, Route,Redirect } from 'react-router-dom';
import PageOne from "../pageOne/PageOne";
import PageTwo from "../pageTwo/PageTwo";
import ExamRound from "../Exam/ExamRound";
import AddRole from "../role/AddRole";
import EditRole from "../role/EditRole";
import ListRole from "../role/ListRole";
import AddUserRole from "../userRole/AddUserRole";
import EditUserRole from "../userRole/EditUserRole";
import ListUserRole from "../userRole/ListUserRole";
import { Container } from "reactstrap";
import classNames from "classnames";
import Topbar from "./TopBar/TopBar";
import About from "../about/About";
import {useDispatch} from 'react-redux';
import { showSpinner  } from '../../action/Constants.action';
import { hideSpinner } from '../../action/Constants.action';
import { authenticationService } from '../../_services/authentication.service';
import LoginPage from '../login/Login';
import api from '../../api/GetApi';

const MainMenu = () => {
  const [sidebarIsOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);

  const dispathch = useDispatch();

  const [data, setData] = useState({});
  
  const fetcData = async () => {
    console.log('test test');
    const menus = JSON.parse(localStorage.getItem('listMenu'));
    setData(menus);
    
}

  useEffect(() => {
    
    dispathch(showSpinner());
    fetcData();
    // authenticationService.getMenu();
    setTimeout(function() {
      dispathch(hideSpinner())
    }, 300);
    
 
  },[]);   

  return (
    <BrowserRouter>
    <div className="Main wrapper">
        <SideBar toggle={toggleSidebar} isOpen={sidebarIsOpen}/>
      <Container
        fluid
        className={classNames("content", { "is-open": sidebarIsOpen })}
      >
        <Topbar toggleSidebar={toggleSidebar} />
        <Switch>
        <Route path="/home/homeOne" exact component={PageOne}></Route>
        <Route path="/home/homeTwo" exact component={PageTwo}></Route>
        <Route path="/about" exact component={About}></Route>
        <Route path="/examRound" exact component={ExamRound}></Route>
        <Route path="/listRole" exact component={ListRole}></Route>
        <Route path="/addRole" exact component={AddRole}></Route>
        <Route path="/editRole" exact component={EditRole}></Route>
        <Route path="/listUserRole" exact component={ListUserRole}></Route>
        <Route path="/addUserRole" exact component={AddUserRole}></Route>
        <Route path="/editUserRole" exact component={EditUserRole}></Route>
      </Switch>
     </Container>
      </div>
      
      
    </BrowserRouter>
  );
}


export default MainMenu;