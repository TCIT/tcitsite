
export const ruleValidator = (field, name, ...validations) => {
  return (state) => {
    for (let v  of validations) {
      let errorMessageFunc = v(state[field], state);
      if (errorMessageFunc) {
        return {[field]: errorMessageFunc(name)};
      }
    }
    return null;
  };
};

export const validateRules = (state, validators) => {
  return validators.reduce((memo, validator) => {
    return Object.assign(memo, validator(state));
  }, {});
};

