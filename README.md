# abstract-form

Abstract form components for React

[![Build Status](https://img.shields.io/travis/ForbesLindesay/abstract-form/master.svg)](https://travis-ci.org/ForbesLindesay/abstract-form)
[![Dependency Status](https://img.shields.io/david/ForbesLindesay/abstract-form/master.svg)](http://david-dm.org/ForbesLindesay/abstract-form)
[![NPM version](https://img.shields.io/npm/v/abstract-form.svg)](https://www.npmjs.org/package/abstract-form)

## Installation

```
npm install abstract-form --save
```

## Usage

```js
var {registerInput} = require('abstract-form');

registerInput('date', DateInput);
registerInput('email', EmailInput);
registerInput('text', TextInput);
registerInput('integer', IntegerInput);
```

```js
class DateInput extends Component {
  static validate(value) {
    return /^\d\d\d\d\-\d\d\-\d\d$/.test(value);
  }
  _onChange = (e) => {
    this.props.onChange(e.target.value);
  }
  render() {
    return (
      <div>
        <input type="text" placeholder="yyyy-mm-dd" value={this.props.value} onChange={this._onChange} />
        {
          this.props.error
          ? <div>{this.props.error}</div>
          : null
        }
      </div>
    );
  }
}
```

```js
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
  _onChange = (e) => {
    this.props.onChange(e.target.value);
  }
  render() {
    return (
      <div>
        <input type="text" value={this.props.value} onChange={this.props.onChange} />
        {
          this.props.error
          ? <div>{this.props.error}</div>
          : null
        }
      </div>
    );
  }
}
```

```js
import {createForm, Input, SubmitButton} from 'abstract-form';

function maxLength(n) {
  return (value) => {
    if (value.length > n) {
      return `Please enter fewer than ${n} characters.`;
    }
  };
}
function NewEntry({data, isValid, Form}) {
  return (
    <Form>
      Date: <Input type="date" name="creationDate" required />
      Email: <Input type="email" name="userEmail" required />
      <Input type="text" name="messageText" required validate={maxLength(100)} />
      <SubmitButton disabled={!isValid}>Create Entry</SubmitButton>
    </Form>
  );
}
const NewEntryContainer = createForm(NewEntry);
```

```js
import {InputOnBlur} from 'abstract-form';

function DateInputOnBlur(props) {
  return <InputOnBlur type="date" value={props.value} onChange={props.onChange} />
}
```

## License

MIT
