import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSpinner } from '../../redux/action/Constants.action';
import { hideSpinner } from '../../redux/action/Constants.action';
import { AuthenService } from '../../_services/authen.service';
import { useHistory,withRouter } from 'react-router-dom';
import { PageBox, SearchBox } from '../reuse/PageBox';
import { Row, Col } from 'reactstrap';

import { makeStyles,ThemeProvider  } from '@material-ui/core/styles';
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
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import {styleButtonAdd,styleButtonsearch,styleButtonClear,styleButtonEdit,styleButtonDelete,colStatus} from '../../themes/style';
import './Role.css';
import Swal from "sweetalert2";

const ListRole = () => {
  const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });
  const dispathch = useDispatch();
  const history = useHistory();

  const [roleName, setRoleName] = useState('');
  const [status, setStatus] = useState('');
  const [checkedList, setCheckedList] = useState({});
  const classes = useRowStyles();
  const [roleRightA, setRoleRightA] = useState(false);
  const [roleRightE, setRoleRightE] = useState(false);
  const [roleRightD, setRoleRightD] = useState(false);
  const [roleRightV, setRoleRightV] = useState(false);
  let rowsRole = [{}];
  let listCheckBox = [{}];
  const [listRole, setListRole] = useState([]);
  let listStatus = [{status:'Active',value:'ST001'},{status:'In Active',value:'ST002'},{status:'All',value:''}];
  
  function appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n
  }

  const fetcData = async () => {
    setRoleName('');
    setStatus('');
    const { status, data } = await AuthenService.callApi("GET").get("/role/listRole");

    if (status === 200) {
      console.log('fetcData data 1 > ', data);
      if (data.listRoleObj !== null && data.listRoleObj.length > 0) {
        for (let i = 0; i < data.listRoleObj.length; i++) {
          let current_datetime = new Date(data.listRoleObj[i].createDate);
          let formatted_date = appendLeadingZeroes((current_datetime.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime.getDate()) + "-" + current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
          let formatted_date_u = '';
          if(data.listRoleObj[i].updateDate != null){
            let current_datetime_u = new Date(data.listRoleObj[i].updateDate);
             formatted_date_u = appendLeadingZeroes((current_datetime_u.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime_u.getDate()) + "-" + current_datetime_u.getFullYear() + " " + current_datetime_u.getHours() + ":" + current_datetime_u.getMinutes() + ":" + current_datetime_u.getSeconds();
          }
          rowsRole[i] = { roleName: data.listRoleObj[i].roleName, id: data.listRoleObj[i].id, createBy: data.listRoleObj[i].createBy, createDate: formatted_date, updateDate: formatted_date_u, updateBy: data.listRoleObj[i].updateBy, status: data.listRoleObj[i].status }
          listCheckBox[i] = {isChecked:false,id: data.listRoleObj[i].id};
          // objCheckedArray[i] = { isChecked: true, id: menu.listMenu[i].id }
        }
        setListRole(rowsRole);
        setCheckedList(listCheckBox);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
      });
    }
    console.log('fetcData data > ', data);
  }

  const handleChangeStatus = (event) => {
    setStatus(event);
  };

useEffect(() => {
  console.log('2');
  const result = AuthenService.checkPermission('Role', 'L');
  
  if (!result) {
    history.push("/main");
  }
  const roleRight = AuthenService.checkRoleRight('Role');
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

const editUser = (id) => {
  history.push("/editRole", { id: id });
}

const deleteUserRole = async () => {
  if(checkedList.length > 0){
    let listRoleObj = [];
    for(var f = 0 ; f < checkedList.length ; f++){
      if(checkedList[f].isChecked){
        listRoleObj.push({id:checkedList[f].id})
      }
    }
    let roleObjC = {listRoleObj};

    const { status, data } = await AuthenService.callApi("POST").post("/role/deleteRole",roleObjC);
    if (status === 200) {
      if(data === 'fail'){
        Swal.fire({
          icon: "error",
          title: "Cannot delete this item because it is used.",
        });
      }else{
        Swal.fire({
          icon: 'success',
          title: 'ลบรายการสำเร็จ',
        });
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

const searchRole = async (roleName, statusRole) => {
  const roleObj ={roleName,status:statusRole }
  const { status, data } = await AuthenService.callApi("POST").post("/role/searchRole",roleObj);
  if(status === 200){
    if (data.listRoleObj !== null && data.listRoleObj.length > 0) {
      for (let i = 0; i < data.listRoleObj.length; i++) {
        let current_datetime = new Date(data.listRoleObj[i].createDate);
        let formatted_date_u = '';
        if(data.listRoleObj[i].updateDate != null){
          let current_datetime_u = new Date(data.listRoleObj[i].updateDate);
           formatted_date_u = appendLeadingZeroes((current_datetime_u.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime_u.getDate()) + "-" + current_datetime_u.getFullYear() + " " + current_datetime_u.getHours() + ":" + current_datetime_u.getMinutes() + ":" + current_datetime_u.getSeconds();
        }
        let formatted_date = appendLeadingZeroes((current_datetime.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime.getDate()) + "-" + current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();

        rowsRole[i] = { roleName: data.listRoleObj[i].roleName, id: data.listRoleObj[i].id, createBy: data.listRoleObj[i].createBy, createDate: formatted_date, updateDate: formatted_date_u, updateBy: data.listRoleObj[i].updateBy, status: data.listRoleObj[i].status }
        listCheckBox[i] = {isChecked:false,id: data.listRoleObj[i].id};
      }
      setListRole(rowsRole);
      setCheckedList(listCheckBox);
    }else if(data.listRoleObj !== null && data.listRoleObj.length === 0){
      setListRole([]);
    }
  }
}


const addRole = () => {
  history.push("/addRole");
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
    <div><tableRow style={{ width: 1080, fontSize: 32, padding: 10 }}>List Role </tableRow></div>
    <div><SearchBox>
        <Row>
          <Col md="auto"><InputLabelReuse label="Role Name :" type="text" value={roleName}
            onChange={(e) => {
              setRoleName(e.target.value);
            }} style={{ width: 280 }} /></Col>
          <Col style={colStatus}><SelectCustom label="Status :" value={status} listData={listStatus}
            onChange={(e) => {
              handleChangeStatus(e.target.value);
            }} style={{ width: 180 }} /></Col>
            <Col><Button variant="contained" color="primary" style={styleButtonClear} onClick={() => fetcData()}>
      Clear
    </Button><Button variant="contained" color="primary" style={styleButtonsearch} onClick={() => searchRole(roleName,status)}>
      Search
    </Button></Col>
    <Col></Col>
        </Row></SearchBox></div>
    <Button variant="contained" startIcon={<DeleteIcon />}  style={styleButtonDelete} onClick={() => deleteUserRole()} disabled={!roleRightD}>
      Delete
    </Button>
    <ThemeProvider>
    <Button variant="contained" startIcon={<SaveIcon />} style={styleButtonAdd} onClick={() => addRole()} disabled={!roleRightA}>
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
              <p>Role Name</p>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>Create Date</p>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>Create By</p>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>Update Date</p>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>Update By</p>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>Status</p>
            </TableCell>
            <TableCell>
            </TableCell>
            {!roleRightE && roleRightV &&<TableCell>
            </TableCell>}
            <TableCell>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listRole.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((role,index) => {
            return (
              <TableRow tabIndex={-1} key={role.id}>
                <TableCell><Checkbox
                  defaultChecked
                  color="primary" checked={getCheckedList(index)}
                  onChange={(e) => changeCheckBoxList(e, index)}
                  inputProps={{ 'aria-label': 'secondary checkbox' }} disabled={role.status === 'ST002'}
                /></TableCell>
                <TableCell>{role.roleName}</TableCell>
                <TableCell>{role.createDate}</TableCell>
                <TableCell>{role.createBy}</TableCell>
                <TableCell>{role.updateDate}</TableCell>
                <TableCell>{role.updateBy}</TableCell>
                <TableCell>{role.status === 'ST001' ? 'Active' : role.status === 'ST002' ? 'InActive' : ''}</TableCell>
                <TableCell>
                  {role.status === 'ST001' && roleRightE && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => editUser(role.id)} disabled={!roleRightE}>
                    Edit
                  </Button>}</TableCell>
                  <TableCell>
                  {role.status === 'ST001' && !roleRightE && roleRightV && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => editUser(role.id)} disabled={!roleRightV}>
                    View
                  </Button>}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[10, 25, 100]}
      component="div"
      count={listRole.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </PageBox>
);
}

export default withRouter(ListRole);