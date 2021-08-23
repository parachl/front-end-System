import React from 'react';
import {RadioGroup,FormControlLabel,Radio} from '@material-ui/core';

function RadioButton(props) {
    const { label1 , label12 ,menus } = props;
    return (
        <RadioGroup key={menus.id} aria-label="gender" name="gender" checked={this.state.selectedValue === menus.id}
            onChange={() => this.handleChange(menus.id)}
            value={this.state.selectedValue}>
            <FormControlLabel value="V" control={<Radio />} label="View Only" />
            <FormControlLabel value="AED" control={<Radio />} label="Full Control" />
        </RadioGroup>
    )

}