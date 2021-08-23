import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { hidePopup } from "../../action/popup.action";

export const Popup = () => {
  const dispatch = useDispatch();
  const { isShow, title, description, action } = useSelector((state) => state.popup);

  const handleAction = () => {
    action();
    dispatch(hidePopup());
  }

  const toggle = () => dispatch(hidePopup());

  return (
    <Modal isOpen={isShow} toggle={toggle}>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>
        {description}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleAction}>
          OK
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
