import React, {Component, PropTypes} from 'react';
import {ChildContextContainerShape} from '../child-context-container';
import {getButton} from '../registry';

class SubmitButton extends Component {
  static contextTypes = {
    abstractFormState: ChildContextContainerShape,
  };
  render() {
    const state = (
      this.context.abstractFormState
      ? this.context.abstractFormState.getValue()
      : null
    );
    const Button = getButton();
    return (
      <Button
        {...this.props}
        type="button"
        disabled={this.props.disabled || (state && state.submitting) || false}
        form={state ? state.id : undefined}
      />
    );
  }
}

export default SubmitButton;
