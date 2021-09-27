import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSpinner } from '../../action/Constants.action';
import { hideSpinner } from '../../action/Constants.action';
import { AuthenService } from '../../_services/authen.service';
import { useHistory,withRouter,useLocation } from 'react-router-dom';
import { PageBox } from '../reuse/PageBox';
import { FormGroup, Label, Row, Col,Form,Input,Container } from 'reactstrap';

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
import {styleDivButton,styleButton,styleButtonCancel} from '../../themes/style';
// import Row from './Rows';


const EditIncomeCatalog = () => {
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        borderBottom: 'unset',
      }, formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      }
    }
    }));
    const classes = useStyles();
  const dispathch = useDispatch();
  const history = useHistory();

  const [incomeCatalogId, setIncomeCatalogId] = useState('');
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
  const [updateTime, setUpdateTime] = useState(new Date());
  const [updateUser, setUpdateUser] = useState('');
  const [listTaxCatalog, setListTaxCatalog] = useState([]);
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const location = useLocation();
  let listStatus = [{ show: 'Active', value: 'active' }, { show: 'In Active', value: 'inactive' }];
  let taxCatalogs = [];
  const handleChangeStatus = (event) => {
    setStatus(event);
  };
 
  const initPage = (incomeCatalogId) => {
    dispathch(showSpinner());
    setTimeout(function () {
      dispathch(hideSpinner())
    }, 500);

    const result = AuthenService.checkPermission('Income Catalog', 'E');

    if (!result) {
      history.push("/main");
    }
    fetcData(incomeCatalogId);
  }

  const fetcData = async (incomeCatalogId) => {
    console.log('fetcData taxIncomeId > ', incomeCatalogId);
    const { status, data } = await AuthenService.callApi("GET").get("/taxIncomeCode/findById?incomeCatalogId="+ incomeCatalogId);

    if (status === 200) {
      console.log('fetcData taxIncomeId data > ', data);
      setIncomeCatalogId(data.incomeCatalogId);
      setName(data.name);
      setNameTh(data.nameTh);
      setNameEn(data.nameEn);
      setDescription(data.description);
      setDescriptionTh(data.descriptionTh);
      setDescriptionEn(data.descriptionEn);
      setTaxCatalog(data.taxCatalog);
      setTaxRate(data.taxRate);
      setStatus(data.status);
      setEffectiveDate(new Date(data.effectiveDate));
      if(data.updateTime !== null){
        setUpdateTime(new Date(data.updateTime));
      }
      setUpdateUser(data.updateUser);
    } else {
      alert('error');
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

  const handleChangeTaxCatalog = (event) => {
    setTaxCatalog(event);
  };

  useEffect(() => {
    initPage(location.state.incomeCatalogId);
    fetcDataTaxCatalog();
  }, []);

  const submitEditTaxIncome = async (incomeCatalogId, name,nameTh,nameEn,description,descriptionTh,descriptionEn,taxCatalog,taxRate,status,effectiveDate) => {
    const taxIncomeCodeObj = {incomeCatalogId:incomeCatalogId, name: name,nameTh:nameTh,nameEn:nameEn,description:description,descriptionTh:descriptionTh,descriptionEn:descriptionEn,taxCatalog:taxCatalog,taxRate:taxRate,status:status,effectiveDate:effectiveDate };
    if (taxIncomeCodeObj.name === '' || taxIncomeCodeObj.incomeCatalogId === ''|| taxIncomeCodeObj.taxCatalog === ''|| taxIncomeCodeObj.taxRate === ''|| taxIncomeCodeObj.effectiveDate === '') {
      alert('Please fill in all required fields.');
    }else{
      console.log('taxIncomeCodeObj', taxIncomeCodeObj);
      const { status, data } = await AuthenService.callApi("POST").post("/taxIncomeCode/editTaxIncomeCode",taxIncomeCodeObj);
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
              {/* <TableCell/> */}
              <TableCell style={{ width: 180, fontSize: 32 }}>ประเภทรายได้ </TableCell>
            </TableRow>
            <TableRow>
              <FormGroup style={{ width: 1080, padding: 15 }}>
              <Container>
            <Row >
            <Col>
                <Label className="form-group" sm={4}>รหัส</Label>
                <Input className="form-group" type="text" value={incomeCatalogId} onChange={(e) => {
                    setIncomeCatalogId(e.target.value);
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
            <SelectCustom label="ประเภทภาษี :" value={taxCatalog} listData={listTaxCatalog}
                        onChange={(e) => {
                          handleChangeTaxCatalog(e.target.value);
                        }} style={{ width: 180 }} />
                </Col>
                <Col>
                <Label className="form-group" sm={4}>ตารางภาษี</Label>
                <Input className="form-group" type="text" value={taxRate} onChange={(e) => {
                    setTaxRate(e.target.value);
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
        <Button variant="contained" color="primary" style={styleButton} onClick={() => submitEditTaxIncome(incomeCatalogId, name,nameTh,nameEn,description,descriptionTh,descriptionEn,taxCatalog,taxRate,status,effectiveDate)}>
          Submit
        </Button>
        <Button variant="contained" style={styleButtonCancel} onClick={() => cancel()}>
          Cancel
        </Button>
      </div>
    </PageBox>
  );
}

export default withRouter(EditIncomeCatalog);