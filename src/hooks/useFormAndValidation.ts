import { useState, useCallback, ChangeEvent } from 'react';
import { validateField, validateForm } from './validators';

interface FormValues {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

export function useFormAndValidation() {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isValid, setIsValid] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
    setIsValid(e.target.closest('form')!.checkValidity() && !error);
  };

  const validateAll = useCallback(() => {
    const formErrors = validateForm(values);
    setErrors(formErrors);
    setIsValid(Object.keys(formErrors).length === 0);
  }, [values]);

  const resetForm = useCallback((newValues: FormValues = {}, newErrors: FormErrors = {}, newIsValid: boolean = false) => {
    setValues(newValues);
    setErrors(newErrors);
    setIsValid(newIsValid);
  }, []);

  return { values, handleChange, errors, isValid, resetForm, setValues, setIsValid, validateAll };
}
