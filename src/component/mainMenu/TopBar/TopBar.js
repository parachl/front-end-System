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
    marginLeft: '1450px',
  };

  return (
    <Navbar
      color="light"
      light
      className="navbar shadow-sm p-3 mb-4 bg-white rounded"
      expand="md">
      <Button color="info" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faAlignLeft} />
      </Button>
      {/* <NavbarToggler onClick={toggleTopbar} /> */}
      <Button color="info"  style={styleButton} onClick={() => logOut()}>
      LogOut
      </Button>
    </Navbar>
  );
};

export default Topbar;