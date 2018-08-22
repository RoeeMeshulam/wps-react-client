import React from 'react';

import './TextInput.css';

const TextInput = (props) => {
    return (
      <input type="text" name={props.name} placeholder={props.placeholder}>
      </input>
    )
};

export default TextInput;