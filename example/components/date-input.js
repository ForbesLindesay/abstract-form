import React, {Component} from 'react';
import parseDate from 'dehumanize-date';
import formatDate from 'occasion';

function parse(value, props) {
  return parseDate(value, {
    usa: props.usa,
    now: props.now,
    cutoff: props.cutoff,
  });
}
class DateInput extends Component {
  static validate(value, {props}) {
    return (
      parse(value, props) === null
      ? 'You must enter a valid date, e.g. 12th January 2011, tomorrow, 05/06/2011'
      : null
    );
  }
  static normalize(value, {props}) {
    return parse(value, props);
  }
  static getInitialValue() {
    return null;
  }
  static defaultProps = {
    format: 'YYYY-MM-DD',
  };
  render() {
    const {type, value, error, ...props} = this.props;
    let formatedValue = value;
    if (/^\d\d\d\d\-\d\d\-\d\d$/.test(value)) {
      formatedValue = formatDate(value, this.props.format);
    } else if (!value) {
      formatedValue = '';
    }
    return (
      <div>
        <input {...props} type="text" value={formatedValue}/>
        {
          error
          ? <div>{error}</div>
          : null
        }
      </div>
    );
  }
}

export default DateInput;
