import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSpinner } from '../../action/Constants.action';
import { hideSpinner } from '../../action/Constants.action';
import { AuthenService } from '../../_services/authen.service';
import { useHistory, withRouter } from 'react-router-dom';
import { PageBox, SearchBox } from '../reuse/PageBox';
import api from "../../api/GetApi";

import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
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
import DatePicker from "react-datepicker";
import SaveIcon from '@material-ui/icons/Save';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { FormGroup, Label, Col, Row, Form, Input, Container } from 'reactstrap';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import {styleButtonAdd,styleDivButton,styleButtonEdit,styleButtonDelete,styleButton,styleSelect,styleButtonCancel,front, headTable} from '../../themes/style';

import  { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import Box from '@mui/material/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ListTaxDeductDetail = () => {
  const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });
  const dispathch = useDispatch();
  const history = useHistory();

  const [year, setYear] = useState('');
  const [oldYear, setOldYear] = useState('');
  const [checkedList, setCheckedList] = useState({});
  const [listYear, setListYear] = useState([]);
  const classes = useRowStyles();
  const [roleRightA, setRoleRightA] = useState(false);
  const [roleRightE, setRoleRightE] = useState(false);
  const [roleRightD, setRoleRightD] = useState(false);
  const [roleRightV, setRoleRightV] = useState(false);
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const current = new Date();
  let currentYear = current.getFullYear();
  let current_datetime_n = new Date();
  let formatted_date = appendLeadingZeroes((current_datetime_n.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime_n.getDate()) + "-" + current_datetime_n.getFullYear();
  const [listTaxDeductDetail, setListTaxDeductDetail] = useState([]);
  const [listTaxDeduct, setListTaxDeduct] = useState([]);
  const [updateTime, setUpdateTime] = useState('');
  const [updateUser, setUpdateUser] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  let rowsTaxDeduct = [{}];

  //  param add
  const [taxDeductId, setTaxDeductId] = useState('');
  const [taxDeductName, setTaxDeductName] = useState('');
  const [taxMaxAmt, setTaxMaxAmt] = useState('');
  const [taxMinAmt, setTaxMinAmt] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [taxExcess, setTaxExcess] = useState('');

  const [action,setAction] = useState('');
  const [active,setActive] = useState(false);

  const [dupEffective,setOpenModelDupEffective] = useState(false);
  function appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n
  }

  const fetcData = async (year) => {
    setListTaxDeductDetail([]);
    setActive(false);
    let findYear = '';
    if (year === '') {
      findYear = currentYear + 543;
      console.log("fetcData year 0",year);
    } else {
      findYear = year;
    }
    console.log("fetcData year",findYear);
    setOldYear(findYear);
    const { status, data } = await AuthenService.callApi("GET").get("/taxDeductDetail/findById?year=" + findYear);
    if (status === 200) {
      console.log("fetcData data",data);
      if (data.listTaxDeductDetailObj !== undefined && data.listTaxDeductDetailObj.length > 0) {
        let rowsTaxDeductDetail = [];
        for (let i = 0; i < data.listTaxDeductDetailObj.length; i++) {
          let current_datetime = new Date(data.listTaxDeductDetailObj[i].createTime);
          let formatted_date = appendLeadingZeroes((current_datetime.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime.getDate()) + "-" + current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
          let formatted_date_u = '';
          if (data.listTaxDeductDetailObj[i].updateDate != null) {
            let current_datetime_u = new Date(data.listTaxDeductDetailObj[i].updateTime);
            formatted_date_u = appendLeadingZeroes((current_datetime_u.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime_u.getDate()) + "-" + current_datetime_u.getFullYear() + " " + current_datetime_u.getHours() + ":" + current_datetime_u.getMinutes() + ":" + current_datetime_u.getSeconds();
          }
          let effective_date = new Date(data.effectiveDate);
          let formatted_date_e = appendLeadingZeroes((effective_date.getMonth() + 1)) + "-" + appendLeadingZeroes(effective_date.getDate()) + "-" + effective_date.getFullYear();

          rowsTaxDeductDetail[i] = { year: data.listTaxDeductDetailObj[i].year, name: data.listTaxDeductDetailObj[i].taxDeductObj.name, taxDeductId: data.listTaxDeductDetailObj[i].taxDeductId, maxAmt: data.listTaxDeductDetailObj[i].maxAmt, minAmt: data.listTaxDeductDetailObj[i].minAmt, rate: data.listTaxDeductDetailObj[i].rate, excess: data.listTaxDeductDetailObj[i].excess, createUser: data.listTaxDeductDetailObj[i].createUser, createTime: formatted_date, updateTime: formatted_date_u, updateUser: data.listTaxDeductDetailObj[i].updateUser, effectiveDate: formatted_date_e }
          //   listCheckBox[i] = { isChecked: false, taxDeductId: data.listTaxDeductObj[i].taxDeductId };
        }
        if (rowsTaxDeductDetail[0].updateTime === '') {
          setUpdateTime(formatted_date);
          setUpdateUser(user.name);
        } else {
          setUpdateTime(rowsTaxDeductDetail[0].formatted_date_u);
          setUpdateUser(rowsTaxDeductDetail[0].updateUser);
        }
        setEffectiveDate(data.listTaxDeductDetailObj[0].effectiveDate);
        setListTaxDeductDetail(rowsTaxDeductDetail);
      } else {
        setUpdateTime(formatted_date);
        setUpdateUser(user.name);
      }
    } else {
      alert('error');
    }
  }


  const fetcDataDeduct = async () => {
    const { status, data } = await AuthenService.callApi("GET").get("/taxDeduct/listTaxDeduct");

    if (status === 200) {
      if (data.listTaxDeductObj !== undefined && data.listTaxDeductObj.length > 0) {
        for (let i = 0; i < data.listTaxDeductObj.length; i++) {
          let current_datetime = new Date(data.listTaxDeductObj[i].createTime);
          let formatted_date = appendLeadingZeroes((current_datetime.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime.getDate()) + "-" + current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
          let formatted_date_u = '';
          if (data.listTaxDeductObj[i].updateDate != null) {
            let current_datetime_u = new Date(data.listTaxDeductObj[i].updateTime);
            formatted_date_u = appendLeadingZeroes((current_datetime_u.getMonth() + 1)) + "-" + appendLeadingZeroes(current_datetime_u.getDate()) + "-" + current_datetime_u.getFullYear() + " " + current_datetime_u.getHours() + ":" + current_datetime_u.getMinutes() + ":" + current_datetime_u.getSeconds();
          }
          rowsTaxDeduct[i] = { show: data.listTaxDeductObj[i].name, value: data.listTaxDeductObj[i].taxDeductId, taxDeductId: data.listTaxDeductObj[i].taxDeductId, name: data.listTaxDeductObj[i].name, description: data.listTaxDeductObj[i].description, descriptionTh: data.listTaxDeductObj[i].descriptionTh, createUser: data.listTaxDeductObj[i].createUser, createTime: formatted_date, updateTime: formatted_date_u, updateUser: data.listTaxDeductObj[i].updateUser }
        }
        setTaxDeductId(rowsTaxDeduct[0].taxDeductId);
        setTaxDeductName(rowsTaxDeduct[0].name);
        setListTaxDeduct(rowsTaxDeduct);
      }
    } else {
      alert('error');
    }
  }

  const formatToCurrency = amount => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  const handleChangeYear = (event) => {
    if (active) {
      handleOpenYaer();
      setYear(event);
    } else {
      setYear(event);
      fetcData(event);
    }
  };
  const modelYearConfirm = () => {
    setYear(year);
    fetcData(year);
    setOpenModelYaer(false);
  }


  const handleChangeDeduct = (event) => {
    setTaxDeductId(event);
    var index = listTaxDeduct.findIndex((x) => x.taxDeductId === event);
    if (index !== -1) {
      let g = listTaxDeduct[index];
      setTaxDeductName(g.name);
    }
  };

  useEffect(() => {
    const result = AuthenService.checkPermission('Tax Deduct Detail', 'L');

    if (!result) {
      history.push("/main");
    }
    const roleRight = AuthenService.checkRoleRight('Tax Deduct Detail');
    if (roleRight.indexOf('A') !== -1) {
      setRoleRightA(true);
    }
    if (roleRight.indexOf('E') !== -1) {
      setRoleRightE(true);
    }
    if (roleRight.indexOf('D') !== -1) {
      setRoleRightD(true);
    }
    if (roleRight.indexOf('V') !== -1) {
      setRoleRightV(true);
    }
    getListYear();
    fetcData(year);
    fetcDataDeduct();
  }, []);

  const editTaxDeduct = (taxDeductId) => {
    console.log('taxDeductId >', taxDeductId);
    history.push("/editTaxDeduct", { taxDeductId: taxDeductId });
  }

  const getListYear = () => {
    let listYears = [];
    let arrayYear = {};
    for (let i = 2550; i <= currentYear + 544; i++) {
      arrayYear = { show: i, value: i };
      listYears.push(arrayYear);
    }
    setYear(currentYear + 543);
    setListYear(listYears);
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

  //-------------------------------------- header table ------------------------------------------------------

const headCells = [
  {
    id: 'taxDeductId',
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
    id: 'minAmt',
    numeric: false,
    disablePadding: false,
    align: "center",
    label: 'ต่ำสุดไม่น้อยกว่า (TH)',
  },
  {
    id: 'maxAmt',
    numeric: false,
    disablePadding: false,
    align: "center",
    label: 'สูงสุดไม่มากกว่า',
  },
  {
    id: 'rate',
    numeric: false,
    disablePadding: false,
    align: "center",
    label: 'ไม่เกินร้อยละของเงินได้',
  },
  {
    id: 'excess',
    numeric: false,
    disablePadding: false,
    align: "center",
    label: 'ส่วนที่ได้เกินจาก',
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

function EnhancedTableHead(props) {
  const {  order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead >
      <TableRow >
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
  const [orderBy, setOrderBy] = React.useState('taxDeductId');

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listTaxDeductDetail.map((n) => n.name);
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

  const addTaxDeduct = () => {
    history.push("/addTaxDeduct");
  }

  const submitAddTaxDeductDetail = (year, taxDeductId, taxDeductName, taxMaxAmt, taxMinAmt, taxRate, taxExcess,action) => {
    console.log("submitAddTaxDeductDetail taxDeductId", taxDeductId);
    const taxDeductDetailObj = { year: year, taxDeductId:taxDeductId, name: taxDeductName, maxAmt: taxMaxAmt, minAmt: taxMinAmt, rate: taxRate, excess: taxExcess };
    if(action === 'add'){
      if (taxDeductDetailObj.year === '' || taxDeductDetailObj.taxDeductId === '' || taxDeductDetailObj.name === '' || taxDeductDetailObj.maxAmt === '' || taxDeductDetailObj.minAmt === '') {
        
        alert('Please fill in all required fields.');
      } else {
        var index = listTaxDeductDetail.findIndex((x) => x.taxDeductId === taxDeductDetailObj.taxDeductId);
        if (index !== -1) {
          alert('Duplication Deduct.');
        }else{
          setListTaxDeductDetail([...listTaxDeductDetail.slice(0, listTaxDeductDetail.length), taxDeductDetailObj]);
        }
      }
    }else{
      if (taxDeductDetailObj.year === '' || taxDeductDetailObj.taxDeductId === '' || taxDeductDetailObj.name === '' || taxDeductDetailObj.maxAmt === '' || taxDeductDetailObj.minAmt === '') {
        alert('Please fill in all required fields.');
      } else {
        var index = listTaxDeductDetail.findIndex((x) => x.taxDeductId === taxDeductId);
        if (index !== -1) {
          let g = listTaxDeductDetail[index];
          g.name = taxDeductDetailObj.name;
          g.taxDeductId = taxDeductDetailObj.taxDeductId;
          g.maxAmt = taxDeductDetailObj.maxAmt;
          g.minAmt = taxDeductDetailObj.minAmt;
          g.rate = taxDeductDetailObj.rate;
          g.excess = taxDeductDetailObj.excess;
          setListTaxDeductDetail([...listTaxDeductDetail.slice(0, index), g, ...listTaxDeductDetail.slice(index + 1)]);
          setTaxDeductName('');
          setTaxMaxAmt('');
          setTaxMinAmt('');
          setTaxRate('');
          setTaxExcess('');
        }
        
      }
    }
    
    
   
    setActive(true);
    setOpen(false);
  }

  const findDataMoreCurrentDate = async (effectiveDate) => {
    if (effectiveDate !== '' && listTaxDeductDetail.length > 0 && active) {

      console.log("submitTaxDeductDetail taxDeductDetailObjC", year);
      const { status, data } = await AuthenService.callApi("POST").post("/taxDeductDetail/findDataMoreCurrentDate?year=" + year);
      console.log('data', data);
      if (data === 'success') {
        submitTaxDeductDetail(effectiveDate);
      } else if (data === 'fail') {
        handleOpenMessageDupEffective();
      }
    } else {
      alert('Please fill in all required fields.');
    }
  }


  const submitTaxDeductDetail = async (effectiveDate) => {
    console.log();
    if (effectiveDate !== '' && listTaxDeductDetail.length > 0 && active) {
      let listTaxDeductDetailObj = [];
      let taxDeductDetailObjC = {};
      for (let j = 0; j < listTaxDeductDetail.length; j++) {
        const taxDeductDetailObj = { year: listTaxDeductDetail[j].year, taxDeductId: listTaxDeductDetail[j].taxDeductId, maxAmt: listTaxDeductDetail[j].maxAmt, minAmt: listTaxDeductDetail[j].minAmt, rate: listTaxDeductDetail[j].rate, excess: listTaxDeductDetail[j].excess, effectiveDate: effectiveDate };
        listTaxDeductDetailObj.push(taxDeductDetailObj);
      }
      taxDeductDetailObjC = { listTaxDeductDetailObj };

      console.log("submitTaxDeductDetail taxDeductDetailObjC", taxDeductDetailObjC);
      const { status, data } = await AuthenService.callApi("POST").post("/taxDeductDetail/addTaxDeductDetail", taxDeductDetailObjC);
      console.log('data', data);
      if (data === 'success') {
        fetcData(year);
        alert('Success');
      } else if (data === 'duplicate') {
        console.log('data', data);
        alert('Data Duplicate');
      }
    } else {
      alert('Please fill in all required fields.');
    }
    handleMessageDupEffectiveClose();
  }

  const handleOpenMessageDupEffective = () => {
    setOpenModelDupEffective(true);
  };

  const handleMessageDupEffectiveClose = () => {
    setOpenModelDupEffective(false);
  };

  const deleteTaxDeduct = (taxDeductId) => {
    var index = listTaxDeductDetail.findIndex((x) => x.taxDeductId === taxDeductId);
    console.log('index delete >>', index);
    if (index !== -1) {
      let g = listTaxDeductDetail[index];
      setListTaxDeductDetail([...listTaxDeductDetail.slice(0, index), ...listTaxDeductDetail.slice(index + 1, 1), ...listTaxDeductDetail.slice(index + 1)]);
    }
    setOpen(false);
    setTaxDeductId(listTaxDeduct[0].taxDeductId);
    setTaxDeductName('');
    setTaxMaxAmt('');
    setTaxMinAmt('');
    setTaxRate('');
    setTaxExcess('');
    setActive(true);
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

  const [open, setOpen] = React.useState(false);
  const [openModelYaer, setOpenModelYaer] = React.useState(false);


  const handleClickOpen = (action,taxDeductId) => {
    setOpen(true);
    setAction(action);
    console.log('handleClickOpen taxDeductId >>', taxDeductId);
    if (action === 'add') {
      var index = listTaxDeduct.findIndex((x) => x.taxDeductId === taxDeductId);
      console.log('handleClickOpen index >>', index);
      if (index !== -1) {
        let g = listTaxDeduct[index];
        setTaxDeductName(g.name);
      }
    } else {
      var index = listTaxDeductDetail.findIndex((x) => x.taxDeductId === taxDeductId);
      console.log('index delete >>', index);
      if (index !== -1) {
        let g = listTaxDeductDetail[index];
        setTaxDeductId(g.taxDeductId);
        setTaxDeductName(g.name);
        setTaxMaxAmt(g.maxAmt);
        setTaxMinAmt(g.minAmt);
        setTaxRate(g.rate);
        setTaxExcess(g.excess);
      }
    }

  };

  const handleEffectiveDate = (date) => {
    setEffectiveDate(date);
    setActive(true);
  };

  const handleOpenYaer = () => {
    setOpenModelYaer(true);
  };

  const handleOpenYaerClose = () => {
    setYear(oldYear);
    setOpenModelYaer(false);
  };

  const handleClose = () => {
    setOpen(false);
    if (listTaxDeduct !== 'undefined') {
      setTaxDeductId(listTaxDeduct[0].taxDeductId);
    } else {
      setTaxDeductId('');
    }
    setTaxDeductName('');
    setTaxMaxAmt('');
    setTaxMinAmt('');
    setTaxRate('');
    setTaxExcess('');
  };

  return (
    <PageBox style={{ marginBotton: 50 }}>
      <div>
                  <Dialog
                    open={dupEffective}
                    onClose={handleMessageDupEffectiveClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">{"เนื่องจากมีการกรอกข้อมูลโดยมีวันที่มีผลถูกกำหนดล่วงหน้าแล้ว หากต้องการจะบันทึกทับข้อมูลเดิม กรุณากด 'บันทึก' "}</DialogTitle>
                    <DialogActions>
                      <Button onClick={handleMessageDupEffectiveClose} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={() => submitTaxDeductDetail(effectiveDate)} color="primary" autoFocus>
                        OK
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
      <div><tableRow style={{ width: 1080, fontSize: 32, padding: 10 }}>รายละเอียดกลุ่มลดหย่อนภาษี </tableRow></div>
      {/* <TableContainer className={classes.container} style={{ height: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead> */}
            <TableRow>
              <TableCell align="right"><SelectCustom label="ปีภาษี :" value={year} listData={listYear}
                onChange={(e) => {
                  handleChangeYear(e.target.value);
                }} style={{ width: 180 }} /></TableCell>
              <TableCell>
                <ThemeProvider>
                  <Button variant="contained" startIcon={<SaveIcon />} style={styleButtonAdd} onClick={() => handleClickOpen('add',taxDeductId)} disabled={!roleRightA}>
                    Add
                  </Button>
                  <div>
                    <Dialog
                      open={open}
                      TransitionComponent={Transition}
                      maxWidth="xl"
                      keepMounted
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-slide-title"
                      aria-describedby="alert-dialog-slide-description"
                    >
                      <DialogTitle id="alert-dialog-slide-title">{"เพิ่มรายการลดหย่อน"}</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                          <TableRow>
                            <FormGroup style={{ width: 1080, padding: 15 }}>
                              <Container>
                                <Row >
                                  <Col>
                                    <FormGroup row>
                                      <Label className="form-group" sm={3}>ปีภาษี</Label>
                                      <Col sm={5}>
                                        <FormControl className={classes.formControl}>
                                          <Label className="form-group">{year}</Label>
                                        </FormControl>
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row >
                                  <Col>
                                    <FormGroup row>
                                      <Label className="form-group" sm={5}>รหัส :</Label>
                                      <Col sm={5}>
                                        <FormControl className={classes.formControl}>
                                          <Input className="form-group" type="text" value={taxDeductId} onChange={(e) => {
                                            setTaxDeductId(e.target.value);
                                          }} placeholder="with a placeholder" disabled />
                                        </FormControl>
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                  <Col sm={6}></Col>
                                </Row>
                                <Row>
                                  <Col>
                                    <FormGroup row>
                                      <Label className="form-group" sm={5}>รายการลดหย่อน :</Label>
                                      <Col sm={5} style={styleSelect}>
                                        <Form style={{ width: 280 }}>
                                          <FormGroup row>
                                            <FormControl className={classes.formControl}>
                                              <NativeSelect
                                                value={taxDeductId}
                                                onChange={(e) => {
                                                  handleChangeDeduct(e.target.value);
                                                }}
                                                inputProps={{
                                                  name: 'deduct',
                                                  id: 'deduct-native-helper',
                                                }}
                                                style={{ width: 280 }}>
                                                {listTaxDeduct !== null && listTaxDeduct.map((data, index) => (
                                                  <option value={data.value}>{data.show}</option>
                                                ))}
                                              </NativeSelect>
                                            </FormControl>
                                          </FormGroup>
                                        </Form>
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                  <Col sm={6}></Col>
                                </Row>
                                <Row >
                                  <Col>
                                    <FormGroup row>
                                      <Label className="form-group" sm={5}>ต่ำสุดไม่น้อยกว่า :</Label>
                                      <Col sm={5}>
                                        <FormControl className={classes.formControl}>
                                          <Input className="form-group" type="text" value={taxMinAmt} onChange={(e) => {
                                            setTaxMinAmt(e.target.value);
                                          }} placeholder="with a placeholder" />
                                        </FormControl>
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                  <Col>
                                    <FormGroup row>
                                      <Label className="form-group" sm={5}>สูงสุดไม่มากกว่า :</Label>
                                      <Col sm={5}>
                                        <FormControl className={classes.formControl}>
                                          <Input className="form-group" type="text" value={taxMaxAmt} onChange={(e) => {
                                            setTaxMaxAmt(e.target.value);
                                          }} placeholder="with a placeholder" />
                                        </FormControl>
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row >
                                  <Col>
                                    <FormGroup row>
                                      <Label className="form-group" sm={5}>ไม่เกินร้อยละของเงินได้ :</Label>
                                      <Col sm={5}>
                                        <FormControl className={classes.formControl}>
                                          <Input className="form-group" type="text" value={taxRate} onChange={(e) => {
                                            setTaxRate(e.target.value);
                                          }} placeholder="with a placeholder" />
                                        </FormControl>
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                  <Col>
                                    <FormGroup row>
                                      <Label className="form-group" sm={5}>ส่วนที่ได้เกินจาก :</Label>
                                      <Col sm={5}>
                                        <FormControl className={classes.formControl}>
                                          <Input className="form-group" type="text" value={taxExcess} onChange={(e) => {
                                            setTaxExcess(e.target.value);
                                          }} placeholder="with a placeholder" />
                                        </FormControl>
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Container>
                            </FormGroup>
                          </TableRow>
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button variant="contained" style={styleButtonCancel} onClick={() => deleteTaxDeduct(taxDeductId)}>
                          Delete
                        </Button>
                        <Button variant="contained" style={styleButtonCancel} onClick={() => handleClose()}>
                          Cancel
                        </Button>
                        <Button variant="contained" color="primary" style={styleButton} onClick={() => submitAddTaxDeductDetail(year, taxDeductId, taxDeductName, taxMaxAmt, taxMinAmt, taxRate, taxExcess,action)}>
                          Submit
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                </ThemeProvider>
                <div>
                  <Dialog
                    open={openModelYaer}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">{"หากคุณเปลี่ยน พ.ศ รายการที่ทำไว้จะถูกเคลียร์ ต้องการจะเปลี่ยน พ.ศ หรือไม่ ?"}</DialogTitle>
                    <DialogActions>
                      <Button onClick={handleOpenYaerClose} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={modelYearConfirm} color="primary" autoFocus>
                        OK
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
            <TableContainer className={classes.container} style={{ height: 600 }}>
        <Table style={{ border: '1px solid #D3D3D3' }} stickyHeader aria-label="sticky table" >
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={listTaxDeductDetail.length}
          />
            {/* <TableRow>
              <TableCell style={{ width: 320, fontSize: 18 }}>
                <p>รหัส</p>
              </TableCell>
              <TableCell style={{ width: 320, fontSize: 18 }}>
                <p>รายการลดหย่อน</p>
              </TableCell>
              <TableCell style={{ width: 320, fontSize: 18 }}>
                <p>ต่ำสุดไม่น้อยกว่า (TH)</p>
              </TableCell>
              <TableCell style={{ width: 320, fontSize: 18 }}>
                <p>สูงสุดไม่มากกว่า</p>
              </TableCell>
              <TableCell style={{ width: 320, fontSize: 18 }}>
                <p>ไม่เกินร้อยละของเงินได้</p>
              </TableCell>
              <TableCell style={{ width: 320, fontSize: 18 }}>
                <p>ส่วนที่ได้เกินจาก</p>
              </TableCell>
              <TableCell>
              </TableCell>
              {!roleRightE && roleRightV && <TableCell style={{ width: 320, fontSize: 18 }}>
              </TableCell>}
              <TableCell>
              </TableCell>
            </TableRow>
          </TableHead> */}
          <TableBody>
          {stableSort(listTaxDeductDetail, getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((TaxDeductDetail, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <StyledTableRow>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row" style={front}>
                      {TaxDeductDetail.taxDeductId}
                    </TableCell>
                  <TableCell>{TaxDeductDetail.name}</TableCell>
                  <TableCell>{TaxDeductDetail.minAmt}</TableCell>
                  <TableCell>{TaxDeductDetail.maxAmt}</TableCell>
                  <TableCell>{TaxDeductDetail.rate}</TableCell>
                  <TableCell>{TaxDeductDetail.excess}</TableCell>
                  <TableCell>
                    {roleRightE && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => handleClickOpen('edit',TaxDeductDetail.taxDeductId)} disabled={!roleRightE}>
                      Edit
                    </Button>}</TableCell>
                  <TableCell>
                    {!roleRightE && roleRightV && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => editTaxDeduct(TaxDeductDetail.taxDeductId)} disabled={!roleRightV}>
                      View
                    </Button>}</TableCell>
                  </StyledTableRow>);
              })}
            {/* {listTaxDeductDetail.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((TaxDeductDetail, index) => {
              return (
                <TableRow tabIndex={-1} key={TaxDeductDetail.taxDeductId}>
                  <TableCell>{TaxDeductDetail.taxDeductId}</TableCell>
                  <TableCell>{TaxDeductDetail.name}</TableCell>
                  <TableCell>{TaxDeductDetail.minAmt}</TableCell>
                  <TableCell>{TaxDeductDetail.maxAmt}</TableCell>
                  <TableCell>{TaxDeductDetail.rate}</TableCell>
                  <TableCell>{TaxDeductDetail.excess}</TableCell>
                  <TableCell>
                    {roleRightE && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => handleClickOpen('edit',TaxDeductDetail.taxDeductId)} disabled={!roleRightE}>
                      Edit
                    </Button>}</TableCell>
                  <TableCell>
                    {!roleRightE && roleRightV && <Button variant="contained" color="primary" style={styleButtonEdit} onClick={() => editTaxDeduct(TaxDeductDetail.taxDeductId)} disabled={!roleRightV}>
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
                {/* </TableRow>
              );
            })} */}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={listTaxDeductDetail.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <div>
        <FormGroup>
          <Container>
            <Row>
              <Col>
                <FormGroup row>
                  <Label className="form-group" sm={4}>วันที่มีผล  :</Label>
                  <Col sm={6}>
                    <FormControl className={classes.formControl}>
                      <DatePicker selected={effectiveDate} onChange={(date) => handleEffectiveDate(date)} />
                    </FormControl>
                  </Col>
                </FormGroup>
              </Col>
              <Col sm={6}>
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
                      <Label className="form-group" sm={4}>{updateTime}</Label>
                    </FormControl>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
          </Container>
        </FormGroup>
        <div style={styleDivButton}>
          <Button variant="contained" style={styleButtonCancel} onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" style={styleButton} onClick={() => findDataMoreCurrentDate(effectiveDate)}>
            Submit
          </Button>
        </div>
      </div>
    </PageBox>
  );
}

export default withRouter(ListTaxDeductDetail);