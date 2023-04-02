import { useEffect, useReducer, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

import api from "../utils/api";
import { signup, signin, checkToken } from "../utils/authApi";
import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import ImagePopup from "./ImagePopup/ImagePopup";
import EditProfilePopup from "./EditProfilePopup/EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup/EditAvatarPopup";

import defaultAvatar from "../images/Anonymous_emblem.svg";
import AddPlacePopup from "./AddPlacePopup/AddPlacePopup";
import ConfirmPopup from "./ConfirmPopup/ConfirmPopup";
import { useNavigate, Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import InfoTooltip from "./InfoTooltip/InfoTooltip";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

function App() {
  //стейты

  /** редюсер для обновления стейта пользователя */
  const userReducer = (state, action) => {
    switch (action.type) {
      case "updateUserInfo": {
        return {
          ...action.data,
          email: state.email,
        };
      }
      case "updateEmail": {
        return {
          ...state,
          email: action.data,
        };
      }
      default: {
        throw Error("Unknown action: " + action.type);
      }
    }
  };

  /** стейт со всеми данными пользователя */
  const [currentUser, updateCurrentUser] = useReducer(userReducer, {
    name: "Anonimus",
    about: "Anonimus descriprion",
    avatar: defaultAvatar,
    email: "avadacedavra@anonimus.wtf",
  });

  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditProfileLoading, setIsEditProfileLoading] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isAddPlaceLoading, setIsAddPlaceLoading] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditAvatarLoading, setIsEditAvatarLoading] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [isUserSignIn, setIsUserSignIn] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [deletingCard, setDeletingCard] = useState({});

  //регистрация и авторизация

  /**
   * Обработчик регистрации пользователя
   * @param {Object} formData объект с данными формы
   */
  const handleSignUp = (formData) => {
    signup(formData)
      .then((result) => {
        setIsSuccess(true);
        //таймаут нужен, чтобы убрать ошибку 429 от сервера Яндекса. Но похоже на костыль
        setTimeout(handleSignIn, 500, formData);
      })
      .catch((err) => {
        console.log(err);
        setIsSuccess(false);
      })
      .finally(() => setIsInfoTooltipOpen(true));
  };

  /**
   * Обработчик входа пользователя
   * @param {Object} formData объект с данными формы
   */
  const handleSignIn = (formData) => {
    signin(formData)
      .then(({ token }) => {
        localStorage.setItem("jwt", token);
        setIsUserSignIn(true);
        updateCurrentUser({
          type: "updateEmail",
          data: formData.email,
        });
        navigate("/react-mesto-auth/");
      })
      .catch((err) => {
        console.log(err);
        setIsSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setIsUserSignIn(false);
    updateCurrentUser({
      type: "updateEmail",
      data: "",
    });
  };

  /** Проверка наличия токена при первом монтировании*/
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      checkToken(jwt)
        .then((res) => {
          if (res) {
            setIsUserSignIn(true);
            updateCurrentUser({
              type: "updateEmail",
              data: res.data.email,
            });
            //Спасибо, очень полезно и интересно 10 из 10!
            navigate("/react-mesto-auth/", { replace: true });
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  /** инициализация начальных данных при входе */
  useEffect(() => {
    if (isUserSignIn) {
      Promise.all([api.getUserInfo(), api.getCards()])
        .then(([userData, cardsData]) => {
          updateCurrentUser({
            type: "updateUserInfo",
            data: userData,
          });
          setCards(cardsData);
        })
        .catch((err) => console.log(err));
    }
  }, [isUserSignIn]);

  /**
   *  функция обновления данных пользователя после запроса
   * @param {object} userData - объект пользователя
   */
  const updateUserInfo = (userData) => {
    updateCurrentUser({
      type: "updateUserInfo",
      data: userData,
    });
    closeAllPopups();
  };

  /**
   * функция обработчик клика по кнопке редактирования профиля
   */
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  /**
   * функция обработки сабмита формы обновления информации пользователя
   * @param {object} newUserData - объект с новым именем и описание пользователя
   */
  const handleUpdateUser = (newUserData) => {
    setIsEditProfileLoading(true);
    api
      .editUserInfo(newUserData)
      .then((userData) => {
        updateUserInfo(userData);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsEditProfileLoading(false));
  };

  /**
   * функция обработчик клика по кнопке добавления карточки
   */
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  /**
   * функция обработки сабмита формы добавления карточки
   * @param {object} cardData - объект с новым данными карточки
   */
  const handleAddPlace = (cardData, setValues) => {
    setIsAddPlaceLoading(true);
    api
      .addCard(cardData)
      .then((newCard) => {
        closeAllPopups();
        setCards([newCard, ...cards]);
        setValues({ name: "", link: "" });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsAddPlaceLoading(false));
  };

  /**
   * функция обработчик клика по кнопке редактирования аватара
   */
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  /**
   * функция обработки сабмита формы обновления аватара
   * @param {object} newAvatarData - объект с новой ссылкой на аватар
   */
  const handleUpdateAvatar = (newAvatarData, setValues) => {
    setIsEditAvatarLoading(true);
    api
      .editAvatar(newAvatarData)
      .then((userData) => {
        setValues({ avatar: "" });
        updateUserInfo(userData);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsEditAvatarLoading(false));
  };

  /**
   * функция обработчик клика по фото
   * @param {object} card - объект выбранной карточки
   */
  const handleClickImage = (card) => {
    setSelectedCard(card);

  };

  /**
   * функция обработчик лайка карточки
   * @param {object} targetCard - объект лайкнутой карточки
   */
  const handleLikeCard = (targetCard) => {
    const isLiked = targetCard.likes.some(
      (user) => user._id === currentUser._id
    );

    api
      .changeLike(targetCard._id, isLiked)
      .then((newCard) =>
        setCards((cards) =>
          cards.map((card) => (card._id === targetCard._id ? newCard : card))
        )
      )
      .catch((err) => console.log(err));
  };

  /**
   * функция обработчик клика по кнопке удаления
   * @param {object} targetCard - объект удаляемой карточки
   */
  const handleClickDeleteCard = (targetCard) => {
    setDeletingCard(targetCard);
    setIsConfirmPopupOpen(true);
  };

  /**
   * функция обработчик удаления карточки
   * @param {event} event - событие сабмита
   */
  const handleConfirmDelete = (event) => {
    event.preventDefault();
    setIsConfirmLoading(true);
    api
      .deleteCard(deletingCard._id)
      .then(() => {
        setCards((cards) =>
          cards.filter((card) => {
            return card._id !== deletingCard._id;
          })
        );
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsConfirmLoading(false));
  };

  /**
   * функция закрытия попапов
   */
  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmPopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({});
    setDeletingCard({});
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header handleSignOut={handleSignOut} />
        <Routes>
          <Route
            path="react-mesto-auth/"
            element={
              <>
                <ProtectedRoute
                  isSignIn={isUserSignIn}
                  element={Main}
                  cards={cards}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onClickImage={handleClickImage}
                  onClickLike={handleLikeCard}
                  onClickDelete={handleClickDeleteCard}
                />

                <Footer />

                <EditAvatarPopup
                  onClose={closeAllPopups}
                  onUpdateAvatar={handleUpdateAvatar}
                  isOpen={isEditAvatarPopupOpen}
                  isLoading={isEditAvatarLoading}
                />

                <EditProfilePopup
                  onClose={closeAllPopups}
                  onUpdateUser={handleUpdateUser}
                  isOpen={isEditProfilePopupOpen}
                  isLoading={isEditProfileLoading}
                />

                <AddPlacePopup
                  onClose={closeAllPopups}
                  onAddPlace={handleAddPlace}
                  isOpen={isAddPlacePopupOpen}
                  isLoading={isAddPlaceLoading}
                />

                <ImagePopup
                  card={selectedCard}
                  onClose={closeAllPopups}
                />

                <ConfirmPopup
                  onClose={closeAllPopups}
                  onSubmit={handleConfirmDelete}
                  isOpen={isConfirmPopupOpen}
                  isLoading={isConfirmLoading}
                />
              </>
            }
          />
          <Route
            path="react-mesto-auth/sign-up"
            element={<Register handleSignUp={handleSignUp} />}
          />
          <Route
            path="react-mesto-auth/sign-in"
            element={<Login handleSignIn={handleSignIn} />}
          />
        </Routes>
        <InfoTooltip
          onClose={closeAllPopups}
          isOpen={isInfoTooltipOpen}
          isSuccess={isSuccess}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
