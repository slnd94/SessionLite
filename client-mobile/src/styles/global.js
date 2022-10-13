import variables from "./variables";

export const inputs = {
  inputLabel: {
    marginTop: 20,
  },
  input: {
  },
  inputValidation: {
    color: variables.colors.danger,
  },
  inputValidationText: {
    color: variables.colors.danger,
  },
};

const buttonBase = {
  margin: 10,
  paddingVertical: 10,
  borderRadius: variables.borderRadius,
};

export const buttons = {
  primary: {
    ...buttonBase,
    color: variables.colors.white,
    backgroundColor: variables.colors.primary,
  },
};
