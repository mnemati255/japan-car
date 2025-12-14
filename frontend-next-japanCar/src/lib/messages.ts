const messages = {
  required: () => `This filed is required.`,
  requiredAtLeast: () => 'At least one item is required.',
  invalid: () => 'This field is invalid.',
  minLength: (l: number) => `This field must be at least ${l} characters.`,
  minCount: (l: number) => `Select at least ${l} items.`,
};

export default messages;
