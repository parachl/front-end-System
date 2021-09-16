import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSpinner } from '../../action/Constants.action';
import { hideSpinner } from '../../action/Constants.action';
import { AuthenService } from '../../_services/authen.service';
import { useHistory,withRouter } from 'react-router-dom';
import { PageBox, SearchBox } from '../reuse/PageBox';
import { Row, Col } from 'reactstrap';
import api from "../../api/GetApi";

import { makeStyles,createTheme,ThemeProvider  } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { InputLabelReuse } from '../reuse/InputLabel';
import { SelectCustom } from '../reuse/SelectCustom';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import TablePagination from '@material-ui/core/TablePagination';
import { green } from '@material-ui/core/colors';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

const ListTaxRate = () => {
  const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });
  const dispathch = useDispatch();
  const history = useHistory();

  console.log('1');

  const [name, setName] = useState('');
  const [status, setStatus] = useState('active');
  const [checkedList, setCheckedList] = useState({});
  const classes = useRowStyles();
  const [roleRightA, setRoleRightA] = useState(false);
  const [roleRightE, setRoleRightE] = useState(false);
  const [roleRightD, setRoleRightD] = useState(false);
  const [roleRightV, setRoleRightV] = useState(false);
  let rowsTaxRate = [{}];
  let listCheckBox = [{}];
  const [listTaxRate, setListTaxRate] = useState([]);
  let listStatus = [{show:'Active',value:'active'},{show:'In Active',value:'inactive'}];
  const styleDivButton = {
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const styleButtonAdd = {
    float: 'right',
    marginRight: '23px',
    marginBottom: '20px',
    color: 'white',
    background: '#007ac2',
  };

  const styleButtonsearch = {
    float: 'right',
    marginRight: '23px',
    background: '#007ac2',
    marginBottom: '20px',
    
  };
  const styleButtonClear = {
    float: 'right',
    marginRight: '23px',
    background: '#007ac2',
    marginBottom: '20px',
  };

  const styleButtonEdit = {
    float: 'right',
    marginRight: '23px',
    marginBottom: '20px',
    background: '#007ac2',
  };

  const styleButtonExample = {
    float: 'right',
    marginRight: '23px',
    marginBottom: '20px',
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  };
 

  const styleButtonDelete = {
    float: 'right',
    marginRight: '43px',
    marginBottom: '20px',
    color: 'white',
    background:  '#ff1744',
    
  };
  

  const colStatus = {
    marginLeft: '40px',
  };

  const styleButton = {
    margin: '10px',
  };

  function appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n
  }

  const fetcData = async () => {
    setName('');
    setStatus('active');
    const { status, data } = await AuthenService.callApi("GET").get("/taxRate/listTaxRate");

    if (status === 200) {
      console.log('fetcData data 1 > ', data);
      if (data.listTaxRateObj !== undefined && data.listTaxRateObj.length > 0) {
        for (let i = 0; i < data.listTaxRateObj.length; i++) {
          let current_datetime = new Date(data.listTaxRateObj[i].createTime);
          let formatted_date = appendLeadingZeroes((current_datetime.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime.getDate()) + "-" + current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
          let formatted_date_u = '';
          if(data.listTaxRateObj[i].updateDate != null){
            let current_datetime_u = new Date(data.listTaxRateObj[i].updateTime);
             formatted_date_u = appendLeadingZeroes((current_datetime_u.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime_u.getDate()) + "-" + current_datetime_u.getFullYear() + " " + current_datetime_u.getHours() + ":" + current_datetime_u.getMinutes() + ":" + current_datetime_u.getSeconds();
          }
          rowsTaxRate[i] = { taxRateId: data.listTaxRateObj[i].taxRateId,name: data.listTaxRateObj[i].name,description: data.listTaxRateObj[i].description,descriptionTh: data.listTaxRateObj[i].descriptionTh, createUser: data.listTaxRateObj[i].createUser, createTime: formatted_date, updateTime: formatted_date_u, updateUser: data.listTaxRateObj[i].updateUser, status: data.listTaxRateObj[i].status }
          listCheckBox[i] = {isChecked:false,taxRateId: data.listTaxRateObj[i].taxRateId};
        }
        setListTaxRate(rowsTaxRate);
        setCheckedList(listCheckBox);
      }
    } else {
      alert('error');
    }
    console.log('fetcData data > ', data);
  }

  const handleChangeStatus = (event) => {
    setStatus(event);
  };

useEffect(() => {
  console.log('2');
  const result = AuthenService.checkPermission('Tax Rate', 'L');
  
  if (!result) {
    history.push("/main");
  }
  const roleRight = AuthenService.checkRoleRight('Tax Rate');
  if(roleRight.indexOf('A') !== -1){
    setRoleRightA(true);
  }
  if(roleRight.indexOf('E') !== -1){
    setRoleRightE(true);
  }
  if(roleRight.indexOf('D') !== -1){
    setRoleRightD(true);
  }
  if(roleRight.indexOf('V') !== -1){
    setRoleRightV(true);
  }
  fetcData();
}, []);

const editTaxRate = (taxRateId) => {
  console.log('taxRateId >',taxRateId);
  history.push("/editTaxRate", { taxRateId: taxRateId });
}

const deleteTaxRate = async () => {
  if(checkedList.length > 0){
    let listTaxRateObj = [];
    for(var f = 0 ; f < checkedList.length ; f++){
      if(checkedList[f].isChecked){
        listTaxRateObj.push({taxRateId:checkedList[f].taxRateId})
      }
    }
    let taxRateCodeObjC = {listTaxRateObj};

    const { status, data } = await AuthenService.callApi("POST").post("/taxRate/deleteTaxRate",taxRateCodeObjC);
    if (status === 200) {
      if(data === 'fail'){
        alert('Cannot delete this item because it is used.');
      }else{
        fetcData();
      }
    }
  }
  
}

function getCheckedList(index) {
  console.log('checkedList index>', index);
  if (checkedList.length > 0 && checkedList.length > index) {
    console.log('checkedList >', checkedList);
    return checkedList[index].isChecked;
  }else{
    return false;
  }
}

const changeCheckBoxList = (event, index) => {
  if (checkedList.length > 0) {
    let g = checkedList[index];
    if (g["isChecked"] === true) {
      g["isChecked"] = false;
    } else {
      g["isChecked"] = true;
    }
    setCheckedList([...checkedList.slice(0, index), g, ...checkedList.slice(index + 1)]);
  }

}

const searchRole = async (name, statusTaxRateCode) => {
  const taxRateCodeObj ={name,status:statusTaxRateCode }
  console.log('searchTaxRate TaxRateCodeObj',taxRateCodeObj);
  const { status, data } = await AuthenService.callApi("POST").post("/taxRate/searchTaxRate",taxRateCodeObj);
  console.log('searchTaxRate statusHttp',status);
  if(status === 200){
    if (data.listTaxRateObj !== null && data.listTaxRateObj.length > 0) {
      console.log('searchTaxRate in',data);
      for (let i = 0; i < data.listTaxRateObj.length; i++) {
        let current_datetime = new Date(data.listTaxRateObj[i].createTime);
        let formatted_date_u = '';
        if(data.listTaxRateObj[i].updateTime != null){
          let current_datetime_u = new Date(data.listTaxRateObj[i].updateTime);
           formatted_date_u = appendLeadingZeroes((current_datetime_u.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime_u.getDate()) + "-" + current_datetime_u.getFullYear() + " " + current_datetime_u.getHours() + ":" + current_datetime_u.getMinutes() + ":" + current_datetime_u.getSeconds();
        }
        let formatted_date = appendLeadingZeroes((current_datetime.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime.getDate()) + "-" + current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();

        rowsTaxRate[i] = { taxRateId: data.listTaxRateObj[i].taxRateId,name: data.listTaxRateObj[i].name,description: data.listTaxRateObj[i].description,descriptionTh: data.listTaxRateObj[i].descriptionTh, createUser: data.listTaxRateObj[i].createUser, createTime: formatted_date, updateTime: formatted_date_u, updateUser: data.listTaxRateObj[i].updateUser, status: data.listTaxRateObj[i].status }
        listCheckBox[i] = {isChecked:false,taxRateId: data.listTaxRateObj[i].taxRateId};
      }
      setListTaxRate(rowsTaxRate);
      setCheckedList(listCheckBox);
    }else if(data.listTaxRateObj !== null && data.listTaxRateObj.length === 0){
      console.log('searchTaxRate null',data);
      setListTaxRate([]);
    }
  }
}

const theme = createTheme({
  palette: {
    green: green,
  },
});

const addTaxRate= () => {
  history.push("/addTaxRate");
}

const [page, setPage] = React.useState(0);
const [rowsPerPage, setRowsPerPage] = React.useState(10);
const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(+event.target.value);
  setPage(0);
};

return (
  <PageBox>
    <div><tableRow style={{ width: 1080, fontSize: 32, padding: 10 }}>ประเภทอัตราภาษี </tableRow></div>
    <div><SearchBox>
        <Row>
          <Col md="auto"><InputLabelReuse label="ชื่อ :" type="text" value={name}
            onChange={(e) => {
              setName(e.target.value);
            }} style={{ width: 280 }} /></Col>
          <Col style={colStatus}><SelectCustom label="สถานะ :" value={status} listData={listStatus}
            onChange={(e) => {
              handleChangeStatus(e.target.value);
            }} style={{ width: 180 }} /></Col>
            <Col><Button variant="contained" color="primary" style={styleButtonClear} onClick={() => fetcData()}>
      Clear
    </Button><Button variant="contained" color="primary" style={styleButtonsearch} onClick={() => searchRole(name,status)}>
      Search
    </Button></Col>
    <Col></Col>
        </Row></SearchBox></div>
    <Button variant="contained" startIcon={<DeleteIcon />}  style={styleButtonDelete} onClick={() => deleteTaxRate()} disabled={!roleRightD}>
      Delete
    </Button>
    <ThemeProvider theme={theme}>
    <Button variant="contained" startIcon={<SaveIcon />} style={styleButtonAdd} onClick={() => addTaxRate()} disabled={!roleRightA}>
      Add
    </Button>
    </ThemeProvider>
    <TableContainer className={classes.container} style={{ height: 600 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
          <TableCell style={{ width: 320, fontSize: 18 }}>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>รหัส</p>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>ชื่อ</p>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>รายละเอียด (TH)</p>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>สถานะ</p>
            </TableCell>
            <TableCell>
            </TableCell>
            {!roleRightE && roleRightV &&<TableCell style={{ width: 320, fontSize: 18 }}>
            </TableCell>}
            <TableCell>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listTaxRate.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((TaxRate,index) => {
            return (
              <TableRow tabIndex={-1} key={TaxRate.taxRateId}>
                <TableCell><Checkbox
                  defaultChecked
                  color="primary" checked={getCheckedList(index)}
                  onChange={(e) => changeCheckBoxList(e, index)}
                  inputProps={{ 'aria-label': 'secondary checkbox' }} disabled={TaxRate.status === 'inactive'}
                /></TableCell>
                <TableCell>{TaxRate.taxRateId}</TableCell>
                <TableCell>{TaxRate.name}</TableCell>
                <TableCell>{TaxRate.descriptionTh}</TableCell>
                <TableCell>{TaxRate.status === 'active' ? 'Active' : TaxRate.status === 'inactive' ? 'InActive' : ''}</TableCell>
                <TableCell>
                  {TaxRate.status === 'active' && roleRightE && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => editTaxRate(TaxRate.taxRateId)} disabled={!roleRightE}>
                    Edit
                  </Button>}</TableCell>
                  <TableCell>
                  {TaxRate.status === 'active' && !roleRightE && roleRightV && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => editTaxRate(TaxRate.taxRateId)} disabled={!roleRightV}>
                    View
                  </Button>}</TableCell>
                {/* {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      );
                    })} */}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[10, 25, 100]}
      component="div"
      count={listTaxRate.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </PageBox>
);
}

export default withRouter(ListTaxRate);