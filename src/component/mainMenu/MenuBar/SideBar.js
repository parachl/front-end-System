import React,{ useEffect,useState} from 'react';
import classNames from "classnames";
import { Nav } from 'reactstrap';
import '../MainMenu.css';
import SubMenu from './SubMenu';
import { get } from 'lodash';
import {useDispatch} from 'react-redux';
import { showSpinner  } from '../../../action/Constants.action';
import { hideSpinner } from '../../../action/Constants.action';

const SideBar = ({ isOpen, toggle }) => {
  // const [menus, setMenus] = useState([]);
    const menus = JSON.parse(localStorage.getItem('listMenu'));
    const dispathch = useDispatch();

    useEffect(() => {
      dispathch(showSpinner());
      // setMenus(menu);
      dispathch(hideSpinner())
    },[]);
  
  // if(menus !== null){
    return (
      <div className={classNames("sidebar", { "is-open": isOpen })}>
        <div className="sidebar-header">
          <span color="info" onClick={toggle} style={{ color: "#fff" }}>
            &times;
          </span>
          <h3>Bootstrap Sidebar</h3>
        </div>
        <div className="side-menu">
          <Nav vertical className="list-unstyled pb-3">
            <p>Dummy Heading</p>
            {get(menus,'listGroupMenu',[]) != null && get(menus,'listGroupMenu',[]).map((item, index) => {
              return (<SubMenu item={item} key={index} />
              )
            })
            }
          </Nav>
        </div>
      </div>
  
    );
  // }else{
  //   return (
  //     <div></div>
  //   );
  // }
  
}

export default SideBar;