import AuthForm from "../AuthForm/AuthForm";

/**
 * Компонент страницы входа
 * @param {*} handleSignIn - обработчик сабмита формы
 */
export default function Login({ handleSignIn }) {
  return (
    <section className="auth">
      <div className="auth-wrapper">
        <AuthForm
          className="auth__login-form"
          title="Вход"
          buttonText="Войти"
          handleSubmit={handleSignIn}
        />
      </div>
    </section>
  );
}
