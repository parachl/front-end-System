import React, { useEffect } from 'react';


import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { BrowserRouter , Switch ,Route , Redirect} from 'react-router-dom';
import MainMenu from './component/mainMenu/MainMenu.js';
import LoginPage from './component/login/Login.js';
import './component/mainMenu/MainMenu.css';
import FullPageLoader from './component/fullPageLoader/FullPageLoader';
import { showSpinner  } from './action/Constants.action';
import { hideSpinner } from './action/Constants.action';
import {useDispatch} from 'react-redux';
import {library} from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'

function App() {
  
  library.add(fas);
  const dispathch = useDispatch();

  // useEffect(() => {
  //     dispathch(showSpinner());
  //     setTimeout(function() {
  //       dispathch(hideSpinner())
  //     }, 300);
      
  //   });

  return (
    
    <BrowserRouter>
    <FullPageLoader/>
    {/* <div className="Main wrapper"> */}
    {/* <SideBar toggle={toggleSidebar} isOpen={sidebarIsOpen} /> */}
        <Switch>
          {/* <Route as={Link} to='/covid'></Route> */}
        <Route path="/login" render={(props) => <LoginPage {...props}/> } />
        <Route path="/main" render={(props) => <MainMenu {...props}/> } />
        {/* <Route path="/about" exact component={About}></Route>
        <Route path="/home/homeOne" exact component={PageOne}></Route>
        <Route path="/home/homeTwo" exact component={PageTwo}></Route> */}
          <Redirect from="*" to="/login"/>
        </Switch>
        {/* </div> */}
      </BrowserRouter>
    
    
  );
}

export default App;
