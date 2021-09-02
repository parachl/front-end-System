import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import { AuthenService } from '../../../_services/authen.service';
import { useHistory } from 'react-router-dom';
import {
  Navbar,
  Button,
} from "reactstrap";

const Topbar = ({ toggleSidebar }) => {
  const history = useHistory();
  function logOut() {
    AuthenService.logout();
    history.push("/logOut");
  }

  const styleButton = {
    background: '#007ac2',
  };

  const styleButtonLogOut = {
    background: '#007ac2',
    marginLeft: '1450px',
  };

  return (
    <Navbar
      color="light"
      light
      className="navbar shadow-sm p-3 mb-4 bg-white rounded"
      expand="md">
      <Button  style={styleButton} onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faAlignLeft} />
      </Button>
      {/* <NavbarToggler onClick={toggleTopbar} /> */}
      <Button  style={styleButtonLogOut} onClick={() => logOut()}>
      LogOut
      </Button>
    </Navbar>
  );
};

export default Topbar;