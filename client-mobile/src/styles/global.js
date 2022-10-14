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
  default: {
    ...buttonBase,
    backgroundColor: variables.colors.lightest,
    text: {
      color: variables.colors.bodyColor
    }
  },
  primary: {
    ...buttonBase,
    backgroundColor: variables.colors.primary,
    text: {
      color: variables.colors.white
    }
  },
  secondary: {
    ...buttonBase,
    backgroundColor: variables.colors.secondary,
    text: {
      color: variables.colors.white
    }
  },
  success: {
    ...buttonBase,
    backgroundColor: variables.colors.success,
    text: {
      color: variables.colors.white
    }
  },
  info: {
    ...buttonBase,
    backgroundColor: variables.colors.info,
    text: {
      color: variables.colors.white
    }
  },
  warning: {
    ...buttonBase,
    backgroundColor: variables.colors.warning,
    text: {
      color: variables.colors.bodyColor
    }
  },
  danger: {
    ...buttonBase,
    backgroundColor: variables.colors.danger,
    text: {
      color: variables.colors.white
    }
  }
};

export const screen = {
  flex: 1,
  backgroundColor: variables.colors.white
}
