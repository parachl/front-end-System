import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSpinner } from '../../action/Constants.action';
import { hideSpinner } from '../../action/Constants.action';
import { AuthenService } from '../../_services/authen.service';
import { useHistory, withRouter } from 'react-router-dom';
import { PageBox } from '../reuse/PageBox';
import styled from "styled-components";
import { FormGroup, Label, Row, Col, Form, Input, Container,FormFeedback } from 'reactstrap';
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
import FormControl from '@material-ui/core/FormControl';
import { styleDivButton, styleButton, styleButtonCancel } from '../../themes/style';
// import Row from './Rows';


const AddIncomeCatalog = () => {
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
  const classes = useStyles();
  const dispathch = useDispatch();
  const history = useHistory();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [nameTh, setNameTh] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionTh, setDescriptionTh] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [taxCatalog, setTaxCatalog] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [status, setStatus] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [createTime, setCreateTime] = useState(new Date());
  const [updateUser, setUpdateUser] = useState('');
  const [listTaxCatalog, setListTaxCatalog] = useState([]);
  const user = JSON.parse(localStorage.getItem('currentUser'));
  let listStatus = [{ show: 'Active', value: 'active' }, { show: 'In Active', value: 'inactive' }];

  let taxCatalogs = [];

  const handleChangeStatus = (event) => {
    setStatus(event);
  };


  const handleChangeTaxCatalog = (event) => {
    setTaxCatalog(event);
  };
  const initPage = () => {
    console.log('3');
    dispathch(showSpinner());
    setTimeout(function () {
      dispathch(hideSpinner())
    }, 500);

    const result = AuthenService.checkPermission('Income Catalog', 'A');

    if (!result) {
      history.push("/main");
    }

  }

  const fetcDataTaxCatalog = async () => {
    const { status, data } = await AuthenService.callApi("GET").get("/taxCatalog/listTaxCatalog");
    console.log('statusUser > ', status);
    console.log('dataUser > ', data);
    if (status === 200) {
      if (data.listTaxCatalogObj !== null && data.listTaxCatalogObj.length > 0) {
        for (let i = 0; i < data.listTaxCatalogObj.length; i++) {

          taxCatalogs.push({ show: data.listTaxCatalogObj[i].nameTh, value: data.listTaxCatalogObj[i].taxCatalogId });

        }
        setListTaxCatalog(taxCatalogs);
      } else {
        alert('error');
      }
    }
  }

  useEffect(() => {
    initPage();
    fetcDataTaxCatalog();
  }, []);

  const submitAddTaxIncome = async (code, name, nameTh, nameEn, description, descriptionTh, descriptionEn, taxCatalog, taxRate, status, effectiveDate) => {
    const taxIncomeCodeObj = { code: code, name: name, nameTh: nameTh, nameEn: nameEn, description: description, descriptionTh: descriptionTh, descriptionEn: descriptionEn, taxCatalog: taxCatalog, taxRate: taxRate, status: status, effectiveDate: effectiveDate };
    if (taxIncomeCodeObj.name === '' || taxIncomeCodeObj.code === '' || taxIncomeCodeObj.taxCatalog === '' || taxIncomeCodeObj.taxRate === '' || taxIncomeCodeObj.effectiveDate === '') {
      alert('Please fill in all required fields.');
    } else {
      console.log('taxIncomeCodeObj', taxIncomeCodeObj);
      const { status, data } = await AuthenService.callApi("POST").post("/taxIncomeCode/addTaxIncomeCode", taxIncomeCodeObj);
      console.log('data', data);
      if (data === 'success') {
        history.push("/listIncomeCatalog");
      } else if (data === 'duplicate') {
        console.log('data', data);
        alert('Data Duplicate');
      }
    }
  }

  function cancel() {
    history.push("/listIncomeCatalog");
  }

  return (
    <PageBox>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 180, fontSize: 32 }}>ประเภทรายได้ </TableCell>
            </TableRow>
            <TableRow>
              <FormGroup style={{ width: 1080, padding: 15 }}>
                <Container>
                  <Row >
                    <Col>
                      <FormGroup row>
                        <Label className="form-group" sm={4}>รหัส</Label>
                        <Col sm={7}>
                          <FormControl className={classes.formControl}>
                            <Input className="form-group" type="text" value={code} onChange={(e) => {
                              setCode(e.target.value);
                            }} placeholder="with a placeholder" invalid />
                            <FormFeedback>Oh noes! that name is already taken</FormFeedback>
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup row>
                        <Label className="form-group" sm={3}>ชื่อ</Label>
                        <Col sm={7}>
                          <FormControl className={classes.formControl}>
                            <Input className="form-group" type="text" value={name} onChange={(e) => {
                              setName(e.target.value);
                            }} placeholder="with a placeholder" />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row >
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
                      <Label className="form-group" sm={3}>รายละเอียด</Label>
                        <Col sm={8}>
                          <FormControl className={classes.formControl}>
                          <Input className="form-group" type="textarea" value={description} onChange={(e) => {
                        setDescription(e.target.value);
                      }} placeholder="with a placeholder" style={{ width: 680}} />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col></Col>
                  </Row>
                  <Row>
                  <Col>
                      <FormGroup row>
                      <Label className="form-group" sm={3}>รายละเอียด (TH)</Label>
                        <Col sm={8}>
                          <FormControl className={classes.formControl}>
                          <Input className="form-group" type="textarea" value={descriptionTh} onChange={(e) => {
                        setDescriptionTh(e.target.value);
                      }} placeholder="with a placeholder" style={{ width: 680}} />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col></Col>
                  </Row>
                  <Row >
                  <Col>
                      <FormGroup row>
                      <Label className="form-group" sm={3}>รายละเอียด (EN)</Label>
                        <Col sm={8}>
                          <FormControl className={classes.formControl}>
                      <Input className="form-group" type="textarea" value={descriptionEn} onChange={(e) => {
                        setDescriptionEn(e.target.value);
                      }} placeholder="with a placeholder" style={{ width: 680}} />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col></Col>
                  </Row>
                  <Row >
                    <Col>
                      <SelectCustom label="ประเภทภาษี :" value={taxCatalog} listData={listTaxCatalog}
                        onChange={(e) => {
                          handleChangeTaxCatalog(e.target.value);
                        }} style={{ width: 180 }} />
                    </Col>
                    <Col>
                      <FormGroup row>
                      <Label className="form-group" sm={4}>ตารางภาษี</Label>
                        <Col sm={8}>
                          <FormControl className={classes.formControl}>
                          <Input className="form-group" type="text" value={taxRate} onChange={(e) => {
                        setTaxRate(e.target.value);
                      }} placeholder="with a placeholder" />
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
        <Button variant="contained" color="primary" style={styleButton} onClick={() => submitAddTaxIncome(code, name, nameTh, nameEn, description, descriptionTh, descriptionEn, taxCatalog, taxRate, status, effectiveDate)}>
          Submit
        </Button>
        <Button variant="contained" style={styleButtonCancel} onClick={() => cancel()}>
          Cancel
        </Button>
      </div>
    </PageBox>
  );
}

export default withRouter(AddIncomeCatalog);