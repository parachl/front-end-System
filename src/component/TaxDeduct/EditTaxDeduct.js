import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSpinner } from '../../redux/action/Constants.action';
import { hideSpinner } from '../../redux/action/Constants.action';
import { AuthenService } from '../../_services/authen.service';
import { useHistory, withRouter, useLocation } from 'react-router-dom';
import { PageBox } from '../reuse/PageBox';
import styled from "styled-components";
import { FormGroup, Label, Row, Col, Form, Input, Container, FormFeedback } from 'reactstrap';
import api from "../../api/GetApi";
import { get } from 'lodash';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { InputLabelReuse } from '../reuse/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import DatePicker from "react-datepicker";
import { SelectCustom } from '../reuse/SelectCustom';
import FormControl from '@material-ui/core/FormControl';
import { styleDivButton, styleButton, styleButtonCancel, required } from '../../themes/style';

import { showPopup } from '../../redux/action/Constants.action';
import { store } from "react-notifications-component";
import Swal from "sweetalert2";
// import Row from './Rows';


const EditTaxDeduct = () => {
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    }, formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    }
  }));
  const dispathch = useDispatch();
  const history = useHistory();

  const [taxDeductId, setTaxDeductId] = useState('');
  const [name, setName] = useState('');
  const [nameTh, setNameTh] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionTh, setDescriptionTh] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [status, setStatus] = useState('active');
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [updateTime, setUpdateTime] = useState(new Date());
  const [updateUser, setUpdateUser] = useState('');
  const location = useLocation();
  const [submit, setSubmit] = useState(false);
  let listStatus = [{ show: 'Active', value: 'active' }, { show: 'In Active', value: 'inactive' }];
  const user = JSON.parse(localStorage.getItem('currentUser'));

  const classes = useStyles();

  const initPage = (taxDeductId) => {
    dispathch(showSpinner());
    setTimeout(function () {
      dispathch(hideSpinner())
    }, 500);

    const result = AuthenService.checkPermission('Tax Deduct', 'E');

    if (!result) {
      history.push("/main");
    }
    fetcData(taxDeductId);
  }

  const fetcData = async (taxDeductId) => {
    console.log('fetcData taxDeductId > ', taxDeductId);
    const { status, data } = await AuthenService.callApi("GET").get("/taxDeduct/findById?taxDeductId=" + taxDeductId);

    if (status === 200) {
      console.log('fetcData taxDeductId data > ', data);
      setTaxDeductId(data.taxDeductId);
      setName(data.name);
      setNameTh(data.nameTh);
      setNameEn(data.nameEn);
      setDescription(data.description);
      setDescriptionTh(data.descriptionTh);
      setDescriptionEn(data.descriptionEn);
      setStatus(data.status);
      setEffectiveDate(new Date(data.effectiveDate));
      if (data.updateTime !== null) {
        setUpdateTime(new Date(data.updateTime));
      }
      setUpdateUser(data.updateUser);
    } else {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
      });
    }

  }

  useEffect(() => {
    initPage(location.state.taxDeductId);

  }, []);

  const handleChangeStatus = (event) => {
    setStatus(event);
  };

  const submitEditTaxDeduct = async (taxDeductId, name, nameTh, nameEn, description, descriptionTh, descriptionEn, status, effectiveDate) => {
    const taxDeductObj = { taxDeductId: location.state.taxDeductId, name: name, nameTh: nameTh, nameEn: nameEn, description: description, descriptionTh: descriptionTh, descriptionEn: descriptionEn, status: status, effectiveDate: effectiveDate };
    setSubmit(true);
    if (taxDeductObj.name === '' || taxDeductObj.taxDeductId === '' || taxDeductObj.effectiveDate === '') {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      });
    } else {
      console.log('taxDeductObj', taxDeductObj);
      const { status, data } = await AuthenService.callApi("POST").post("/taxDeduct/editTaxDeduct", taxDeductObj);
      console.log('data', data);
      if (data === 'success') {
        // store.addNotification({
        //   title: "บันทึกสำเร็จ",
        //   message: " ",
        //   type: "success",
        //   insert: "bottom",
        //   container: "bottom-full",
        //   animationIn: [ "animate__fadeIn"],
        //   animationOut: [ "animate__fadeOut"],
        //   dismiss: {
        //     duration: 5000,
        //   }
        // });
        Swal.fire({
          icon: 'success',
          title: 'บันทึกสำเร็จ',
        });
        history.push("/listTaxDeduct");
      } else if (data === 'duplicate') {
       
        Swal.fire({
          icon: 'warning',
          title: 'ข้อมูลซ้้ำ',
        });
      }
    }
  }

  function cancel() {
    history.push("/listTaxDeduct");
  }

  return (
    <PageBox>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              {/* <TableCell/> */}
              <TableCell style={{ width: 180, fontSize: 32 }}>รหัสลดหย่อนภาษี </TableCell>
            </TableRow>
            <TableRow>
              <FormGroup style={{ width: 1080, padding: 15 }}>
                <Container>
                  <Row >
                    <Col>
                      <FormGroup row>
                        <Label className="form-group" sm={4}>รหัส<label style={required}>{"*"}</label></Label>
                        <Col sm={7}>
                          <FormControl className={classes.formControl}>
                            <Input className="form-group" type="text" value={taxDeductId} onChange={(e) => {
                              setTaxDeductId(e.target.value);
                            }} placeholder="with a placeholder" invalid={taxDeductId === "" && submit} />
                            <FormFeedback>กรุณาระบุบข้อมูล</FormFeedback>
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup row>
                        <Label className="form-group" sm={3}>ชื่อ<label style={required}>{"*"}</label></Label>
                        <Col sm={7}>
                          <FormControl className={classes.formControl}>
                            <Input className="form-group" type="text" value={name} onChange={(e) => {
                              setName(e.target.value);
                            }} placeholder="with a placeholder" invalid={name === "" && submit} />
                            <FormFeedback>กรุณาระบุบข้อมูล</FormFeedback>
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup row>
                        <Label className="form-group" sm={4}>ชื่อ (TH)</Label>
                        <Col sm={7}>
                          <FormControl className={classes.formControl}>
                            <Input className="form-group" type="text" value={nameTh} onChange={(e) => {
                              setNameTh(e.target.value);
                            }} placeholder="with a placeholder" />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup row>
                        <Label className="form-group" sm={3}>ชื่อ (EN)</Label>
                        <Col sm={7}>
                          <FormControl className={classes.formControl}>
                            <Input className="form-group" type="text" value={nameEn} onChange={(e) => {
                              setNameEn(e.target.value);
                            }} placeholder="with a placeholder" />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row >
                    <Col>
                      <FormGroup row>
                        <Label className="form-group" sm={2}>รายละเอียด</Label>
                        <Col sm={7}>
                          <FormControl className={classes.formControl}>
                            <Input className="form-group" type="textarea" value={description} onChange={(e) => {
                              setDescription(e.target.value);
                            }} placeholder="with a placeholder" style={{ width: 720 }} />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup row>
                        <Label className="form-group" sm={2}>รายละเอียด (TH)</Label>
                        <Col sm={7}>
                          <FormControl className={classes.formControl}>
                            <Input className="form-group" type="textarea" value={descriptionTh} onChange={(e) => {
                              setDescriptionTh(e.target.value);
                            }} placeholder="with a placeholder" style={{ width: 720 }} />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row >
                    <Col>
                      <FormGroup row>
                        <Label className="form-group" sm={2}>รายละเอียด (EN)</Label>
                        <Col sm={7}>
                          <FormControl className={classes.formControl}>
                            <Input className="form-group" type="textarea" value={descriptionEn} onChange={(e) => {
                              setDescriptionEn(e.target.value);
                            }} placeholder="with a placeholder" style={{ width: 720 }} />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row >
                    <Col>
                      <SelectCustom label="สถานะ :" value={status} listData={listStatus}
                        onChange={(e) => {
                          handleChangeStatus(e.target.value);
                        }} style={{ width: 180 }} />
                    </Col>
                    <Col>
                      <FormGroup row>
                        <Label className="form-group" sm={4}>วันที่มีผล<label style={required}>{"*"}</label></Label>
                        <Col sm={6}>
                          <FormControl className={classes.formControl}>
                            <DatePicker selected={effectiveDate} onChange={(date) => setEffectiveDate(date)} invalid={effectiveDate === "" && submit} />
                            <FormFeedback>กรุณาระบุบข้อมูล</FormFeedback>
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row >
                    <Col>
                      <FormGroup row>
                        <Label className="form-group" sm={4}>ผู้อัปเดตล่าสุด  :</Label>
                        <Col sm={6}>
                          <FormControl className={classes.formControl}>
                            <Label className="form-group" sm={4}>{updateUser}</Label>
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup row>
                        <Label className="form-group" sm={4}>วันที่อัปเดตล่าสุด  :</Label>
                        <Col sm={6}>
                          <FormControl className={classes.formControl}>
                            <DatePicker selected={updateTime} onChange={(date) => setUpdateTime(date)} disabled />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </Container>
              </FormGroup>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <div style={styleDivButton}>
        <Button variant="contained" color="primary" style={styleButton} onClick={() => {
          submitEditTaxDeduct(taxDeductId, name, nameTh, nameEn, description, descriptionTh, descriptionEn, status, effectiveDate)
        }}>
          Submit
        </Button>
        <Button variant="contained" style={styleButtonCancel} onClick={() => cancel()}>
          Cancel
        </Button>
      </div>
    </PageBox>
  );
}

export default withRouter(EditTaxDeduct);