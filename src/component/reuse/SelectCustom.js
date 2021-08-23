
import React from 'react';
import { Col,Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import styles from './InputLabel.module.css';
import { makeStyles } from '@material-ui/core/styles';
import PropsTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export const SelectCustom = ({ label, value, onChange,listData }) => {
  
  const classes = useStyles();

    return (
        <Form>
            <FormGroup row>
                <Label className="form-group" sm={4}>{label}</Label>
                <Col sm={8}>
                <FormControl className={classes.formControl}>
        <NativeSelect
          value={value}
          onChange={onChange}
          inputProps={{
            name: 'status',
            id: 'status-native-helper',
          }}
        >
          {listData !== null && listData.map((data, index) => (
            <option value={data.value}>{data.status}</option>
          ))}
        </NativeSelect>
      </FormControl>
                </Col>
            </FormGroup>
        </Form>
    );
}

SelectCustom.defaultProps = {
    label: "",
    value: "",
    onChange: () => { },
}

SelectCustom.propsTypes = {
    label: PropsTypes.string,
    value: PropsTypes.string,
    onChange: PropsTypes.func,
}