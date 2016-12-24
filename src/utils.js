// TODO: implement validate(state)
// TODO: implement normalizeData(state)

function validateField(v, c, {data, config}) {
  if (v == null || v === '') {
    if (c.props.required) {
      return 'You must provide a value for this field.';
    } else {
      return null;
    }
  }
  if (c.Component.validate) {
    const result = c.Component.validate(v, {data, props: c.props});
    if (result) {
      return result;
    }
  }
  if (c.props.validate) {
    const result = c.props.validate(v, {data, props: c.props});
    if (result) {
      return result;
    }
  }
  return null;
}
export function validate({data, config}) {
  let isValid = true;
  const fields = {};
  Object.keys(config).forEach(key => {
    const c = config[key];
    const v = data[key];
    const result = validateField(v, c, {data, config});
    fields[key] = result;
    isValid = isValid && (result === null);
  });
  return {isValid, fields};
}

export function normalizeData({data, config}) {
  const result = {};
  Object.keys(config).forEach(key => {
    result[key] = (
      config[key].Component.normalize
      ? config[key].Component.normalize(data[key], {data, props: config[key].props})
      : data[key]
    );
  });
  return result;
}
