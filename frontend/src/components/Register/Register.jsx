import { Link } from "react-router-dom";
import AuthForm from "../AuthForm/AuthForm";

/**
 * Компонент страницы регистрации
 * @param {*} handleSignUp - обработчик сабмита формы
 */
export default function Register({ handleSignUp }) {
  return (
    <section className="auth">
      <div className="auth-wrapper">
        <AuthForm
          className="auth__registr-form"
          title="Регистрация"
          buttonText="Зарегистрироваться"
          handleSubmit={handleSignUp}
        />
        <p className="auth__sublink">
          Уже зарегистрированы?{" "}
          <Link to={"/sign-in"} className={"link"}>
            Войти
          </Link>
        </p>
      </div>
    </section>
  );
}
