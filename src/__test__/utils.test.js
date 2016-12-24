import {normalizeData, validate} from '../utils';

const REQUIRED_MSG = 'You must provide a value for this field.';
test('validate', () => {
  const config = {
    andy: {Component: {}, props: {required: true}},
    bob: {Component: {validate(value) { throw new Error('Not implemented'); }}, props: {required: false}},
    cat: {Component: {validate(value) { return value === 'meow' ? null : 'Cats go meow'; }}, props: {required: true}},
    dog: {
      Component: {validate(value) { return /^woo+f\!$/i.test(value) ? null : 'Dogs go woof!'; }},
      props: {required: true},
    },
    elephant: {Component: {}, props: {required: true}},
    forbes: {
      Component: {},
      props: {required: true, validate(value) { return value === 'hi' ? null : 'Forbes goes hi'; }},
    },
    goat: {
      Component: {},
      props: {required: true, validate(value) { return value === 'baaah' ? null : 'goats go baaah'; }},
    },
  };
  expect(validate({
    data: {andy: null, bob: '', cat: 'Woooooof!', dog: 'Wooooof!', elephant: 'whatever', forbes: 'hi', goat: 'Woof!'},
    config,
  })).toEqual({
    fields: {
      andy: REQUIRED_MSG,
      bob: null,
      cat: 'Cats go meow',
      dog: null,
      elephant: null,
      forbes: null,
      goat: 'goats go baaah',
    },
    isValid: false,
  });
  expect(validate({
    data: {andy: 'Whatever', bob: '', cat: 'meow', dog: 'Wooooof!', elephant: 'whatever', forbes: 'hi', goat: 'baaah'},
    config,
  })).toEqual({
    fields: {
      andy: null,
      bob: null,
      cat: null,
      dog: null,
      elephant: null,
      forbes: null,
      goat: null,
    },
    isValid: true,
  });
});

test('normalizeData', () => {
  expect(normalizeData({
    data: {foo: 'bar', bing: 'baz'},
    config: {foo: {Component: {normalize(value) { return value === 'bar'; }}}, bing: {Component: {}}},
  })).toEqual({foo: true, bing: 'baz'});
});
