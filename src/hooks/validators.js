export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email) {
      return 'Email обязателен';
    }
    if (!re.test(String(email).toLowerCase())) {
      return 'Некорректный email';
    }
    return '';
  };


  export const validatePassword = (password) => {
    if (!password) {
      return 'Пароль обязателен';
    }
    if (password.length < 6) {
      return 'Пароль должен быть не менее 6 символов';
    }
    return '';
  };


  export const validateName = (name) => {
    if (!name) {
      return 'Имя обязательно';
    }
    if (name.length < 2) {
      return 'Имя должно быть не менее 2 символов';
    }
    return '';
  };


  export const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'name':
        return validateName(value);
      default:
        return '';
    }
  };


  export const validateForm = (values) => {
    const errors = {};
    Object.keys(values).forEach(key => {
      const error = validateField(key, values[key]);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
