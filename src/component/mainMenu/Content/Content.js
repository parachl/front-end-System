import React,{useState} from "react";
import classNames from "classnames";
import { Container } from "reactstrap";
import { Switch, Route } from "react-router-dom";
import PageOne from "../../pageOne/PageOne.js";
import PageTwo from "../../pageTwo/PageTwo.js";

import Topbar from "../TopBar/TopBar.js";


const Content = ({ sidebarIsOpen, toggleSidebar,path }) => {
    const [toggle,setToggle] = useState(false);
    const [menuUse,setMenu] = useState(path);

    return (
  <Container
    fluid
    className={classNames("content", { "is-open": sidebarIsOpen })}
  >
    <Topbar toggleSidebar={toggleSidebar} />
  </Container>
    );
}

export default Content;