import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { hidePopup } from "../../redux/action/popup.action";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

export const Popup = () => {
  const dispatch = useDispatch();
  const { isShow } = useSelector((state) => state.popup);
  // const handleAction = () => {
  //   action();
  //   dispatch(hidePopup());
  // }
  useEffect(() => {
    console.log('popup',isShow);
    if(isShow === true){
      setTimeout(function() {
        dispatch(hidePopup());
      }, 4000);
    }

  }, []);

  const toggle = () => dispatch(hidePopup());

  return (
    isShow &&<Stack sx={{ width: '100%' }} spacing={2}>
    <Alert severity="success">
        <AlertTitle>บันทึกสำเร็จ</AlertTitle>
      </Alert>
      </Stack>
    // <Modal isOpen={isShow} toggle={toggle}>
    //   <ModalHeader toggle={toggle}>{title}</ModalHeader>
    //   <ModalBody>
    //     {description}
    //   </ModalBody>
    //   <ModalFooter>
    //     <Button color="primary" onClick={handleAction}>
    //       OK
    //     </Button>{" "}
    //     <Button color="secondary" onClick={toggle}>
    //       Cancel
    //     </Button>
    //   </ModalFooter>
    // </Modal>
  );
};
