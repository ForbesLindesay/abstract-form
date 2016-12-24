import {PropTypes} from 'react';

export const ChildContextContainerShape = PropTypes.shape({
  getValue: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
});

class ChildContextContainer {
  constructor(value, callbacks) {
    this._value = value;
    this._nextID = 0;
    this._subscribers = new Map();
    for (const key in callbacks) {
      this[key] = callbacks[key];
    }
  }
  getValue() {
    return this._value;
  }
  setValue(value) {
    this._value = value;
    this._subscribers.forEach(fn => fn(value));
  }
  subscribe(fn) {
    const id = this._nextID++;
    this._subscribers.set(id, fn);
    return () => this._subscribers.delete(id);
  }
}
export default ChildContextContainer;
