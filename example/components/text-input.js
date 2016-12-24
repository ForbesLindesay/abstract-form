import React, {Component} from 'react';

class TextInput extends Component {
  static getInitialValue() {
    return '';
  }
  render() {
    const {error, ...props} = this.props;
    return (
      <div>
        <input {...props}/>
        {
          error
          ? <div>{error}</div>
          : null
        }
      </div>
    );
  }
}
export default TextInput;
