import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";

const AddRequestForm = ({ onClick, onChange, value,disabled,onMinChange,onMaxChange,maxPrice,minPrice }) => {

  return (
    <StyledWrap>
      <TextField
        name="q"
        type="text"
        label="Name"
        onChange={onChange}
        value={value}
      />
      <TextField name="minPrice" label="Min price" value={minPrice} onChange={onMinChange} />
      <TextField name="maxPrice" label="Max price" value={maxPrice} onChange={onMaxChange}/>
      <Button disabled={disabled} onClick={onClick}>Add</Button>
    </StyledWrap>
  );
};

const StyledWrap  = styled.div`
 display: flex;
 flex-direction: column;
 width: 500px;
 margin: 0 auto;
`


export default AddRequestForm;
