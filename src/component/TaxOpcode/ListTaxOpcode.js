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

const ListTaxOpcode = () => {
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
  let rowsTaxOpcode = [{}];
  let listCheckBox = [{}];
  const [listTaxOpcode, setListTaxOpcode] = useState([]);
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
    const { status, data } = await AuthenService.callApi("GET").get("/taxOpcode/listTaxOpcode");

    if (status === 200) {
      console.log('fetcData data 1 > ', data);
      if (data.listTaxOpcodeObj !== undefined && data.listTaxOpcodeObj.length > 0) {
        for (let i = 0; i < data.listTaxOpcodeObj.length; i++) {
          let current_datetime = new Date(data.listTaxOpcodeObj[i].createTime);
          let formatted_date = appendLeadingZeroes((current_datetime.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime.getDate()) + "-" + current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
          let formatted_date_u = '';
          if(data.listTaxOpcodeObj[i].updateDate != null){
            let current_datetime_u = new Date(data.listTaxOpcodeObj[i].updateTime);
             formatted_date_u = appendLeadingZeroes((current_datetime_u.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime_u.getDate()) + "-" + current_datetime_u.getFullYear() + " " + current_datetime_u.getHours() + ":" + current_datetime_u.getMinutes() + ":" + current_datetime_u.getSeconds();
          }
          rowsTaxOpcode[i] = { opcode: data.listTaxOpcodeObj[i].opcode,name: data.listTaxOpcodeObj[i].name,groupType: data.listTaxOpcodeObj[i].groupType,opcodeType: data.listTaxOpcodeObj[i].opcodeType,netType: data.listTaxOpcodeObj[i].netType,incomeCatalogId: data.listTaxOpcodeObj[i].incomeCatalogId,minRate: data.listTaxOpcodeObj[i].minRate,maxRate: data.listTaxOpcodeObj[i].maxRate,minBaht: data.listTaxOpcodeObj[i].minBaht,maxBaht: data.listTaxOpcodeObj[i].maxBaht,calTax: data.listTaxOpcodeObj[i].calTax,calSoc: data.listTaxOpcodeObj[i].calSoc,requireDocNo: data.listTaxOpcodeObj[i].requireDocNo, createUser: data.listTaxOpcodeObj[i].createUser, createTime: formatted_date, updateTime: formatted_date_u, updateUser: data.listTaxOpcodeObj[i].updateUser, status: data.listTaxOpcodeObj[i].status }
          listCheckBox[i] = {isChecked:false,opcode: data.listTaxOpcodeObj[i].opcode};
        }
        setListTaxOpcode(rowsTaxOpcode);
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
  const result = AuthenService.checkPermission('OP Code', 'L');
  
  if (!result) {
    history.push("/main");
  }
  const roleRight = AuthenService.checkRoleRight('OP Code');
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

const editTaxOpcode = (opcode) => {
  console.log('opcode >',opcode);
  history.push("/editTaxOpcode", { opcode: opcode });
}

const deleteTaxOpcode = async () => {
  if(checkedList.length > 0){
    let listTaxOpcodeObj = [];
    for(var f = 0 ; f < checkedList.length ; f++){
      if(checkedList[f].isChecked){
        listTaxOpcodeObj.push({opcode:checkedList[f].opcode})
      }
    }
    let taxOpcodeCodeObjC = {listTaxOpcodeObj};

    const { status, data } = await AuthenService.callApi("POST").post("/taxOpcode/deleteTaxOpcode",taxOpcodeCodeObjC);
    if (status === 200) {
      if(data === 'fail'){
        Swal.fire({
          icon: "error",
          title: "Cannot delete this item because it is used.",
        });
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

const searchRole = async (name, statusTaxOpcode) => {
  const taxOpcodeObj ={name,status:statusTaxOpcode }
  console.log('searchTaxOpcode TaxOpcodeCodeObj',taxOpcodeObj);
  const { status, data } = await AuthenService.callApi("POST").post("/taxOpcode/searchTaxOpcode",taxOpcodeObj);
  console.log('searchTaxOpcode statusHttp',status);
  if(status === 200){
    if (data.listTaxOpcodeObj !== null && data.listTaxOpcodeObj.length > 0) {
      console.log('searchTaxOpcode in',data);
      for (let i = 0; i < data.listTaxOpcodeObj.length; i++) {
        let current_datetime = new Date(data.listTaxOpcodeObj[i].createTime);
        let formatted_date_u = '';
        if(data.listTaxOpcodeObj[i].updateTime != null){
          let current_datetime_u = new Date(data.listTaxOpcodeObj[i].updateTime);
           formatted_date_u = appendLeadingZeroes((current_datetime_u.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime_u.getDate()) + "-" + current_datetime_u.getFullYear() + " " + current_datetime_u.getHours() + ":" + current_datetime_u.getMinutes() + ":" + current_datetime_u.getSeconds();
        }
        let formatted_date = appendLeadingZeroes((current_datetime.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime.getDate()) + "-" + current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();

        rowsTaxOpcode[i] = { opcode: data.listTaxOpcodeObj[i].opcode,name: data.listTaxOpcodeObj[i].name,groupType: data.listTaxOpcodeObj[i].groupType,opcodeType: data.listTaxOpcodeObj[i].opcodeType,netType: data.listTaxOpcodeObj[i].netType,incomeCatalogId: data.listTaxOpcodeObj[i].incomeCatalogId,minRate: data.listTaxOpcodeObj[i].minRate,maxRate: data.listTaxOpcodeObj[i].maxRate,minBaht: data.listTaxOpcodeObj[i].minBaht,maxBaht: data.listTaxOpcodeObj[i].maxBaht,calTax: data.listTaxOpcodeObj[i].calTax,calSoc: data.listTaxOpcodeObj[i].calSoc,requireDocNo: data.listTaxOpcodeObj[i].requireDocNo, createUser: data.listTaxOpcodeObj[i].createUser, createTime: formatted_date, updateTime: formatted_date_u, updateUser: data.listTaxOpcodeObj[i].updateUser, status: data.listTaxOpcodeObj[i].status }
        listCheckBox[i] = {isChecked:false,opcode: data.listTaxOpcodeObj[i].opcode};
      }
      setListTaxOpcode(rowsTaxOpcode);
      setCheckedList(listCheckBox);
    }else if(data.listTaxOpcodeObj !== null && data.listTaxOpcodeObj.length === 0){
      console.log('searchTaxOpcode null',data);
      setListTaxOpcode([]);
    }
  }
}

//-------------------------------------- header table ------------------------------------------------------

const [open, setOpen] = React.useState(true);

const headCells = [
  {
    id: 'opcode',
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
    id: 'groupType',
    numeric: false,
    disablePadding: false,
    align: "center",
    label: 'Group',
  },
  {
    id: 'opcodeType',
    numeric: false,
    disablePadding: false,
    align: "center",
    label: 'Type',
  },
  {
    id: 'netType',
    numeric: false,
    disablePadding: false,
    align: "center",
    label: 'NetType',
  },
  {
    id: 'incomeCatalogId',
    numeric: false,
    disablePadding: false,
    align: "center",
    label: 'ประเภทเงินได้',
  },
  {
    id: 'minRate',
    numeric: false,
    disablePadding: false,
    align: "center",
    label: 'Min(%)',
  },
  {
    id: 'maxRate',
    numeric: false,
    disablePadding: false,
    align: "center",
    label: 'Max(%)',
  },
  {
    id: 'calSoc',
    numeric: false,
    disablePadding: false,
    align: "center",
    label: 'คำนวณประกันสังคม',
  },
  {
    id: 'calTax',
    numeric: false,
    disablePadding: false,
    align: "center",
    label: 'คำนวณภาษี',
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
  const [orderBy, setOrderBy] = React.useState('opcode');

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listTaxOpcode.map((n) => n.name);
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

const addTaxOpcode= () => {
  history.push("/addTaxOpcode");
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
    <Button variant="contained" startIcon={<DeleteIcon />}  style={styleButtonDelete} onClick={() => deleteTaxOpcode()} disabled={!roleRightD}>
      Delete
    </Button>
    <ThemeProvider>
    <Button variant="contained" startIcon={<SaveIcon />} style={styleButtonAdd} onClick={() => addTaxOpcode()} disabled={!roleRightA}>
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
            rowCount={listTaxOpcode.length}
          />
    {/* <TableContainer className={classes.container} style={{ height: 600 }}>
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
              <p>Group</p>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>Type</p>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>NetType</p>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>ประเภทเงินได้</p>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>Min(%)</p>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>Max(%)</p>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>Cal SOC</p>
            </TableCell>
            <TableCell style={{ width: 320, fontSize: 18 }}>
              <p>Cal TAX</p>
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
        </TableHead> */}
        <TableBody>
        {stableSort(listTaxOpcode, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((taxOpcode, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <StyledTableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        defaultChecked
                        color="primary" checked={getCheckedList(index)}
                        onChange={(e) => changeCheckBoxList(e, index)}
                        inputProps={{ 'aria-label': 'secondary checkbox' }} disabled={taxOpcode.status === 'inactive'}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row" style={front}>
                      {taxOpcode.opcode}
                    </TableCell>
                <TableCell>{taxOpcode.name}</TableCell>
                <TableCell>{taxOpcode.groupType}</TableCell>
                <TableCell>{taxOpcode.opcodeType}</TableCell>
                <TableCell>{taxOpcode.netType}</TableCell>
                <TableCell>{taxOpcode.incomeCatalogId}</TableCell>
                <TableCell>{taxOpcode.minRate}</TableCell>
                <TableCell>{taxOpcode.maxRate}</TableCell>
                <TableCell>{taxOpcode.calSoc === true ? 'Y' : taxOpcode.calSoc === false ? 'N' : ''}</TableCell>
                <TableCell>{taxOpcode.calTax === true ? 'Y' : taxOpcode.calTax === false ? 'N' : ''}</TableCell>
                <TableCell>{taxOpcode.status === 'active' ? 'Active' : taxOpcode.status === 'inactive' ? 'InActive' : ''}</TableCell>
                    <TableCell>
                  {taxOpcode.status === 'active' && roleRightE && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => editTaxOpcode(taxOpcode.opcode)} disabled={!roleRightE}>
                    Edit
                  </Button>}</TableCell>
                  <TableCell>
                  {taxOpcode.status === 'active' && !roleRightE && roleRightV && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => editTaxOpcode(taxOpcode.opcode)} disabled={!roleRightV}>
                    View
                  </Button>}</TableCell>
                  </StyledTableRow>);
              })}
          {/* {listTaxOpcode.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((taxOpcode,index) => {
            return (
              <TableRow tabIndex={-1} key={taxOpcode.opcode}>
                <TableCell><Checkbox
                  defaultChecked
                  color="primary" checked={getCheckedList(index)}
                  onChange={(e) => changeCheckBoxList(e, index)}
                  inputProps={{ 'aria-label': 'secondary checkbox' }} disabled={taxOpcode.status === 'inactive'}
                /></TableCell>
                <TableCell>{taxOpcode.opcode}</TableCell>
                <TableCell>{taxOpcode.name}</TableCell>
                <TableCell>{taxOpcode.groupType}</TableCell>
                <TableCell>{taxOpcode.opcodeType}</TableCell>
                <TableCell>{taxOpcode.netType}</TableCell>
                <TableCell>{taxOpcode.incomeCatalogId}</TableCell>
                <TableCell>{taxOpcode.minRate}</TableCell>
                <TableCell>{taxOpcode.maxRate}</TableCell>
                <TableCell>{taxOpcode.calSoc === true ? 'Y' : taxOpcode.calSoc === false ? 'N' : ''}</TableCell>
                <TableCell>{taxOpcode.calTax === true ? 'Y' : taxOpcode.calTax === false ? 'N' : ''}</TableCell>
                <TableCell>{taxOpcode.status === 'active' ? 'Active' : taxOpcode.status === 'inactive' ? 'InActive' : ''}</TableCell>
                <TableCell>
                  {taxOpcode.status === 'active' && roleRightE && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => editTaxOpcode(taxOpcode.opcode)} disabled={!roleRightE}>
                    Edit
                  </Button>}</TableCell>
                  <TableCell>
                  {taxOpcode.status === 'active' && !roleRightE && roleRightV && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => editTaxOpcode(taxOpcode.opcode)} disabled={!roleRightV}>
                    View
                  </Button>}</TableCell>
              </TableRow>
            );
          })} */}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[10, 25, 100]}
      component="div"
      count={listTaxOpcode.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </PageBox>
);
}

export default withRouter(ListTaxOpcode);