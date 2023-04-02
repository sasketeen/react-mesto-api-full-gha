import { useForm } from "../../hooks/useForm";
import useValidation from "../../hooks/useValidation";

/**
 *
 * @param {Object} props - пропсы
 * title - заголовок формы,
 * buttonText - текст кнопки сабмита,
 * handleSubmit - обработчик сабмита,
 * @returns
 */
export default function AuthForm({ title, buttonText, handleSubmit, className }) {
  const [handleValidation, errors, validity] = useValidation();
  const{ values, handleChange } = useForm({ email: "", password: "" });

  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(values);
  };

  return (
    <form
      className={`form form_type_auth ${className}`}
      onSubmit={onSubmit}
      noValidate
    >
      <h1 className="form__title form__title_place_auth">{title}</h1>
      <label className="label label_hidden" htmlFor="emailInput">
        Электронная почта
      </label>
      <input
        type="email"
        minLength={3}
        className={`input input_place_auth-form ${
          errors.email ? "input_type_error" : ""
        }`}
        id="emailInput"
        name="email"
        placeholder="Email"
        required
        value={values.email}
        onChange={(event) => {
          handleValidation(event);
          handleChange(event);
        }}
      />
      <span
        className={`input-error emailInput-error ${
          errors.email ? "input-error_active" : ""
        }`}
      >
        {errors.email}
      </span>

      <label className="label label_hidden" htmlFor="passwordInput">
        Пароль
      </label>
      <input
        type="password"
        minLength={6}
        className={`input input_place_auth-form ${
          errors.password ? "input_type_error" : ""
        }`}
        id="passwordInput"
        name="password"
        placeholder="Пароль"
        required
        value={values.password}
        onChange={(event) => {
          handleValidation(event);
          handleChange(event);
        }}
      />
      <span
        className={`input-error passwordInput-error ${
          errors.password ? "input-error_active" : ""
        }`}
      >
        {errors.password}
      </span>
      <button
        type="submit"
        className={`button form__submit-button form__submit-button_place_auth
            ${!validity ? "form__submit-button_disabled" : ""}`}
        disabled={!validity}
      >
        {buttonText}
      </button>
    </form>
  );
}
