import { useState } from "react";

export function useForm(inputValues) {
  const [values, setValues] = useState(inputValues);

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setValues({ ...values, [name]: value });
  };
  return { values, setValues, handleChange };
}
