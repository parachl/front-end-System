import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSpinner } from '../../action/Constants.action';
import { hideSpinner } from '../../action/Constants.action';
import { AuthenService } from '../../_services/authen.service';
import { useHistory,withRouter,useLocation } from 'react-router-dom';
import { PageBox } from '../reuse/PageBox';
import styled from "styled-components";
import { FormGroup, Label, Row, Col,Form,Input,Container } from 'reactstrap';
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
import {styleDivButton,styleButton,styleButtonCancel} from '../../themes/style';
// import Row from './Rows';


const EditTaxSystemInfo = () => {
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
  const [createUser, setCreateUser] = useState('');
  const [updateTime, setUpdateTime] = useState(new Date());
  const [updateUser, setUpdateUser] = useState('');
  const location = useLocation();
  let listStatus = [{ show: 'Active', value: 'active' }, { show: 'In Active', value: 'inactive' }];
  const user = JSON.parse(localStorage.getItem('currentUser'));

  const classes = useStyles();
 
  const initPage = (systemId) => {
    dispathch(showSpinner());
    setTimeout(function () {
      dispathch(hideSpinner())
    }, 500);

    const result = AuthenService.checkPermission('Tax Deduct', 'E');

    if (!result) {
      history.push("/main");
    }
    fetcData(systemId);
  }

  const fetcData = async (systemId) => {
    console.log('fetcData systemId > ', systemId);
    const { status, data } = await AuthenService.callApi("GET").get("/taxSystemInfo/findById?systemId="+ systemId);

    if (status === 200) {
      console.log('fetcData systemId data > ', data);
      setSystemId(data.systemId);
      setName(data.name);
      setNameTh(data.nameTh);
      setNameEn(data.nameEn);
      setDescription(data.description);
      setDescriptionTh(data.descriptionTh);
      setDescriptionEn(data.descriptionEn);
      setStatus(data.status);
      setEffectiveDate(new Date(data.effectiveDate));
      setCreateTime(data.createTime);
      setCreateUser(data.createUser);
      if(data.updateTime !== null){
        setUpdateTime(new Date(data.updateTime));
      }
      setUpdateUser(data.updateUser);
    } else {
      alert('error');
    }

  }

  useEffect(() => {
    initPage(location.state.systemId);

  }, []);

  const handleChangeStatus = (event) => {
    setStatus(event);
  };

  const submitEditTaxSystemInfo = async (systemId, name,nameTh,nameEn,description,descriptionTh,descriptionEn,status,effectiveDate) => {
    const taxSystemInfoObj = { systemId:location.state.systemId, name: name,nameTh:nameTh,nameEn:nameEn,description:description,descriptionTh:descriptionTh,descriptionEn:descriptionEn,status:status,effectiveDate:effectiveDate,createUser:createUser,createTime:createTime };
    if (taxSystemInfoObj.name === '' || taxSystemInfoObj.systemId === ''|| taxSystemInfoObj.effectiveDate === '') {
      alert('Please fill in all required fields.');
    }else{
      console.log('taxSystemInfoObj', taxSystemInfoObj);
      const { status, data } = await AuthenService.callApi("POST").post("/taxSystemInfo/editTaxSystemInfo",taxSystemInfoObj);
      console.log('data', data);
      if (data === 'success') {
        history.push("/listTaxSystemInfo");
      } else if (data === 'duplicate') {
        console.log('data', data);
        alert('Data Duplicate');
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
                      <Label className="form-group" sm={4}>รหัส</Label>
                      <Input className="form-group" type="text" value={systemId} onChange={(e) => {
                        setSystemId(e.target.value);
                      }} placeholder="with a placeholder" />
                    </Col>
                    <Col>
                      <Label className="form-group" sm={4}>ชื่อ</Label>
                      <Input className="form-group" type="text" value={name} onChange={(e) => {
                        setName(e.target.value);
                      }} placeholder="with a placeholder" />
                    </Col>
                    <Col>
                      <Label className="form-group" sm={5}>ชื่อ (TH)</Label>
                      <Input className="form-group" type="text" value={nameTh} onChange={(e) => {
                        setNameTh(e.target.value);
                      }} placeholder="with a placeholder" />
                    </Col>
                    <Col>
                      <Label className="form-group" sm={5}>ชื่อ (EN)</Label>
                      <Input className="form-group" type="text" value={nameEn} onChange={(e) => {
                        setNameEn(e.target.value);
                      }} placeholder="with a placeholder" />
                    </Col>
                  </Row>
                  <Row >
                    <Col>
                      <Label className="form-group" sm={4}>รายละเอียด</Label>
                      <Input className="form-group" type="textarea" value={description} onChange={(e) => {
                        setDescription(e.target.value);
                      }} placeholder="with a placeholder" />
                    </Col>
                  </Row>
                  <Row >
                    <Col>
                      <Label className="form-group" sm={4}>รายละเอียด (TH)</Label>
                      <Input className="form-group" type="textarea" value={descriptionTh} onChange={(e) => {
                        setDescriptionTh(e.target.value);
                      }} placeholder="with a placeholder" />
                    </Col>
                  </Row>
                  <Row >
                    <Col>
                      <Label className="form-group" sm={4}>รายละเอียด (EN)</Label>
                      <Input className="form-group" type="textarea" value={descriptionEn} onChange={(e) => {
                        setDescriptionEn(e.target.value);
                      }} placeholder="with a placeholder" />
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
                        <Label className="form-group" sm={4}>วันที่มีผล  :</Label>
                        <Col sm={6}>
                          <FormControl className={classes.formControl}>
                            <DatePicker selected={effectiveDate} onChange={(date) => setEffectiveDate(date)} />
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
        <Button variant="contained" color="primary" style={styleButton} onClick={() => submitEditTaxSystemInfo(systemId, name, nameTh, nameEn, description, descriptionTh, descriptionEn, status, effectiveDate)}>
          Submit
        </Button>
        <Button variant="contained" style={styleButtonCancel} onClick={() => cancel()}>
          Cancel
        </Button>
      </div>
    </PageBox>
  );
}

export default withRouter(EditTaxSystemInfo);