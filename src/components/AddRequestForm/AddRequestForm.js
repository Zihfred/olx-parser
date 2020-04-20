import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";

const AddRequestForm = ({ onClick, onChange, value,disabled,onMinChange,onMaxChange,maxPrice,minPrice }) => {

  return (
    <StyledWrap>
      <StyledInput
        variant="outlined"
        name="q"
        type="text"
        label="Name"
        onChange={onChange}
        value={value}
      />
      <StyledInput variant="outlined" name="minPrice" label="Min price" value={minPrice} onChange={onMinChange} />
      <StyledInput variant="outlined" name="maxPrice" label="Max price" value={maxPrice} onChange={onMaxChange}/>
      <StyledButton disabled={!(!disabled && value)} variant="outlined" onClick={onClick}>Add</StyledButton>
    </StyledWrap>
  );
};

const StyledInput = styled(TextField)`
margin: 10px;
`

const StyledButton = styled(Button)`
margin: 10px;
`

const StyledWrap  = styled.div`
 display: flex;
 flex-direction: column;
 width: 500px;
 margin: 0 auto;
`


export default AddRequestForm;
