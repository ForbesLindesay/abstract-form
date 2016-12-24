import React, {Component, PropTypes} from 'react';
import shallowequal from 'shallowequal';
import {ChildContextContainerShape} from '../child-context-container';
import {getInput} from '../registry';

function getFieldConfig(props) {
  const {type, name, required, onValidate} = props;
  const Component = getInput(type);
  return {
    Component,
    props,
  };
}
function ignoreFunctions(a, b) {
  if (typeof a === 'function' && typeof b === 'function') {
    return true;
  }
}
class AbstractInput extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  };
  static contextTypes = {
    abstractFormState: ChildContextContainerShape.isRequired,
  };
  constructor(props, context) {
    super(props, context);
    this._fieldConfig = getFieldConfig(this._proxyMethods(props));
    this.context.abstractFormState.setConfig(this.props.name, this._fieldConfig);
    this.context.abstractFormState.setFieldValue(
      this.props.name,
      this.props.initialValue !== undefined
      ? this.props.initialValue
      : (
        this._fieldConfig.Component.getInitialValue
        ? this._fieldConfig.Component.getInitialValue()
        : undefined
      )
    );
    this.state = this._calculateState();
  }
  componentDidMount() {
    this._unsubscribe = this.context.abstractFormState.subscribe(this._onUpdate);
  }
  _calculateState() {
    const s = this.context.abstractFormState.getValue();
    return {
      formID: s.id,
      submitting: s.submitting,
      Component: s.config[this.props.name].Component,
      value: s.data[this.props.name],
      validation: s.validation.fields[this.props.name],
    };
  }
  _onUpdate = () => {
    this.setState(this._calculateState());
  };
  _proxymethod(key) {
    return (...args) => this.props[key](...args);
  }
  _proxyMethods(obj) {
    const result = {};
    for (const key in obj) {
      if (typeof obj[key] === 'function') {
        result[key] = this._proxymethod(key);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  }
  componentWillReceiveProps(props) {
    if (!shallowequal(props, this.props, ignoreFunctions)) {
      this._fieldConfig = getFieldConfig(this._proxyMethods(props));
      this.context.abstractFormState.setConfig(this.props.name, this._fieldConfig);
    }
  }
  componentWillUnmount() {
    if (this._unsubscribe) {
      this._unsubscribe();
    }
    this.context.abstractFormState.deleteConfig(this.props.name);
  }
  _onChange = (value) => {
    if (
      value && typeof value === 'object' && value.target && typeof value.target === 'object' &&
      ('value' in value.target)
    ) {
      value = value.target.value;
    }
    this.context.abstractFormState.setFieldValue(this.props.name, value);
  };
  _onBlur = (e) => {
    const {
      Component,
      value,
      validation,
    } = this.state;
    if (validation === null && Component.normalize) {
      this.context.abstractFormState.setFieldValue(this.props.name, Component.normalize(value, {props: this.props}));
    }
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  };
  render() {
    const {
      formID,
      submitting,
      Component,
      value,
      validation,
    } = this.state;
    const {validate, initialValue, ...props} = this.props;
    return (
      <Component
        {...props}
        disabled={this.props.disabled || submitting}
        form={formID}
        value={value}
        error={validation}
        onChange={this._onChange}
        onBlur={this._onBlur}
      />
    );
  }
}

export default AbstractInput;
