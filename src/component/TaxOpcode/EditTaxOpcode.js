import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSpinner } from '../../action/Constants.action';
import { hideSpinner } from '../../action/Constants.action';
import { AuthenService } from '../../_services/authen.service';
import { useHistory,withRouter,useLocation } from 'react-router-dom';
import { PageBox } from '../reuse/PageBox';
import { FormGroup, Label, Row, Col,Input,Container } from 'reactstrap';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DatePicker from "react-datepicker";
import { SelectCustom } from '../reuse/SelectCustom';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@mui/material/Switch';
import {styleDivButton,styleButton,styleButtonCancel} from '../../themes/style';
// import Row from './Rows';


const EditTaxOpcode = () => {
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

  const [opcode, setOpcode] = useState('');
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
  const [createUser, setCreateUser] = useState('');
  const [updateTime, setUpdateTime] = useState(new Date());
  const [updateUser, setUpdateUser] = useState('');
  const location = useLocation();
  const [listTaxIncome, setListTaxIncome] = useState([]);

  let listGroup = [{ show: 'payroll', value: 'payroll' }, { show: 'commission', value: 'commission' }];
  let listOpcode = [{ show: 'inc_net', value: 'inc_net' }, { show: 'dec_net', value: 'dec_net' }];
  let listNetType = [{ show: 'inc_income', value: 'inc_income' }, { show: 'dec_income', value: 'dec_income' }, { show: 'tax', value: 'tax' }];
  let listStatus = [{ show: 'Active', value: 'active' }, { show: 'In Active', value: 'inactive' }];
  let rowsTaxIncome = [];
  const user = JSON.parse(localStorage.getItem('currentUser'));


  const classes = useStyles();
 
  const initPage = (opcode) => {
    dispathch(showSpinner());
    setTimeout(function () {
      dispathch(hideSpinner())
    }, 500);

    const result = AuthenService.checkPermission('OP Code', 'E');

    if (!result) {
      history.push("/main");
    }
    fetcData(opcode);
  }

  const fetcData = async (opcode) => {
    console.log('fetcData opcode > ', opcode);
    const { status, data } = await AuthenService.callApi("GET").get("/taxOpcode/findById?opcode="+ opcode);

    if (status === 200) {
      console.log('fetcData opcode data > ', data);
      setOpcode(data.opcode);
      setName(data.name);
      setNameTh(data.nameTh);
      setNameEn(data.nameEn);
      setGroupType(data.groupType);
      setOpcodeType(data.opcodeType);
      setNetType(data.netType);
      setIncomeCatalogId(data.incomeCatalogId);
      setMinRate(data.minRate);
      setMaxRate(data.maxRate);
      setMinBaht(data.minBaht);
      setMaxBaht(data.maxBaht);
      setCalSoc(data.calSoc);
      setCalTax(data.calTax);
      setRequireDocNo(data.requireDocNo);
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
  const fetcDataIncome = async () => {
    const { status, data } = await AuthenService.callApi("GET").get("/taxIncomeCode/listTaxIncomeCode");
    if (status === 200) {
      console.log('fetcData data 1 > ', data);
      if (data.listTaxIncomeObj !== null && data.listTaxIncomeObj.length > 0) {
        for (let i = 0; i < data.listTaxIncomeObj.length; i++) {
          rowsTaxIncome[i] = { show: data.listTaxIncomeObj[i].name, value: data.listTaxIncomeObj[i].incomeCatalogId };

        }
        setListTaxIncome(rowsTaxIncome);
      }
    } else {
      alert('error');
    }
  }

  useEffect(() => {
    initPage(location.state.opcode);
    fetcDataIncome();
  }, []);

  const handleChangeStatus = (event) => {
    setStatus(event);
  };

  const submitEditTaxOpcode = async (opcode, name, nameTh, nameEn, groupType, opcodeType, netType, incomeCatalogId, minRate, maxRate, minBaht, maxBaht, calSoc, calTax, status, effectiveDate) => {
    const taxOpcodeObj = { opcode: opcode, name: name, nameTh: nameTh, nameEn: nameEn, groupType: groupType, opcodeType: opcodeType, netType: netType, incomeCatalogId: incomeCatalogId, minRate: minRate, maxRate: maxRate, minBaht: minBaht, maxBaht: maxBaht, calSoc: calSoc, calTax: calTax, status: status, effectiveDate: effectiveDate,createUser:createUser,createTime:createTime };
    if (taxOpcodeObj.name === '' || taxOpcodeObj.opcode === ''|| taxOpcodeObj.effectiveDate === '') {
      alert('Please fill in all required fields.');
    }else{
      console.log('taxOpcodeObj', taxOpcodeObj);
      const { status, data } = await AuthenService.callApi("POST").post("/taxOpcode/editTaxOpcode",taxOpcodeObj);
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
                              setOpcode(e.target.value);
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
        <Button variant="contained" color="primary" style={styleButton} onClick={() => submitEditTaxOpcode(opcode, name, nameTh, nameEn, groupType, opcodeType, netType, incomeCatalogId, minRate, maxRate, minBaht, maxBaht, calSoc, calTax, status, effectiveDate)}>
          Submit
        </Button>
        <Button variant="contained" style={styleButtonCancel} onClick={() => cancel()}>
          Cancel
        </Button>
      </div>
    </PageBox>
  );
}

export default withRouter(EditTaxOpcode);