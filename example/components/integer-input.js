import React, {Component} from 'react';

function isInteger(value) {
  if (typeof value === 'string') {
    return /^\d+$/.test(value) && isInteger(+value);
  } else if (typeof value === 'number') {
    return (value | 0) === value;
  }
  return false;
}
class IntegerInput extends Component {
  static validate(value) {
    if (!isInteger(value)) {
      return 'Please enter a valid whole number.';
    }
  }
  static normalize(value) {
    return +value;
  }
  static getInitialValue() {
    return null;
  }
  render() {
    const {type, error, value, ...props} = this.props;
    return (
      <div>
        <input {...props} value={value === null ? '' : value} type="number"/>
        {
          error
          ? <div>{error}</div>
          : null
        }
      </div>
    );
  }
}
export default IntegerInput;
