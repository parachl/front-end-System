import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSpinner } from '../../action/Constants.action';
import { hideSpinner } from '../../action/Constants.action';
import { AuthenService } from '../../_services/authen.service';
import { useHistory, withRouter } from 'react-router-dom';
import { PageBox } from '../reuse/PageBox';
import styled from "styled-components";
import { FormGroup, Label, Row, Col, Form, Input, Container } from 'reactstrap';
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
import Switch from '@mui/material/Switch';

import {styleDivButton,styleButton,styleButtonCancel} from '../../themes/style';
// import Row from './Rows';


const AddTaxOpcode = () => {
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

  const [opcode, setOpCode] = useState('');
  const [name, setName] = useState('');
  const [nameTh, setNameTh] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [groupType, setGroupType] = useState('payroll');
  const [opcodeType, setOpcodeType] = useState('inc_net');
  const [netType, setNetType] = useState('inc_income');
  const [incomeCatalogId, setIncomeCatalogId] = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [minBaht, setMinBaht] = useState('');
  const [maxBaht, setMaxBaht] = useState('');
  const [calSoc, setCalSoc] = React.useState(true);
  const [calTax, setCalTax] = React.useState(true);
  const [requireDocNo, setRequireDocNo] = React.useState(true);
  const [status, setStatus] = useState('active');
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [createTime, setCreateTime] = useState(new Date());
  const [updateUser, setUpdateUser] = useState('');
  const [listTaxIncome, setListTaxIncome] = useState([]);

  let listStatus = [{ show: 'Active', value: 'active' }, { show: 'In Active', value: 'inactive' }];
  let listGroup = [{ show: 'payroll', value: 'payroll' }, { show: 'commission', value: 'commission' }];
  let listOpcode = [{ show: 'inc_net', value: 'inc_net' }, { show: 'dec_net', value: 'dec_net' }];
  let listNetType = [{ show: 'inc_income', value: 'inc_income' }, { show: 'dec_income', value: 'dec_income' }, { show: 'tax', value: 'tax' }];
  let rowsTaxIncome = [];
  const user = JSON.parse(localStorage.getItem('currentUser'));

  const classes = useStyles();
  
  const initPage = () => {
    console.log('3');
    dispathch(showSpinner());
    setTimeout(function () {
      dispathch(hideSpinner())
    }, 500);

    const result = AuthenService.checkPermission('OP Code', 'A');

    if (!result) {
      history.push("/main");
    }

  }
  

  const fetcDataIncome = async () => {
    const { status, data } = await AuthenService.callApi("GET").get("/taxIncomeCode/listTaxIncomeCode");
    if (status === 200) {
      console.log('fetcData data 1 > ', data);
      if (data.listTaxIncomeObj !== null && data.listTaxIncomeObj.length > 0) {
        for (let i = 0; i < data.listTaxIncomeObj.length; i++) {
          rowsTaxIncome[i] = { show: data.listTaxIncomeObj[i].name, value: data.listTaxIncomeObj[i].incomeCatalogId };

        }
        setListTaxIncome(rowsTaxIncome);
        setIncomeCatalogId(rowsTaxIncome[0].value);
      }
    } else {
      alert('error');
    }
  }

  const handleChangeStatus = (event) => {
    setStatus(event);
  };

  useEffect(() => {
    initPage();
    fetcDataIncome();
  }, []);

  const submitAddTaxOpcode = async (opcode, name, nameTh, nameEn, groupType, opcodeType, netType, incomeCatalogId, minRate, maxRate, minBaht, maxBaht, calSoc, calTax, status, effectiveDate) => {
    const taxOpcodeObj = { opcode: opcode, name: name, nameTh: nameTh, nameEn: nameEn, groupType: groupType, opcodeType: opcodeType, netType: netType, incomeCatalogId: incomeCatalogId, minRate: minRate, maxRate: maxRate, minBaht: minBaht, maxBaht: maxBaht, calSoc: calSoc, calTax: calTax, status: status, effectiveDate: effectiveDate };
    if (taxOpcodeObj.name === '' || taxOpcodeObj.opCode === '' || taxOpcodeObj.effectiveDate === '') {
      alert('Please fill in all required fields.');
    } else {
      console.log('taxOpcodeObj', taxOpcodeObj);
      const { status, data } = await AuthenService.callApi("POST").post("/taxOpcode/addTaxOpcode", taxOpcodeObj);
      console.log('data', data);
      if (data === 'success') {
        history.push("/listOpcode");
      } else if (data === 'duplicate') {
        console.log('data', data);
        alert('Data Duplicate');
      }
    }
  }

  function cancel() {
    history.push("/listOpcode");
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
                  <Row>
                    <Col>
                      <FormGroup row>
                        <Label className="form-group" sm={4}>รหัส</Label>
                        <Col sm={5}>
                          <FormControl className={classes.formControl}>
                            <Input className="form-group" type="text" value={opcode} onChange={(e) => {
                              setOpCode(e.target.value);
                            }} placeholder="with a placeholder" />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup row>
                      <Label className="form-group" sm={4}>ชื่อ</Label>
                        <Col sm={5}>
                          <FormControl className={classes.formControl}>
                          <Input className="form-group" type="text" value={name} onChange={(e) => {
                        setName(e.target.value);
                      }} placeholder="with a placeholder" />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                    </Row>
                    <Row>
                    <Col>
                      <FormGroup row>
                      <Label className="form-group" sm={4}>ชื่อ (TH)</Label>
                        <Col sm={5}>
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
                      <Label className="form-group" sm={4}>ชื่อ (EN)</Label>
                        <Col sm={5}>
                          <FormControl className={classes.formControl}>
                          <Input className="form-group" type="text" value={nameEn} onChange={(e) => {
                        setNameEn(e.target.value);
                      }} placeholder="with a placeholder" />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <SelectCustom label="Group :" value={groupType} listData={listGroup}
                        onChange={(e) => {
                          setGroupType(e.target.value);
                        }} style={{ width: 180 }} />
                    </Col>
                    <Col></Col>
                  </Row>
                  <Row >
                    <Col>
                      <SelectCustom label="Opcode Type :" value={opcodeType} listData={listOpcode}
                        onChange={(e) => {
                          setOpcodeType(e.target.value);
                        }} style={{ width: 180 }} />
                    </Col>
                    <Col>
                      <SelectCustom label="Net Type :" value={netType} listData={listNetType}
                        onChange={(e) => {
                          setNetType(e.target.value);
                        }} style={{ width: 180 }} />
                    </Col>
                  </Row>
                  <Row >
                  <Col>
                      <FormGroup row>
                      <Label className="form-group" sm={4}>คำนวณประกันสังคม</Label>
                        <Col sm={5}>
                          <FormControl className={classes.formControl}>
                          <Switch
                        checked={calSoc}
                        onChange={(e) => {
                          setCalSoc(e.target.checked);
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup row>
                      <Label className="form-group" sm={4}>คำนวณภาษี</Label>
                        <Col sm={5}>
                          <FormControl className={classes.formControl}>
                          <Switch
                        checked={calTax}
                        onChange={(e) => {
                          setCalSoc(e.target.checked);
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row >
                    <Col>
                      <SelectCustom label="Tax Type :" value={incomeCatalogId} listData={listTaxIncome}
                        onChange={(e) => {
                          setIncomeCatalogId(e.target.value);
                        }} style={{ width: 180 }} />
                    </Col>
                    <Col></Col>
                  </Row>
                  <Row >
                  <Col>
                      <FormGroup row>
                      <Label className="form-group" sm={4}>MIN (%)</Label>
                        <Col sm={6}>
                          <FormControl className={classes.formControl}>
                          <Input className="form-group" type="text" value={minRate} onChange={(e) => {
                        setMinRate(e.target.value);
                      }} placeholder="with a placeholder" />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup row>
                      <Label className="form-group" sm={4}>MAX (%)</Label>
                        <Col sm={6}>
                          <FormControl className={classes.formControl}>
                          <Input className="form-group" type="text" value={maxRate} onChange={(e) => {
                        setMaxRate(e.target.value);
                      }} placeholder="with a placeholder" />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row >
                  <Col>
                      <FormGroup row>
                      <Label className="form-group" sm={4}>MIN (บาท)</Label>
                        <Col sm={6}>
                          <FormControl className={classes.formControl}>
                          <Input className="form-group" type="text" value={minBaht} onChange={(e) => {
                        setMinBaht(e.target.value);
                      }} placeholder="with a placeholder" />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup row>
                      <Label className="form-group" sm={4}>MAX (บาท)</Label>
                        <Col sm={6}>
                          <FormControl className={classes.formControl}>
                          <Input className="form-group" type="text" value={maxBaht} onChange={(e) => {
                        setMaxBaht(e.target.value);
                      }} placeholder="with a placeholder" />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row >
                  <Col>
                      <FormGroup row>
                      <Label className="form-group" sm={4}>ใบสำคัญ</Label>
                        <Col sm={5}>
                          <FormControl className={classes.formControl}>
                          <Switch
                        checked={requireDocNo}
                        onChange={(e) => {
                          setRequireDocNo(e.target.checked);
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                          </FormControl>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col></Col>
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
        <Button variant="contained" color="primary" style={styleButton} onClick={() => submitAddTaxOpcode(opcode, name, nameTh, nameEn, groupType, opcodeType, netType, incomeCatalogId, minRate, maxRate, minBaht, maxBaht, calSoc, calTax, status, effectiveDate)}>
          Submit
        </Button>
        <Button variant="contained" color="secondary" style={styleButtonCancel} onClick={() => cancel()}>
          Cancel
        </Button>
      </div>
    </PageBox>
  );
}

export default withRouter(AddTaxOpcode);