import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSpinner } from '../../redux/action/Constants.action';
import { hideSpinner } from '../../redux/action/Constants.action';
import { AuthenService } from '../../_services/authen.service';
import { useHistory,withRouter,useLocation } from 'react-router-dom';
import { PageBox } from '../reuse/PageBox';
import styled from "styled-components";
import { FormGroup, Label, Row, Col,Form,Input,Container,FormFeedback } from 'reactstrap';
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
import {styleDivButton,styleButton,styleButtonCancel,required} from '../../themes/style';
// import Row from './Rows';
import { store } from "react-notifications-component";
import Swal from "sweetalert2";

const EditTaxDeductGroup = () => {
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

  const [deductGroupId, setDeductGroupId] = useState('');
  const [name, setName] = useState('');
  const [nameTh, setNameTh] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionTh, setDescriptionTh] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [status, setStatus] = useState('active');
  const [amount, setAmount] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [createTime, setCreateTime] = useState(new Date());
  const [createUser, setCreateUser] = useState('');
  const [updateTime, setUpdateTime] = useState(new Date());
  const [updateUser, setUpdateUser] = useState('');
  const location = useLocation();
  const [submit, setSubmit] = useState(false);
  let listStatus = [{ show: 'Active', value: 'active' }, { show: 'In Active', value: 'inactive' }];
  const user = JSON.parse(localStorage.getItem('currentUser'));

  const classes = useStyles();
 
  const initPage = (deductGroupId) => {
    dispathch(showSpinner());
    setTimeout(function () {
      dispathch(hideSpinner())
    }, 500);

    const result = AuthenService.checkPermission('Tax Deduct Group', 'E');

    if (!result) {
      history.push("/main");
    }
    fetcData(deductGroupId);
  }

  const fetcData = async (deductGroupId) => {
    console.log('fetcData deductGroupId > ', deductGroupId);
    const { status, data } = await AuthenService.callApi("GET").get("/taxDeductGroup/findById?deductGroupId="+ deductGroupId);

    if (status === 200) {
      console.log('fetcData deductGroupId data > ', data);
      setDeductGroupId(data.deductGroupId);
      setName(data.name);
      setNameTh(data.nameTh);
      setNameEn(data.nameEn);
      setDescription(data.description);
      setDescriptionTh(data.descriptionTh);
      setDescriptionEn(data.descriptionEn);
      setAmount(data.amount);
      setStatus(data.status);
      setCreateTime(data.createTime);
      setCreateUser(data.createUser);
      setEffectiveDate(new Date(data.effectiveDate));
      if(data.updateTime !== null){
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
    console.log("location.state.deductGroupId",location.state.deductGroupId);
    initPage(location.state.deductGroupId);

  }, []);

  const handleChangeStatus = (event) => {
    setStatus(event);
  };

  const submitEditTaxDeductGroup = async (deductGroupId, name,nameTh,nameEn,description,descriptionTh,descriptionEn,status,effectiveDate,amount) => {
    const taxDeductGroupObj = { deductGroupId:location.state.deductGroupId, name: name,nameTh:nameTh,nameEn:nameEn,description:description,descriptionTh:descriptionTh,descriptionEn:descriptionEn,status:status,effectiveDate:effectiveDate,amount:amount,createUser:createUser,createTime:createTime  };
    setSubmit(true);
    if (taxDeductGroupObj.name === '' || taxDeductGroupObj.deductGroupId === ''|| taxDeductGroupObj.effectiveDate === ''|| taxDeductGroupObj.amount === '') {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      });
    }else{
      console.log('TaxDeductGroupObj', taxDeductGroupObj);
      const { status, data } = await AuthenService.callApi("POST").post("/taxDeductGroup/editTaxDeductGroup",taxDeductGroupObj);
      console.log('data', data);
      if (data === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'บันทึกสำเร็จ',
        });
        history.push("/listTaxDeductGroup");
      } else if (data === 'duplicate') {
        Swal.fire({
          icon: 'warning',
          title: 'ข้อมูลซ้้ำ',
        });
      }
    }
  }

  function cancel() {
    history.push("/listTaxDeductGroup");
  }

  return (
    <PageBox>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              {/* <TableCell/> */}
              <TableCell style={{ width: 180, fontSize: 32 }}>กลุ่มลดหย่อนภาษี </TableCell>
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
                          <Input className="form-group" type="text" value={deductGroupId} onChange={(e) => {
                        setDeductGroupId(e.target.value);
                      }} placeholder="with a placeholder" invalid={deductGroupId === "" && submit} />
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
                      <FormGroup row>
                      <Label className="form-group" sm={2}>จำนวนเงินไม่เกิน<label style={required}>{"*"}</label></Label>
                        <Col sm={7}>
                          <FormControl className={classes.formControl}>
                          <Input className="form-group"  type="text" value={amount} onChange={(e) => {
                        setAmount(e.target.value);
                      }} placeholder="with a placeholder" style={{ width: 240}} invalid={amount === "" && submit} />
                       <FormFeedback>กรุณาระบุบข้อมูล</FormFeedback>
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
        <Button variant="contained" color="primary" style={styleButton} onClick={() => submitEditTaxDeductGroup(deductGroupId, name, nameTh, nameEn, description, descriptionTh, descriptionEn, status, effectiveDate,amount)}>
          Submit
        </Button>
        <Button variant="contained" style={styleButtonCancel} onClick={() => cancel()}>
          Cancel
        </Button>
      </div>
    </PageBox>
  );
}

export default withRouter(EditTaxDeductGroup);