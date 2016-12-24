import React, {Component, PropTypes} from 'react';
import {ChildContextContainerShape} from '../child-context-container';
import {getButton} from '../registry';

class SubmitButton extends Component {
  static contextTypes = {
    abstractFormState: ChildContextContainerShape.isRequired,
  };
  _onSubmit = (e) => {
    e.preventDefault();
    this.context.abstractFormState.onSubmit();
  };
  render() {
    const state = this.context.abstractFormState.getValue();
    const Button = getButton();
    return (
      <Button
        {...this.props}
        type="submit"
        disabled={this.props.disabled || state.submitting}
        form={state.id}
        onClick={this._onSubmit}
      />
    );
  }
}

export default SubmitButton;
