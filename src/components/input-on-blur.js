import React, {Component, PropTypes} from 'react';
import createFormContainer from './create-form-container';
import Input from './abstract-input';

class InputOnBlurInner extends Component {
  _onBlur = (e) => {
    if (this.props.isValid) {
      this.props.onSubmit();
    } else {
      if (this.props.onBlur) {
        this.props.onBlur();
      }
    }
  };
  render() {
    const {
      value,
      data,
      isValid,
      isSubmitting,
      onSubmit,
      ...props
    } = this.props;
    return <Input {...props} name="value" onBlur={this._onBlur} initialValue={value}/>;
  }
}
const InputOnBlur = createFormContainer(InputOnBlurInner);
class InputOnBlurContainer extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };
  _onSubmit = (data) => {
    this.props.onChange(data.value);
  };
  render() {
    const {
      onChange,
      ...props
    } = this.props;
    return <InputOnBlur {...props} onSubmit={this._onSubmit} />;
  }
}
export default InputOnBlurContainer;
