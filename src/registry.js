const components = {};
let button = 'button';

export function registerInput(type, Component) {
  components[type] = Component;
}
export function getInput(type) {
  return components[type];
}
export function registerButton(Component) {
  button = Component;
}
export function getButton() {
  return button;
}
