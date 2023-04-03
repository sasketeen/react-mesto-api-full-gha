import { useContext, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import logo from "../../images/logo.svg";

/**
 * Компонент хедера
 * @param {*} handleSignOut - обработчик выхода из профиля
 */
export default function Header({ handleSignOut }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const currentUser = useContext(CurrentUserContext);

  const handleClickBurger = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <header className={`header ${isMenuVisible ? "header_menu-visible" : ""}`}>
      <img src={logo} alt="Логотип Место" className="logo" />
      <Routes>
        <Route
          path="/"
          element={
            <div className="header-menu-wrapper">
              <div
                className={`header__menu ${
                  isMenuVisible ? "header__menu_visible" : ""
                }`}
              >
                <p className="header__user-email">{currentUser.email}</p>
                <button
                  className="button header__button"
                  onClick={handleSignOut}
                >
                  Выйти
                </button>
              </div>
              <button
                aria-label="Дополнительное меню"
                className={`button burger-button ${
                  isMenuVisible ? "burger-button_active" : ""
                }`}
                onClick={handleClickBurger}
              />
            </div>
          }
        />
        <Route
          path="sign-in"
          element={
            <Link
              to={"/sign-up"}
              className={"link link_place_header"}
            >
              Регистрация
            </Link>
          }
        />
        <Route
          path="sign-up"
          element={
            <Link
              to={"/sign-in"}
              className={"link link_place_header"}
            >
              Войти
            </Link>
          }
        />
      </Routes>
    </header>
  );
}
