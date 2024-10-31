interface FormValues {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

export const validateEmail = (email: string): string => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email) {
    return 'Email обязателен';
  }
  if (!re.test(String(email).toLowerCase())) {
    return 'Некорректный email';
  }
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password) {
    return 'Пароль обязателен';
  }
  if (password.length < 6) {
    return 'Пароль должен быть не менее 6 символов';
  }
  return '';
};

export const validateName = (name: string): string => {
  if (!name) {
    return 'Имя обязательно';
  }
  if (name.length < 2) {
    return 'Имя должно быть не менее 2 символов';
  }
  return '';
};

export const validateField = (name: string, value: string): string => {
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

export const validateForm = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};
  Object.keys(values).forEach(key => {
    const error = validateField(key, values[key]);
    if (error) {
      errors[key] = error;
    }
  });
  return errors;
};
