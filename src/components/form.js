import React, {Component, PropTypes} from 'react';
import {ChildContextContainerShape} from '../child-context-container';

class Form extends Component {
  static contextTypes = {
    abstractFormState: ChildContextContainerShape.isRequired,
  };
  _onSubmit = (e) => {
    e.preventDefault();
    this.context.abstractFormState.onSubmit();
  };
  render() {
    const state = this.context.abstractFormState.getValue();
    return <form {...this.props} id={state.id} onSubmit={this._onSubmit} />;
  }
}

export default Form;
