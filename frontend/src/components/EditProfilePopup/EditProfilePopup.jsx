import { useEffect, useContext} from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { useForm } from "../../hooks/useForm";
import useValidation from "../../hooks/useValidation";
import PopupWithForm from "../PopupWithForm/PopupWithForm";

/**
 * Компонент попапа редактирования профиля
 * @param {Object} props - пропсы:
 * - onUpdateUser - функция обновления данных пользователя
 * - onClose - функция обработчик клика по крестику
 * - onOverlayClick - функция обработчик клика по оверлею
 * - isOpen - флаг открытия попапа
 * - isLoading - флаг процесса отправки данных
 */
export default function EditProfilePopup({ onUpdateUser, ...props }) {
  const currentUser = useContext(CurrentUserContext);
  const {values, setValues, handleChange} = useForm({ name: "", about:"" });
  const [handleValidation, errors, validity] = useValidation();

  useEffect(() => {
    if (props.isOpen) {
      setValues({ name: currentUser.name, about: currentUser.about });
    }
  }, [currentUser, props.isOpen, setValues]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdateUser( values );
  };

  const buttonText = props.isLoading ? "Сохранение" : "Сохранить";

  return (
    <PopupWithForm
      name="editProfile"
      title="Редактировать профиль"
      buttonText={buttonText}
      isDisabled={!validity}
      {...props}
      onSubmit={handleSubmit}
    >
      <label className="label label_hidden" htmlFor="nameInput">
        Имя
      </label>
      <input
        type="text"
        className={`input input_place_popup ${
          errors.name ? "input_type_error" : ""
        }`}
        id="nameInput"
        name="name"
        minLength="2"
        maxLength="40"
        required
        value={values.name}
        onChange={(event) => {
          handleChange(event);
          handleValidation(event);
        }}
      />
      <span
        className={`input-error nameInput-error ${
          errors.name ? "input-error_active" : ""
        }`}
      >
        {errors.name}
      </span>
      <label className="label label_hidden" htmlFor="aboutInput">
        Описание профиля
      </label>
      <input
        type="text"
        className={`input input_place_popup ${
          errors.about ? "input_type_error" : ""
        }`}
        id="aboutInput"
        name="about"
        minLength="2"
        maxLength="200"
        required
        value={values.about}
        onChange={(event) => {
          handleChange(event);
          handleValidation(event);
        }}
      />
      <span
        className={`input-error aboutInput-error ${
          errors.about ? "input-error_active" : ""
        }`}
      >
        {errors.about}
      </span>
    </PopupWithForm>
  );
}
