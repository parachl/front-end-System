import React, { useState, useEffect } from 'react';

import SideBar from "./MenuBar/SideBar";
import { withRouter,BrowserRouter, Switch, Route,Redirect } from 'react-router-dom';
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
import { showSpinner  } from '../../redux/action/Constants.action';
import { hideSpinner } from '../../redux/action/Constants.action';
import { authenticationService } from '../../_services/authentication.service';
import LoginPage from '../login/Login';
import api from '../../api/GetApi';
import ListTaxSystemInfo from '../TaxSystemInfo/ListTaxSystemInfo';
import AddTaxSystemInfo from "../TaxSystemInfo/AddTaxSystemInfo";
import EditTaxSystemInfo from "../TaxSystemInfo/EditTaxSystemInfo";
import ListTaxOpcode from '../TaxOpcode/ListTaxOpcode';
import AddTaxOpcode from "../TaxOpcode/AddTaxOpcode";
import EditTaxOpcode from "../TaxOpcode/EditTaxOpcode";
import {Popup} from '../reuse/Shared'

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
    }, 1000);
    
 
  },[]);   

  return (
     <BrowserRouter basename={'/tax'}>
       
    {/* //  <BrowserRouter>  */}
    <div className="Main wrapper">
        <SideBar toggle={toggleSidebar} isOpen={sidebarIsOpen}/>
      <Container
        fluid
        className={classNames("content", { "is-open": sidebarIsOpen })}
      >
        <Topbar toggleSidebar={toggleSidebar} />
        <Switch>
        {/* <Popup/> */}
        <Route path="/listRole" render={(props) => <ListRole {...props}/> } />
<Route path="/addRole" render={(props) => <AddRole {...props}/> } />
<Route path="/editRole" render={(props) => <EditRole {...props}/> } />
<Route path="/listUserRole" render={(props) => <ListUserRole {...props}/> } />
<Route path="/addUserRole" render={(props) => <AddUserRole {...props}/> } />
<Route path="/editUserRole" render={(props) => <EditUserRole {...props}/> } />
<Route path="/listIncomeCatalog" render={(props) => <ListIncomeCatalog {...props}/> } />
<Route path="/addIncomeCatalog" render={(props) => <AddIncomeCatalog {...props}/> } />
<Route path="/editIncomeCatalog" render={(props) => <EditIncomeCatalog {...props}/> } />
<Route path="/listTaxRate" render={(props) => <ListTaxRate {...props}/> } />
<Route path="/addTaxRate" render={(props) => <AddTaxRate {...props}/> } />
<Route path="/editTaxRate" render={(props) => <EditTaxRate {...props}/> } />

<Route path="/listTaxDeduct" render={(props) => <ListTaxDeduct {...props}/> } />
<Route path="/addTaxDeduct" render={(props) => <AddTaxDeduct {...props}/> } />
<Route path="/editTaxDeduct" render={(props) => <EditTaxDeduct {...props}/> } />
<Route path="/listTaxDeductDetail" render={(props) => <ListTaxDeductDetail {...props}/> } />

<Route path="/listTaxDeductGroup" render={(props) => <ListTaxDeductGroup {...props}/> } />
<Route path="/addTaxDeductGroup" render={(props) => <AddTaxDeductGroup {...props}/> } />
<Route path="/editTaxDeductGroup" render={(props) => <EditTaxDeductGroup {...props}/> } />
<Route path="/listTaxDeductGroupDetail" render={(props) => <ListTaxDeductGroupDetail {...props}/> } />

<Route path="/listTaxSystemInfo" render={(props) => <ListTaxSystemInfo {...props}/> } />
<Route path="/addTaxSystemInfo" render={(props) => <AddTaxSystemInfo {...props}/> } />
<Route path="/editTaxSystemInfo" render={(props) => <EditTaxSystemInfo {...props}/> } />

<Route path="/listOpcode" render={(props) => <ListTaxOpcode {...props}/> } />
<Route path="/addTaxOpcode" render={(props) => <AddTaxOpcode {...props}/> } />
<Route path="/editTaxOpcode" render={(props) => <EditTaxOpcode {...props}/> } />
        
        {/* <Route path="/home/homeTwo" exact component={PageTwo}></Route>
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

        <Route path="/listTaxSystemInfo" exact component={ListTaxSystemInfo}></Route>
        <Route path="/addTaxSystemInfo" exact component={AddTaxSystemInfo}></Route>
        <Route path="/editTaxSystemInfo" exact component={EditTaxSystemInfo}></Route>

        <Route path="/listOpcode" exact component={ListTaxOpcode}></Route>
        <Route path="/addTaxOpcode" exact component={AddTaxOpcode}></Route>
        <Route path="/editTaxOpcode" exact component={EditTaxOpcode}></Route> */}
        
      </Switch>
     </Container>
      </div>
      
      
    </BrowserRouter>
  );
}


export default withRouter(MainMenu);