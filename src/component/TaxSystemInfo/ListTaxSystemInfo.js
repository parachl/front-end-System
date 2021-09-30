import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSpinner } from '../../redux/action/Constants.action';
import { hideSpinner } from '../../redux/action/Constants.action';
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
import {styleButtonAdd,styleButtonsearch,styleButtonClear,styleButtonEdit,styleButtonDelete,colStatus,front, headTable} from '../../themes/style';

import  { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import Box from '@mui/material/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import Swal from "sweetalert2";

const ListTaxSystemInfo = () => {
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
  let rowsTaxSystemInfo = [{}];
  let listCheckBox = [{}];
  const [maxId, setMaxid] = useState('');
  const [listTaxSystemInfo, setListTaxSystemInfo] = useState([]);
  let listStatus = [{show:'Active',value:'active'},{show:'In Active',value:'inactive'},{show:'All',value:'all'}];

  function appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n
  }

  const fetcData = async () => {
    setName('');
    setStatus('active');
    const { status, data } = await AuthenService.callApi("GET").get("/taxSystemInfo/listTaxSystemInfo");

    if (status === 200) {
      console.log('fetcData data 1 > ', data);
      if (data.listTaxSystemInfoObj !== undefined && data.listTaxSystemInfoObj.length > 0) {
        for (let i = 0; i < data.listTaxSystemInfoObj.length; i++) {
          let current_datetime = new Date(data.listTaxSystemInfoObj[i].createTime);
          let formatted_date = appendLeadingZeroes((current_datetime.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime.getDate()) + "-" + current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
          let formatted_date_u = '';
          if(data.listTaxSystemInfoObj[i].updateDate != null){
            let current_datetime_u = new Date(data.listTaxSystemInfoObj[i].updateTime);
             formatted_date_u = appendLeadingZeroes((current_datetime_u.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime_u.getDate()) + "-" + current_datetime_u.getFullYear() + " " + current_datetime_u.getHours() + ":" + current_datetime_u.getMinutes() + ":" + current_datetime_u.getSeconds();
          }
          rowsTaxSystemInfo[i] = { systemId: data.listTaxSystemInfoObj[i].systemId,name: data.listTaxSystemInfoObj[i].name,description: data.listTaxSystemInfoObj[i].description,descriptionTh: data.listTaxSystemInfoObj[i].descriptionTh, createUser: data.listTaxSystemInfoObj[i].createUser, createTime: formatted_date, updateTime: formatted_date_u, updateUser: data.listTaxSystemInfoObj[i].updateUser, status: data.listTaxSystemInfoObj[i].status }
          listCheckBox[i] = {isChecked:false,systemId: data.listTaxSystemInfoObj[i].systemId};
        }
        setListTaxSystemInfo(rowsTaxSystemInfo);
        setCheckedList(listCheckBox);
        setMaxid(parseInt(data.maxId));
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
  const result = AuthenService.checkPermission('Tax Deduct', 'L');
  
  if (!result) {
    history.push("/main");
  }
  const roleRight = AuthenService.checkRoleRight('Tax Deduct');
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

const editTaxSystemInfo = (systemId) => {
  console.log('systemId >',systemId);
  history.push("/editTaxSystemInfo", { systemId: systemId });
}

const deleteTaxSystemInfo = async () => {
  if(checkedList.length > 0){
    let listTaxSystemInfoObj = [];
    for(var f = 0 ; f < checkedList.length ; f++){
      if(checkedList[f].isChecked){
        listTaxSystemInfoObj.push({systemId:checkedList[f].systemId})
      }
    }
    let taxSystemInfoCodeObjC = {listTaxSystemInfoObj};

    const { status, data } = await AuthenService.callApi("POST").post("/taxSystemInfo/deleteTaxSystemInfo",taxSystemInfoCodeObjC);
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

const searchRole = async (name, statusTaxSystemInfo) => {
  const taxSystemInfoObj ={name,status:statusTaxSystemInfo }
  console.log('searchTaxSystemInfo TaxSystemInfoCodeObj',taxSystemInfoObj);
  const { status, data } = await AuthenService.callApi("POST").post("/taxSystemInfo/searchTaxSystemInfo",taxSystemInfoObj);
  console.log('searchTaxSystemInfo statusHttp',status);
  if(status === 200){
    if (data.listTaxSystemInfoObj !== null && data.listTaxSystemInfoObj.length > 0) {
      console.log('searchTaxSystemInfo in',data);
      for (let i = 0; i < data.listTaxSystemInfoObj.length; i++) {
        let current_datetime = new Date(data.listTaxSystemInfoObj[i].createTime);
        let formatted_date_u = '';
        if(data.listTaxSystemInfoObj[i].updateTime != null){
          let current_datetime_u = new Date(data.listTaxSystemInfoObj[i].updateTime);
           formatted_date_u = appendLeadingZeroes((current_datetime_u.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime_u.getDate()) + "-" + current_datetime_u.getFullYear() + " " + current_datetime_u.getHours() + ":" + current_datetime_u.getMinutes() + ":" + current_datetime_u.getSeconds();
        }
        let formatted_date = appendLeadingZeroes((current_datetime.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime.getDate()) + "-" + current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();

        rowsTaxSystemInfo[i] = { systemId: data.listTaxSystemInfoObj[i].systemId,name: data.listTaxSystemInfoObj[i].name,description: data.listTaxSystemInfoObj[i].description,descriptionTh: data.listTaxSystemInfoObj[i].descriptionTh, createUser: data.listTaxSystemInfoObj[i].createUser, createTime: formatted_date, updateTime: formatted_date_u, updateUser: data.listTaxSystemInfoObj[i].updateUser, status: data.listTaxSystemInfoObj[i].status }
        listCheckBox[i] = {isChecked:false,systemId: data.listTaxSystemInfoObj[i].systemId};
      }
      setListTaxSystemInfo(rowsTaxSystemInfo);
      setCheckedList(listCheckBox);
    }else if(data.listTaxSystemInfoObj !== null && data.listTaxSystemInfoObj.length === 0){
      console.log('searchTaxSystemInfo null',data);
      setListTaxSystemInfo([]);
    }
  }
}
//-------------------------------------- header table ------------------------------------------------------

const [open, setOpen] = React.useState(true);

const headCells = [
  {
    id: 'systemId',
    numeric: false,
    align: "center",
    disablePadding: false,
    label: 'รหัส',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    align: "center",
    label: 'ชื่อ',
  },
  {
    id: 'descriptionTh',
    numeric: false,
    disablePadding: false,
    align: "center",
    label: 'รายละเอียด',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    align: "center",
    label: 'สถานะ',
  },
  {
    field: " ",
    headerName: " ",
    align: "center",
    width: 100,
  },
  {
    field: " ",
    headerName: " ",
    align: "center",
    width: 100,
  }
];
const handleClick = () => {
  setOpen(!open);
};

function EnhancedTableHead(props) {
  const {  order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead >
      <TableRow >
        <TableCell padding="checkbox" style={headTable}>
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
             style={headTable}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('systemId');

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listTaxSystemInfo.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

//-----------------------------------------------------------------------------------------------------------------------------

const addTaxSystemInfo= () => {
  history.push("/addTaxSystemInfo", {maxId:maxId });
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
    <div><tableRow style={{ width: 1080, fontSize: 32, padding: 10 }}>รหัสระบบงาน <IconButton style={{ float: 'right', right: '0px', marginBottom: '20px' }} aria-label="expand row" size="small" onClick={() => handleClick()}>
      filter{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton></tableRow></div>
      <Collapse in={open} timeout="auto" unmountOnExit><SearchBox>
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
    </Row></SearchBox></Collapse>
    <Button variant="contained" startIcon={<DeleteIcon />}  style={styleButtonDelete} onClick={() => deleteTaxSystemInfo()} disabled={!roleRightD}>
      Delete
    </Button>
    <ThemeProvider>
    <Button variant="contained" startIcon={<SaveIcon />} style={styleButtonAdd} onClick={() => addTaxSystemInfo()} disabled={!roleRightA}>
      Add
    </Button>
    </ThemeProvider>
    <TableContainer className={classes.container} style={{ height: 600 }}>
        <Table style={{ border: '1px solid #D3D3D3' }} stickyHeader aria-label="sticky table" >
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={listTaxSystemInfo.length}
          />
        <TableBody>
        {stableSort(listTaxSystemInfo, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((taxSystemInfo, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <StyledTableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        defaultChecked
                        color="primary" checked={getCheckedList(index)}
                        onChange={(e) => changeCheckBoxList(e, index)}
                        inputProps={{ 'aria-label': 'secondary checkbox' }} disabled={taxSystemInfo.status === 'inactive'}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row" style={front}>
                      {taxSystemInfo.systemId}
                    </TableCell>
                    <TableCell style={front}>{taxSystemInfo.name}</TableCell>
                    <TableCell style={front}>{taxSystemInfo.description}</TableCell>
                    <TableCell style={front}>{taxSystemInfo.status}</TableCell>
                    <TableCell>
                  {taxSystemInfo.status === 'active' && roleRightE && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => editTaxSystemInfo(taxSystemInfo.systemId)} disabled={!roleRightE}>
                    Edit
                  </Button>}</TableCell>
                  <TableCell>
                  {taxSystemInfo.status === 'active' && !roleRightE && roleRightV && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => editTaxSystemInfo(taxSystemInfo.systemId)} disabled={!roleRightV}>
                    View
                  </Button>}</TableCell>
                  </StyledTableRow>);
              })}
          {/* {listTaxSystemInfo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((taxSystemInfo,index) => {
            return (
              <TableRow tabIndex={-1} key={taxSystemInfo.systemId}>
                <TableCell><Checkbox
                  defaultChecked
                  color="primary" checked={getCheckedList(index)}
                  onChange={(e) => changeCheckBoxList(e, index)}
                  inputProps={{ 'aria-label': 'secondary checkbox' }} disabled={taxSystemInfo.status === 'inactive'}
                /></TableCell>
                <TableCell>{taxSystemInfo.systemId}</TableCell>
                <TableCell>{taxSystemInfo.name}</TableCell>
                <TableCell>{taxSystemInfo.descriptionTh}</TableCell>
                <TableCell>{taxSystemInfo.status === 'active' ? 'Active' : taxSystemInfo.status === 'inactive' ? 'InActive' : ''}</TableCell>
                <TableCell>
                  {taxSystemInfo.status === 'active' && roleRightE && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => editTaxSystemInfo(taxSystemInfo.systemId)} disabled={!roleRightE}>
                    Edit
                  </Button>}</TableCell>
                  <TableCell>
                  {taxSystemInfo.status === 'active' && !roleRightE && roleRightV && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => editTaxSystemInfo(taxSystemInfo.systemId)} disabled={!roleRightV}>
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
              {/* </TableRow> */}
            {/* ); */}
          {/* })} */} 
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[10, 25, 100]}
      component="div"
      count={listTaxSystemInfo.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </PageBox>
);
}

export default withRouter(ListTaxSystemInfo);