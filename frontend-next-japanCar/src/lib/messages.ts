const messages = {
  required: () => `This filed is required.`,
  requiredAtLeast: () => 'At least one item is required.',
  invalid: () => 'This field is invalid.',
  minLength: (l: number) => `Password must be at least ${l} characters.`,
};

export default messages;
