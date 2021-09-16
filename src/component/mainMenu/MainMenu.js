import React, { useState, useEffect } from 'react';

import SideBar from "./MenuBar/SideBar";
import { BrowserRouter, Switch, Route,Redirect } from 'react-router-dom';
import ListIncomeCatalog from "../IncomeCatalog/ListIncomeCatalog";
import AddIncomeCatalog from "../IncomeCatalog/AddIncomeCatalog";
import EditIncomeCatalog from "../IncomeCatalog/EditIncomeCatalog";
import ListTaxRate from "../TaxRate/ListTaxRate";
import AddTaxRate from "../TaxRate/AddTaxRate";
import EditTaxRate from "../TaxRate/EditTaxRate";
import ListTaxDeductDetail from "../TaxDeductDetail/ListTaxDeductDetail";
import ListTaxDeduct from "../TaxDeduct/ListTaxDeduct";
import AddTaxDeduct from "../TaxDeduct/AddTaxDeduct";
import EditTaxDeduct from "../TaxDeduct/EditTaxDeduct";
import ListTaxDeductGroup from "../TaxDeductGroup/ListTaxDeductGroup";
import AddTaxDeductGroup from "../TaxDeductGroup/AddTaxDeductGroup";
import EditTaxDeductGroup from "../TaxDeductGroup/EditTaxDeductGroup";
import ListTaxDeductGroupDetail from "../TaxDeductGroupDetail/ListTaxDeductGroupDetail";
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
     <BrowserRouter basename={'/tax'}>
    {/* <BrowserRouter> */}
    <div className="Main wrapper">
        <SideBar toggle={toggleSidebar} isOpen={sidebarIsOpen}/>
      <Container
        fluid
        className={classNames("content", { "is-open": sidebarIsOpen })}
      >
        <Topbar toggleSidebar={toggleSidebar} />
        <Switch>
        <Route path="/home/homeTwo" exact component={PageTwo}></Route>
        <Route path="/about" exact component={About}></Route>
        <Route path="/examRound" exact component={ExamRound}></Route>
        <Route path="/listRole" exact component={ListRole}></Route>
        <Route path="/addRole" exact component={AddRole}></Route>
        <Route path="/editRole" exact component={EditRole}></Route>
        <Route path="/listUserRole" exact component={ListUserRole}></Route>
        <Route path="/addUserRole" exact component={AddUserRole}></Route>
        <Route path="/editUserRole" exact component={EditUserRole}></Route>
        <Route path="/listIncomeCatalog" exact component={ListIncomeCatalog}></Route>
        <Route path="/addIncomeCatalog" exact component={AddIncomeCatalog}></Route>
        <Route path="/editIncomeCatalog" exact component={EditIncomeCatalog}></Route>
        <Route path="/listTaxRate" exact component={ListTaxRate}></Route>
        <Route path="/addTaxRate" exact component={AddTaxRate}></Route>
        <Route path="/editTaxRate" exact component={EditTaxRate}></Route>

        <Route path="/listTaxDeduct" exact component={ListTaxDeduct}></Route>
        <Route path="/addTaxDeduct" exact component={AddTaxDeduct}></Route>
        <Route path="/editTaxDeduct" exact component={EditTaxDeduct}></Route>
        <Route path="/listTaxDeductDetail" exact component={ListTaxDeductDetail}></Route>
        
        <Route path="/listTaxDeductGroup" exact component={ListTaxDeductGroup}></Route>
        <Route path="/addTaxDeductGroup" exact component={AddTaxDeductGroup}></Route>
        <Route path="/editTaxDeductGroup" exact component={EditTaxDeductGroup}></Route>
        <Route path="/listTaxDeductGroupDetail" exact component={ListTaxDeductGroupDetail}></Route>
        
      </Switch>
     </Container>
      </div>
      
      
    </BrowserRouter>
  );
}


export default MainMenu;