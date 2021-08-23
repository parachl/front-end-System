import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSpinner } from '../../action/Constants.action';
import { hideSpinner } from '../../action/Constants.action';
import { AuthenService } from '../../_services/authen.service';
import { useHistory } from 'react-router-dom';
import { PageBox, SearchBox } from '../reuse/PageBox';
import styled from "styled-components";
import { FormGroup, Label, Row, Col } from 'reactstrap';
import api from "../../api/GetApi";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
import { InputLabelReuse } from '../reuse/InputLabel';
import Button from '@material-ui/core/Button';
import TablePagination from '@material-ui/core/TablePagination';
import { SelectCustom } from '../reuse/SelectCustom';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import Checkbox from '@material-ui/core/Checkbox';

const ListUserRole = () => {
  const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
    scrollBar: {
      '&::-webkit-scrollbar': {
        width: '0.4em'
      },
      '&::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.1)',
        outline: '1px solid slategrey'
      }
    },
  });
  const dispathch = useDispatch();
  const history = useHistory();
  const menus = JSON.parse(localStorage.getItem('listMenu'));

  console.log('1');

  const [listGroupRoleMenu, setListGroupRoleMenu] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [checkedGroupMenu, setCheckedGroupMenu] = useState({});
  const [listRoleByUser, setListRoleByUser] = useState([]);
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const [init, setInit] = useState('');
  let userRoles = [{}];
  const [listUserRole, setListUserRole] = useState([]);
  const [userName, setUserName] = useState('');
  const [userNameDelete, setUserNameDelete] = useState('');
  const [status, setStatus] = useState('');
  const [checkedList, setCheckedList] = useState({});
  let listRoleMenuAdd = [];
  let listCheckBox = [{}];
  let listStatus = [{ status: 'Active', value: 'ST001' }, { status: 'In Active', value: 'ST002' }, { status: 'All', value: '' }];
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
    background: 'linear-gradient(45deg, #00e676 30%, #80deea 70%)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  };

  const styleButtonSearch = {
    float: 'right',
    marginRight: '23px',
    background: '#7c4dff',
    marginBottom: '20px',
    boxShadow: '0 2px 5px 2px #888888',
  };
  const styleButtonClear = {
    float: 'right',
    marginRight: '23px',
    background: '##9fa8da',
    marginBottom: '20px',
    boxShadow: '0 2px 5px 2px #888888',
  };

  const styleButtonEdit = {
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
    background: 'linear-gradient(45deg, #ff1744 30%, #29b6f6 90%)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  };

  const styleButtonDeleteUser = {
    float: 'right',
    marginRight: '23px',
    marginBottom: '20px',
    color: 'white',
    background:  '#ff1744',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  };

  const styleButton = {
    margin: '10px',
  };

  const colStatus = {
    marginLeft: '0px',
  };

  function appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n
  }

  const handleChangeStatus = (event) => {
    setStatus(event);
  };

  const fetcData = async () => {
    const { status, data } = await AuthenService.callApi("GET").get("/userRole/listUserRole");

    if (status === 200) {
      console.log('list role data > ', data);
      if (data.listUserRoleObj !== null && data.listUserRoleObj.length > 0) {
        for (let i = 0; i < data.listUserRoleObj.length; i++) {
          let current_datetime = new Date(data.listUserRoleObj[i].createDate);
          let formatted_date_u = '';
          if(data.listUserRoleObj[i].updateDate != null){
            let current_datetime_u = new Date(data.listUserRoleObj[i].updateDate);
             formatted_date_u = appendLeadingZeroes((current_datetime_u.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime_u.getDate()) + "-" + current_datetime_u.getFullYear() + " " + current_datetime_u.getHours() + ":" + current_datetime_u.getMinutes() + ":" + current_datetime_u.getSeconds();
          }
          let formatted_date = appendLeadingZeroes((current_datetime.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime.getDate()) + "-" + current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
          userRoles[i] = { roleName: data.listUserRoleObj[i].roleObj.roleName, userName: data.listUserRoleObj[i].userObj.userName, groupId: data.listUserRoleObj[i].groupId, createBy: data.listUserRoleObj[i].createBy, createDate: formatted_date, updateDate: formatted_date_u, updateBy: data.listUserRoleObj[i].updateBy, status: data.listUserRoleObj[i].status }
          listCheckBox[i] = {isChecked:false,id: data.listUserRoleObj[i].id};
        }
        setListUserRole(userRoles);
        setCheckedList(listCheckBox);
      }
      console.log("userRoles >>", userRoles);
    } else {
      alert('error');
    }

  }

  const initPage = () => {
    const result = AuthenService.checkPermission('UserRole', 'L');
    if (!result) {
      history.push("/main");
    }

  }

  useEffect(() => {
    console.log('2');
    initPage();
    fetcData();
  }, []);

  const searchUser = async (userName,roleName, statusRole) => {
    const userRoleObj = { userName,roleName, status: statusRole }
    console.log('searchUserRole userRoleObj', userRoleObj);
    const { status, data } = await AuthenService.callApi("POST").post("/userRole/searchUserRole",userRoleObj);

    if (status === 200) {
      console.log('list role data > ', data);
      if (data.listUserRoleObj !== null && data.listUserRoleObj.length > 0) {
        for (let i = 0; i < data.listUserRoleObj.length; i++) {
          let current_datetime = new Date(data.listUserRoleObj[i].createDate);
          let formatted_date_u = '';
          if(data.listUserRoleObj[i].updateDate != null){
            let current_datetime_u = new Date(data.listUserRoleObj[i].updateDate);
             formatted_date_u = appendLeadingZeroes((current_datetime_u.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime_u.getDate()) + "-" + current_datetime_u.getFullYear() + " " + current_datetime_u.getHours() + ":" + current_datetime_u.getMinutes() + ":" + current_datetime_u.getSeconds();
          }
          let formatted_date = appendLeadingZeroes((current_datetime.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime.getDate()) + "-" + current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
         
          userRoles[i] = { roleName: data.listUserRoleObj[i].roleObj.roleName, userName: data.listUserRoleObj[i].userObj.userName, groupId: data.listUserRoleObj[i].groupId, createBy: data.listUserRoleObj[i].createBy, createDate: formatted_date, updateDate: formatted_date_u, updateBy: data.listUserRoleObj[i].updateBy, status: data.listUserRoleObj[i].status }
          listCheckBox[i] = {isChecked:false,id: data.listUserRoleObj[i].id};
        }
        setCheckedList(listCheckBox);
        setListUserRole(userRoles);
      }else{
        setCheckedList([]);
        setListUserRole([]);
      }
      console.log("userRoles >>", userRoles);
    } else {
      alert('error');
    }

    
  }

  const editUser = (groupId) => {
    // const { status, data } = await api.post("/findById", userRoleObj);
    // console.log('data' , data);
    // if(data === 'Success'){
    history.push("/editUserRole", { groupId: groupId });
    // }
  }

  function getCheckedList(index) {
    console.log('checkedList index>', index);
    if (checkedList.length > 0) {
      console.log('checkedList >', checkedList);
      return checkedList[index].isChecked;
    }else{
      return false;
    }
  }

  const changeCheckBoxList = (event, index) => {
    console.log('changeCheckBoxList index>', index);
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

  const delteUserRole = async () => {
      if(checkedList.length > 0){
        let listUserRoleObj = [];
        for(var f = 0 ; f < checkedList.length ; f++){
          if(checkedList[f].isChecked){
            listUserRoleObj.push({id:checkedList[f].id})
          }
        }
        let userRoleObjC = {listUserRoleObj};
    
        const { status, data } = await AuthenService.callApi("POST").post("/userRole/deleteUserRole",userRoleObjC);
        if (status === 200) {
          if(data === 'fail'){
            alert('error please contact admin');
          }else{
            fetcData();
          }
        }
      }
  }



  const addUserRole = () => {
    // const { status, data } = await api.post("/addUserRole", userRoleObj);
    // console.log('data' , data);
    // if(data === 'Success'){
    history.push("/addUserRole");
    // }
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


  const [openModal, setOpenModal] = React.useState(false);

  const handleClickOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const suubmitDeleteAllRole = async () => {
    const { status, data } = await AuthenService.callApi("POST").post("/userRole/deleteUserRole",userRoleObjC);
        if (status === 200) {
          if(data === 'fail'){
            alert('error please contact admin');
          }else{
            fetcData();
          }
        }
    setOpenModal(false);
  };

  return (
    <PageBox>
      <div style={{ width: 980, fontSize: 32, padding: 10 }}>List User Role</div><div><SearchBox>
        <Row>
          <Col md="auto"><InputLabelReuse label="User Name :" type="text" value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }} /></Col>
            <Col md="auto"><InputLabelReuse label="Role Name :" type="text" value={roleName}
            onChange={(e) => {
              setRoleName(e.target.value);
            }}  /></Col>
          <Col style={colStatus}><SelectCustom label="Status :" value={status} listData={listStatus}
            onChange={(e) => {
              handleChangeStatus(e.target.value);
            }} /></Col>
          <Col><Button variant="contained" color="primary" style={styleButtonClear} onClick={() => fetcData()}>
            Clear
          </Button>
          <Button variant="contained" color="primary" style={styleButtonSearch} onClick={() => searchUser(userName,roleName, status)}>
              Search
            </Button></Col>
        </Row></SearchBox></div>
        <Button variant="contained" startIcon={<DeleteIcon />}  style={styleButtonDelete} onClick={() => delteUserRole()}>
      Delete
    </Button>
    <div>
      <Button variant="outlined" color="primary" style={styleButtonDeleteUser} onClick={handleClickOpen}>
        Delete User All Role
      </Button>
      <Dialog open={openModal} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Delete User All Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Please fill out UserName to remove from all role permission.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="User Name"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogContent dividers>
          {listRoleByUser.map((option) => (
            <FormControlLabel value={userNameDelete} key={option} label={option} onChange={(e) => {
              setUserNameDelete(e.target.value);
            }} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={suubmitDeleteAllRole} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
        <Button variant="contained" startIcon={<SaveIcon />} style={styleButtonAdd} onClick={() => addUserRole()}>
        Add
      </Button>
      <TableContainer className={classes.container} style={{ height: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <tableRow > </tableRow>
            <TableRow>
            <TableCell style={{ width: 320, fontSize: 18 }}>
            </TableCell>
              <TableCell style={{ width: 320, fontSize: 18 }}>
                <p>User Name</p>
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
            </TableRow>
          </TableHead>
          <TableBody style={{ height: 600 }}>
            {listUserRole.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((userRole,index) => {
              return (
                <TableRow tabIndex={-1} key={userRole.id}>
                  <TableCell><Checkbox
                  defaultChecked
                  color="primary" checked={getCheckedList(index)}
                  onChange={(e) => changeCheckBoxList(e, index)}
                  inputProps={{ 'aria-label': 'secondary checkbox' }} disabled={userRole.status === 'ST002'}
                /></TableCell>
                  <TableCell>{userRole.userName}</TableCell>
                  <TableCell>{userRole.roleName}</TableCell>
                  <TableCell>{userRole.createDate}</TableCell>
                  <TableCell>{userRole.createBy}</TableCell>
                  <TableCell>{userRole.updateDate}</TableCell>
                  <TableCell>{userRole.updateBy}</TableCell>
                  <TableCell>{userRole.status === 'ST001' ? 'Active' : userRole.status === 'ST002' ? 'InActive' : ''}</TableCell>
                  <TableCell>
                  {userRole.status === 'ST001' && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => editUser(userRole.groupId)}>
                      Edit
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
        count={listUserRole.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </PageBox>
  );
}

export default ListUserRole;