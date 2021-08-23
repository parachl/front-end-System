
import React from 'react';
import { Col,Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import styles from './InputLabel.module.css';
import PropsTypes from 'prop-types';

export const InputLabelReuse = ({ label, type, value, onChange }) => {

    return (
        <Form>
            <FormGroup row>
                <Label className="form-group" sm={4}>{label}</Label>
                <Col sm={8}>
                <Input className="form-group" type={type} value={value} onChange={onChange} placeholder="with a placeholder" />
                </Col>
            </FormGroup>
        </Form>
    );
}

InputLabelReuse.defaultProps = {
    label: "",
    type: "text",
    value: "",
    onChange: () => { },
}

InputLabelReuse.propsTypes = {
    label: PropsTypes.string,
    type: PropsTypes.string,
    value: PropsTypes.string,
    onChange: PropsTypes.func,
}