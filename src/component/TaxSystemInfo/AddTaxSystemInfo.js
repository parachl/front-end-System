import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSpinner } from '../../redux/action/Constants.action';
import { hideSpinner } from '../../redux/action/Constants.action';
import { AuthenService } from '../../_services/authen.service';
import { useHistory, withRouter, useLocation } from 'react-router-dom';
import { PageBox } from '../reuse/PageBox';
import styled from "styled-components";
import { FormGroup, Label, Row, Col, Form, Input, Container,FormFeedback } from 'reactstrap';
import FormControl from '@material-ui/core/FormControl';
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
import "react-datepicker/dist/react-datepicker.css";
import { SelectCustom } from '../reuse/SelectCustom';
import {styleDivButton,styleButton,styleButtonCancel,required} from '../../themes/style';
// import Row from './Rows';
import { store } from "react-notifications-component";
import Swal from "sweetalert2";
import { fuctionService } from '../../_services/fuction.service';

const AddTaxSystemInfo = () => {
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

  const [systemId, setSystemId] = useState('');
  const [name, setName] = useState('');
  const [nameTh, setNameTh] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionTh, setDescriptionTh] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [status, setStatus] = useState('active');
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [createTime, setCreateTime] = useState(new Date());
  const [updateUser, setUpdateUser] = useState('');
  const [submit, setSubmit] = useState(false);
  let listStatus = [{ show: 'Active', value: 'active' }, { show: 'In Active', value: 'inactive' }];
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('currentUser'));

  const classes = useStyles();
  const initPage = () => {
    console.log('3');
    dispathch(showSpinner());
    setTimeout(function () {
      dispathch(hideSpinner())
    }, 500);

    const result = AuthenService.checkPermission('Tax Deduct', 'A');

    if (!result) {
      history.push("/main");
    }

  }

  const handleChangeStatus = (event) => {
    setStatus(event);
  };

  useEffect(() => {
    initPage();
    let maxId = fuctionService.genarateId(location.state.maxId+1);
    setSystemId(maxId);
  }, []);

  const submitAddTaxSystemInfo = async (systemId, name, nameTh, nameEn, description, descriptionTh, descriptionEn, status, effectiveDate) => {
    const taxSystemInfoObj = { systemId: systemId, name: name, nameTh: nameTh, nameEn: nameEn, description: description, descriptionTh: descriptionTh, descriptionEn: descriptionEn, status: status, effectiveDate: effectiveDate };
    setSubmit(true);
    if (taxSystemInfoObj.name === '' || taxSystemInfoObj.systemId === '' || taxSystemInfoObj.effectiveDate === '') {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      });
    } else {
      console.log('taxSystemInfoObj', taxSystemInfoObj);
      const { status, data } = await AuthenService.callApi("POST").post("/taxSystemInfo/addTaxSystemInfo", taxSystemInfoObj);
      console.log('data', data);
      if (data === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'บันทึกสำเร็จ',
        });
        history.push("/listTaxSystemInfo");
      } else if (data === 'duplicate') {
        Swal.fire({
          icon: 'warning',
          title: 'ข้อมูลซ้้ำ',
        });
      }
    }
  }

  function cancel() {
    history.push("/listTaxSystemInfo");
  }


  return (
    <PageBox>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              {/* <TableCell/> */}
              <TableCell style={{ width: 180, fontSize: 32 }}>รหัสระบบงาน </TableCell>
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
                          <Input className="form-group" type="text" value={systemId} onChange={(e) => {
                        setSystemId(e.target.value);
                      }} placeholder="with a placeholder" invalid={systemId === "" && submit} disabled />
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
                      }} placeholder="with a placeholder" style={{ width: 720}} />
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
                      }} placeholder="with a placeholder" style={{ width: 720}} />
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
                      }} placeholder="with a placeholder" style={{ width: 720}} />
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
                        <Label className="form-group" sm={4}>ผู้สร้าง  :</Label>
                        <Col sm={6}>
                          <FormControl className={classes.formControl}>
                            <Label className="form-group" sm={4}>{user.name}</Label>
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup row>
                        <Label className="form-group" sm={4}>วันที่สร้างล่าสุด  :</Label>
                        <Col sm={6}>
                          <FormControl className={classes.formControl}>
                            <DatePicker selected={createTime} onChange={(date) => setCreateTime(date)} disabled />
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
        <Button variant="contained" color="primary" style={styleButton} onClick={() => submitAddTaxSystemInfo(systemId, name, nameTh, nameEn, description, descriptionTh, descriptionEn, status, effectiveDate)}>
          Submit
        </Button>
        <Button variant="contained" style={styleButtonCancel} onClick={() => cancel()}>
          Cancel
        </Button>
      </div>
    </PageBox>
  );
}

export default withRouter(AddTaxSystemInfo);