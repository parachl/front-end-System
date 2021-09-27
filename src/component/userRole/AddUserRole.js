import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSpinner } from '../../action/Constants.action';
import { hideSpinner } from '../../action/Constants.action';
import { AuthenService } from '../../_services/authen.service';
import { useHistory,withRouter } from 'react-router-dom';
import { PageBox } from '../reuse/PageBox';
import api from "../../api/GetApi";

import { alpha, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import { FormGroup } from 'reactstrap';
import { InputLabelReuse } from '../reuse/InputLabel';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from "@material-ui/core/InputLabel";
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import InputBase from '@material-ui/core/InputBase';
import {styleDivButton,styleButton,styleButtonCancel} from '../../themes/style';
import { get } from 'lodash';

const AddUserRole = () => {
  const dispathch = useDispatch();
  const history = useHistory();
  const [searchUser, setSearchUser] = useState('');
  const [role, setRole] = useState('Select role');
  const [listRole, setListRole] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [dataUserStore, setUserStore] = useState([]);
  const [userList, setUserList] = useState([]);
  let roleName = 'select role';
  let rowsRole = [{}];
  let users = [];

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '40%',
      margin: 40,

    },
    container: {
      minHeight: 440,
      maxHeight: 440,

    },
    boxTable: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'

    }
    ,
    buttonDelete: {
      display: 'flex',
      left: 400,
      width: 80,
      padding: 10
    }
    , formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    selectRole: {
      marginLeft: 105,
    }, search: {
      marginTop: 10,
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },clearIcon: {
      paddingTop: '15px',
    }, inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    }


  }));

  const fetcData = async () => {
    const { status, data } = await AuthenService.callApi("GET").get("/role/listRole");

    if (status === 200) {
      console.log('list role data > ', data);
      if (data.listRoleObj !== null && data.listRoleObj.length > 0) {
        for (let i = 0; i < data.listRoleObj.length; i++) {
          rowsRole[i] = { roleName: data.listRoleObj[i].roleName, id: data.listRoleObj[i].id }
          // objCheckedArray[i] = { isChecked: true, id: menu.listMenu[i].id }
        }
        setListRole(rowsRole);
        // setListRoleMenu(objRoleArray);
        // setCheckedMenu(objCheckedArray)
      }
      //  console.log("rowsRole >>", rowsRole);
    } else {
      alert('error');
    }

  }

  const fetcDataUser = async () => {
    const { status, data } = await AuthenService.callApi("GET").get("/user/listUser");
    console.log('statusUser > ', status);
    console.log('dataUser > ', data);
    if (status === 200) {
      if (data.listUserObj !== null && data.listUserObj.length > 0) {
        if(userList.length > 0){
          for (let i = 0; i < data.listUserObj.length; i++) {
            let check = false;
            for (let b = 0; b < userList.length; b++) {
              if (userList[b].userName === data.listUserObj[i].userName) {
                check = true;
              }
            }
            if(!check){
              console.log('fetcDataUser get in > ', data.listUserObj[i].userName);
              users.push({userName: data.listUserObj[i].userName, id: data.listUserObj[i].id});
            }
          }
          setDataUser(users);
          setUserStore(users);
        }else{
          for (let i = 0; i < data.listUserObj.length; i++) {
          
            users[i] = { userName: data.listUserObj[i].userName, id: data.listUserObj[i].id }
            // objCheckedArray[i] = { isChecked: true, id: menu.listMenu[i].id }
          }
          setUserStore(users);
          setDataUser(users);
        }
      
        // setListRoleMenu(objRoleArray);
        // setCheckedMenu(objCheckedArray)
      }

     
      console.log('users 111111> ', users);
      //  console.log("rowsRole >>", rowsRole);
    } else {
      alert('error');
    }
  }

  const initPage = () => {
    console.log('3');
    dispathch(showSpinner());
    fetcData();
    fetcDataUser();
    setTimeout(function () {
      dispathch(hideSpinner())
    }, 500);

    const result = AuthenService.checkPermission('UserRole', 'A');

    if (!result) {
      history.push("/main");
    }

  }

  useEffect(() => {
    initPage();
  }, []);

  const submitAddUserRole = async () => {

    if (role !== '' && userList.length > 0) {
      let listUsers = [];
      for(let j=0 ; j < userList.length; j++){
        listUsers.push(userList[j].id);
      }
      const userRoleObj = { roleId: role, listUserId: listUsers };
      console.log('userRoleObj', userRoleObj);
      const { status, data } = await AuthenService.callApi("POST").post("/userRole/addUserRole",userRoleObj);
      console.log('data' , data);
      if(data === 'Success'){
        history.push("/listUserRole");
      }
    }else{
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
    
  }

  const submitSelectUser = (id) => {
    var index = dataUser.findIndex((x) => x.id === id);
    if (index !== -1) {
      console.log('submitSelectUserindex',index);
      let g = dataUser[index];
      setUserList([...userList.slice(0, userList.length),g]);
      setDataUser([...dataUser.slice(0, index),...dataUser.slice(index+1, 1), ...dataUser.slice(index + 1)]);
      
    }
  }

  const deleteSelectUser = (id) => {
    var index = userList.findIndex((x) => x.id === id);
    console.log('index delete >>',index);
    if (index !== -1) {
      let g = userList[index];
      setDataUser([...dataUser.slice(0, dataUser.length),g]);
      setUserList([...userList.slice(0, index),...userList.slice(index+1, 1), ...userList.slice(index + 1)]);
    }
  }
console.log('userList >>',userList);

const submitSearch = async (userName) => {
  let filtered = dataUserStore.filter(dataUserStore => dataUserStore.userName.includes(userName));
  console.log('submitSearch filtered', filtered);
  setDataUser(filtered);
  if(userName === ''){
    fetcDataUser();
  }
}

const clearSearch = () => {
  fetcDataUser();
  setSearchUser('');
}

  const handleChangeRole = (event) => {
    setRole(event.target.value);
  };

  function cancel() {
    history.push("/listUserRole");
  }

  const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };


  const UserList = () => {
    const classes = useStyles();
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
      <Paper className={classes.root} >
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: 450 }}>
                  <p>UserId</p>
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => {
                return (
                  <TableRow tabIndex={-1} key={user.id}>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" style={styleButton} onClick={() => deleteSelectUser(user.id)}>
                        Delete
                      </Button></TableCell>
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
          count={rowsRole.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
  }

  const SimpleSelect = () => {
    const classes = useStyles();
    return (
      <div className={classes.selectRole}><FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Role</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={role}
          onChange={(event) => handleChangeRole(event)}
          label="Role"
        >
          {listRole !== null && listRole.map((role, index) => (
            <MenuItem value={role.id}>{role.roleName}</MenuItem>
          ))}
        </Select>
      </FormControl></div>
    );
  }

  return (
    <PageBox>
      <SimpleSelect></SimpleSelect>
      <div class="row" className={classes.boxTable}>
        <UserList></UserList>
        <Paper className={classes.root} >
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <div class="row">
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                    <InputBase
                      placeholder="Search…"
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      value={searchUser} onChange={(e) => {
                        setSearchUser(e.target.value);
                      }} 
                    />
                  </div>
                  <div className={classes.clearIcon}>
                      <ClearIcon onClick={() => clearSearch()} />
                    </div>
                  <Button variant="contained" color="primary" style={styleButton} onClick={() => submitSearch(searchUser)}>
                    Search
                  </Button>
                </div>

              </TableRow>
              <TableRow>
                <TableCell>
                  <p>UserId</p>
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataUser.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => {
                console.log('user html >.', user.userName);
                return (
                  <TableRow tabIndex={-1} key={user.id}>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" style={styleButton} onClick={() => submitSelectUser(user.id)}>
                        Add
                      </Button></TableCell>
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
          count={rowsRole.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      </div>
      <div style={styleDivButton}>
        <Button variant="contained" color="primary" style={styleButton} onClick={() => submitAddUserRole()}>
          Submit
        </Button>
        <Button variant="contained" style={styleButtonCancel} onClick={() => cancel()}>
          Cancel
        </Button>
      </div>
    </PageBox>
  );
}

export default withRouter(AddUserRole);