import React, {Component, PropTypes} from 'react';
import ChildContextContainer, {ChildContextContainerShape} from '../child-context-container';
import {validate, normalizeData} from '../utils';

let nextId = 0;
function createFormContainer(Form) {
  const {data, isValid, isSubmitting, onSubmit, ...propTypes} = Form.propTypes || {};

  class FormContainer extends Component {
    static childContextTypes = {
      abstractFormState: ChildContextContainerShape.isRequired,
    }
    static propTypes = {
      ...propTypes,
      onSubmit: PropTypes.func.isRequired,
    }

    getChildContext() {
      return {
        abstractFormState: this._context,
      };
    }

    constructor(props, context) {
      super(props, context);
      this._context = new ChildContextContainer({
        id: 'abstract_form_' + (nextId++),
        submitting: false,
        config: {},
        data: {},
        validation: {fields: {}, isValid: true},
      }, {
        setFieldValue: this._setFieldValue,
        setConfig: this._setConfig,
        deleteConfig: this._deleteConfig,
        onSubmit: this._onSubmit,
      });
      this.state = this._context.getValue();
    }
    componentDidMount() {
      this._unsubscribe = this._context.subscribe(this._updateState);
      this._updateState();
    }
    _updateState = () => {
      this.setState(this._context.getValue());
    }
    componentWillUnmount() {
      if (this._unsubscribe) {
        this._unsubscribe();
      }
    }

    _setFieldValue = (name, value) => {
      const oldState = this._context.getValue();
      const newState = {
        id: oldState.id,
        submitting: oldState.submitting,
        config: oldState.config,
        data: {
          ...oldState.data,
          [name]: value,
        },
      };
      newState.validation = validate(newState);
      this._context.setValue(newState);
    };

    _setConfig = (name, config) => {
      const oldState = this._context.getValue();
      const newState = {
        id: oldState.id,
        submitting: oldState.submitting,
        config: {
          ...oldState.config,
          [name]: config,
        },
        data: {
          ...oldState.data,
          [name]: (
            // there is no old config or the old data === the old config's initial value
            !oldState.config[name] || oldState.data[name] === oldState.config[name].initialValue
            // update to the new initialValue
            ? config.initialValue
            // leave the old value
            : oldState.data[name]
          ),
        },
      };
      newState.validation = validate(newState);
      this._context.setValue(newState);
    };

    _deleteConfig = (name) => {
      const oldState = this._context.getValue();
      const newState = {
        id: oldState.id,
        submitting: oldState.submitting,
        config: {
          ...oldState.config,
        },
        data: {
          ...oldState.data,
        },
      };
      delete newState.config[name];
      delete newState.data[name];
      newState.validation = validate(newState);
      this._context.setValue(newState);
    };

    _onSubmit = (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      const state = this._context.getValue();
      if (state.validation.isValid) {
        const result = this.props.onSubmit(normalizeData(state));
        if (
          result && (typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function'
        ) {
          this._context.setValue({
            ...state,
            submitting: true,
          });
          result.then(
            () => {
              const oldState = this._context.getValue();
              const newData = {};
              Object.keys(oldState.config).forEach(key => {
                newData[key] = oldState.config[key].initialValue;
              });
              const newState = {
                ...oldState,
                data: newData,
                submitting: false,
              };
              newState.validation = validate(newState);
              this._context.setValue(newState);
            },
            () => {
              const oldState = this._context.getValue();
              this._context.setValue({
                ...oldState,
                submitting: false,
              });
            },
          );
        }
      }
    };
    render() {
      const state = this.state;
      return (
        <Form
          {...this.props}
          data={state.data}
          isValid={state.validation.isValid}
          isSubmitting={state.submitting}
          onSubmit={this._onSubmit}
        />
      );
    }
  }
  return FormContainer;
}
export default createFormContainer;
