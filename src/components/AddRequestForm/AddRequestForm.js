import React from 'react'

const AddRequestForm = ({onclick}) => {
  return (<form action="">
    <label htmlFor="q">Search</label>
    <input name="q" type="text"/>
    <button onClick={onclick}>Add</button>
  </form>)
};


export default AddRequestForm;
