import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import DateInput from './components/date-input';
import IntegerInput from './components/integer-input';
import TextInput from './components/text-input';
import {registerInput, createFormContainer, Input, SubmitButton, InputOnBlur, Form} from '../src';

registerInput('date', DateInput);
registerInput('integer', IntegerInput);
registerInput('text', TextInput);

function maxLength(n) {
  return (value) => {
    if (value.length > n) {
      return `Please enter fewer than ${n} characters.`;
    }
  };
}
function NewEntry({data, isValid}) {
  return (
    <div>
      <Form/>
      Date: <Input type="date" name="entryDate" required />
      value: <Input type="integer" name="entryValue" required />
      Message: <Input type="text" name="entryMessage" required validate={maxLength(100)} />
      <SubmitButton disabled={!isValid}>Create Entry</SubmitButton>
    </div>
  );
}
const NewEntryContainer = createFormContainer(NewEntry);


class Example extends Component {
  state = {entries: []};
  _onSubmitNewEntry = (newEntry) => {
    this.setState(({entries}) => ({
      entries: entries.concat(newEntry),
    }));
  };
  _onChangeDate = (date) => {
    this.setState({date});
  };
  render() {
    return (
      <div>
        <NewEntryContainer key={this.state.entries.length} onSubmit={this._onSubmitNewEntry} />
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Value</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.entries.map((entry, i) => {
                return (
                  <tr key={i}>
                    <td>{entry.entryDate}</td>
                    <td>{entry.entryValue}</td>
                    <td>{entry.entryMessage}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        <InputOnBlur type="date" value={this.state.date} onChange={this._onChangeDate} />
        <div>Date is {this.state.date}</div>
      </div>
    );
  }
}

ReactDOM.render(
  <Example />,
  document.getElementById('container'),
);
