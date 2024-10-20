import { useState, useCallback } from 'react';
import { validateField, validateForm } from './validators';

export function useFormAndValidation() {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
    setIsValid(e.target.closest('form').checkValidity() && !error);
  };

  const validateAll = useCallback(() => {
    const formErrors = validateForm(values);
    setErrors(formErrors);
    setIsValid(Object.keys(formErrors).length === 0);
  }, [values]);

  const resetForm = useCallback((newValues = {}, newErrors = {}, newIsValid = false) => {
    setValues(newValues);
    setErrors(newErrors);
    setIsValid(newIsValid);
  }, [setValues, setErrors, setIsValid]);

  return { values, handleChange, errors, isValid, resetForm, setValues, setIsValid, validateAll };
}
