import React, { useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import styled from "styled-components";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const Rows = (props) => {
    const useRowStyles = makeStyles({
        root: {
            '& > *': {
                borderBottom: 'unset',
            },
        },
    });
    const { menu } = props;
    const { listGroupRoleMenu } = props;
    // const  open  = props.isOpen;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
    //Radio Action
    const [value, setValue] = useState('AED');
    const [isChecked, setIsChecked] = useState({});
    const [listCheckedMenu, setCheckedMenu] = useState([]);
    const [listRoleMenu, setListRoleMenu] = useState([]);
    // const [listGroupRoleMenu, setListGroupRoleMenu] = useState([]);
    console.log('is props', props);
    console.log('is menu', menu);
    useEffect(() => {
        console.log('4');
        // setListGroupRoleMenu(props.listGroupRoleMenu);
        // setList(listGroupRoleMenus);
        initRow(menu, props.listGroupRoleMenu);

    }, []);

    // function setList(listGroupRoleMenus) {
    //     console.log('is listGroupRoleMenus', listGroupRoleMenus);
    //     setListGroupRoleMenu(listGroupRoleMenus);
    // }

    function initRow(menu, listGroupRoleMenu) {
        console.log('listGroupRoleMenu initRow', listGroupRoleMenu);
        // console.log('listGroupRoleMenu initRow', listGroupRoleMenu);
        if (listGroupRoleMenu.length > 0) {
            const objRoleArray = [];
            const objCheckedArray = [];
            var index = listGroupRoleMenu.findIndex((x) => x.id === menu.id);
            setIsChecked(listGroupRoleMenu[index].isChecked);
            // setOpen(listGroupRoleMenu[index].isChecked);
            if (listGroupRoleMenu[index].isChecked === true) {
                if (listGroupRoleMenu[index].listRoleMenu > 0) {
                    setListRoleMenu(listGroupRoleMenu[index].listRoleMenu);
                    setCheckedMenu(listGroupRoleMenu[index].listCheckedMenu);
                } else if (menu.listMenu !== null && menu.listMenu.length > 0) {
                    for (let i = 0; i < menu.listMenu.length; i++) {
                        objRoleArray.push({ menuId: menu.listMenu[i].id, roleId: '', roleRight: 'AED' });
                        objCheckedArray.push({ isChecked: true, id: menu.listMenu[i].id });
                    }
                    setListRoleMenu(objRoleArray);
                    setCheckedMenu(objCheckedArray);
                }
            }
        }
    }

    function setChecked() {
        var index = listGroupRoleMenu.findIndex((x) => x.id === menu.id);
        console.log('isChecked', listGroupRoleMenu[index].isChecked);
        setIsChecked(listGroupRoleMenu[index].isChecked);
    }

    const changeCheckBoxGroupMenu = (event, menu) => {

        var index = listGroupRoleMenu.findIndex((x) => x.id === menu.id);

        let g = listGroupRoleMenu[index];
        if (g["isChecked"] === true) {
            g["isChecked"] = false;
        } else {
            g["isChecked"] = true;
        }
        // listGroupRoleMenu = [...listGroupRoleMenu.slice(0, index), g, ...listGroupRoleMenu.slice(index + 1)];
        props.setListGroup([...listGroupRoleMenu.slice(0, index), g, ...listGroupRoleMenu.slice(index + 1)]);
        // setListRoleMenu([...listRoleMenu, { menuObj: {}, roleObj: {}, roleRight: 'AED' }]);
        setChecked();

    }

    function getRoleRight(menu) {
        if (listRoleMenu.length > 0) {
            var index = listRoleMenu.findIndex((x) => x.menuId === menu.id);
            return listRoleMenu[index].roleRight;
        }
    }

    const handleChange = (event, param) => {
        var index = listRoleMenu.findIndex((x) => x.menuId === param.id);
        setValue(event.target.value);
        if (index === -1) {
            setListRoleMenu([...listRoleMenu, { menuId: param.id, roleId: '', roleRight: event.target.value }]);
        } else {
            let g = listRoleMenu[index];
            g["roleRight"] = event.target.value;
            setListRoleMenu([...listRoleMenu.slice(0, index), g, ...listRoleMenu.slice(index + 1)]);
        }
    };

    const deleteRoleMenu = (id) => {
        var index = listRoleMenu.findIndex((x) => x.menuId === id);
        if (index !== -1) {
            let g = listRoleMenu[index];
            g["roleRight"] = "D";
            setListRoleMenu([...listRoleMenu.slice(0, index), g, ...listRoleMenu.slice(index + 1)]);
        }
        console.log('deleteRoleMenu', listRoleMenu);
    }

    const defaltRoleMenu = (id) => {
        var index = listRoleMenu.findIndex((x) => x.menuId === id);
        if (index !== -1) {
            let g = listRoleMenu[index];
            g["roleRight"] = "AED";
            setListRoleMenu([...listRoleMenu.slice(0, index), g, ...listRoleMenu.slice(index + 1)]);
        }
        console.log('defaltRoleMenu', listRoleMenu);
    }

    const handleChangeMenu = (event, menu) => {
        console.log('handleChangeMenu', menu);
        var index = listCheckedMenu.findIndex((x) => x.id === menu.id);
        if (index !== -1) {
            let g = listCheckedMenu[index];
            if (g["isChecked"] === true) {
                g["isChecked"] = false;
                deleteRoleMenu(menu.id);
            } else {
                g["isChecked"] = true;
                defaltRoleMenu(menu.id);
            }
            setCheckedMenu([...listCheckedMenu.slice(0, index), g, ...listCheckedMenu.slice(index + 1)]);
        }

    };

    function getCheckedMenu(menu) {
        if (listCheckedMenu.length > 0) {
            var index = listCheckedMenu.findIndex((x) => x.id === menu.id);
            return listCheckedMenu[index].isChecked;
        }
    }

    // function updateListRoleMenuAdd() {
    //     // initSetOpen()
    //     console.log('listRoleMenu update', listRoleMenu);
    //     if (listRoleMenu.length > 0) {
    //         listRoleMenuAdd = listRoleMenu;
    //         // setListRoleMenuAdd(listRoleMenu);
    //     }
    // }


    // console.log('listGroupRoleMenu >', listGroupRoleMenu);
    const updateListRoleMenuAdd = () => {
        console.log('Get in updateListRoleMenuAdd');
        var index = listGroupRoleMenu.findIndex((x) => x.id === menu.id);
        if (index !== -1) {
            let g = listGroupRoleMenu[index];
            g["listRoleMenu"] = listRoleMenu;
            g["listCheckedMenu"] = listCheckedMenu;

            // listGroupRoleMenu = [...listGroupRoleMenu.slice(0, index), g, ...listGroupRoleMenu.slice(index + 1)]

            // setListGroupRoleMenu([...listGroupRoleMenu.slice(0, index), g, ...listGroupRoleMenu.slice(index + 1)]);
            // listGroupRoleMenu[index].listRoleMenu = listRoleMenu;
            // listGroupRoleMenu[index].listCheckedMenu = listCheckedMenu;
            // listRoleMenuAdd.push(listRoleMenu)
            // setListRoleMenuAdd(listRoleMenu);
            // listRoleMenuAdd = listRoleMenu;
            // setListRoleMenuAdd(listRoleMenu);
        }

    }
    updateListRoleMenuAdd();
    // console.log('listRoleMenuAdd', listRoleMenuAdd);
    // 

    const [checkedMenuAll, setCheckedMenuAll] = useState({});
    const handleChangeMenuAll = (event) => {
        setCheckedMenuAll({ check: event.target.checked });
    };

    console.log('6', listRoleMenu);
    const name = 'selectedOption';

    return (
        <React.Fragment>
            <TableRow className={classes.root} ><TableCell style={{ width: 50 }}><Checkbox
                defaultChecked
                color="primary" checked={isChecked}
                onChange={(e) => changeCheckBoxGroupMenu(e, menu)}
                inputProps={{ 'aria-label': 'secondary checkbox' }}
            /></TableCell>
                <TableCell style={{ width: 150 }}>
                    {menu.listMenu !== null && menu.listMenu.length > 0 && <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} disabled={!isChecked}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>}
                </TableCell>
                <TableCell style={{ fontSize: 18 }}>{menu.groupMenuName}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell ><Checkbox
                                            defaultChecked
                                            color="primary" checked={checkedMenuAll}
                                            onChange={(e) => handleChangeMenuAll(e)}
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        /></TableCell>
                                        <TableCell> MenuName </TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                {menu.listMenu !== null && menu.listMenu.map((menus, index) => (
                                    <TableBody>
                                        <TableCell>
                                            <Checkbox
                                                defaultChecked
                                                color="primary" checked={getCheckedMenu(menus)}
                                                onChange={(e) => handleChangeMenu(e, menus)}
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            /></TableCell>
                                        <TableCell>{menus.menuName}</TableCell>
                                        <TableCell>
                                            <React.Fragment>
                                                <RadioGroup key={index} id={name} name={name} value={getRoleRight(menus)} onChange={(event) => handleChange(event, menus, index)}>
                                                    <FormControlLabel value="V" control={<Radio />} disabled={!getCheckedMenu(menus)} label="View Only" />
                                                    <FormControlLabel value="AED" control={<Radio />} disabled={!getCheckedMenu(menus)} label="Full Control" />
                                                </RadioGroup>
                                            </React.Fragment>
                                        </TableCell>
                                    </TableBody>
                                ))}
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


export default Rows;