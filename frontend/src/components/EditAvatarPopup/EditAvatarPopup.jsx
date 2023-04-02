import { useForm } from "../../hooks/useForm";
import useValidation from "../../hooks/useValidation";
import PopupWithForm from "../PopupWithForm/PopupWithForm";

/**
 * Компонент попапа редактирования аватара
 * @param {Object} props - пропсы:
 * - onUpdateAvatar - функция обновления аватара
 * - onClose - функция обработчик клика по крестику
 * - onOverlayClick - функция обработчик клика по оверлею
 * - isOpen - флаг открытия попапа
 * - isLoading - флаг процесса отправки данных
 */
export default function EditAvatarPopup({ onUpdateAvatar, ...props }) {
  const {values, setValues, handleChange} = useForm({ avatar: "" });
  const [handleValidation, errors, validity] = useValidation();

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdateAvatar(values, setValues);
  };
  const buttonText = props.isLoading ? "Сохранение" : "Сохранить";

  return (
    <PopupWithForm
      name="editAvatar"
      title="Обновить аватар"
      buttonText={buttonText}
      isDisabled={!validity}
      {...props}
      onSubmit={handleSubmit}
    >
      <label className="label label_hidden" htmlFor="avatarInput">
        Ссылка на аватар
      </label>
      <input
        type="url"
        className={`input input_place_popup ${
          errors.avatar ? "input_type_error" : ""
        }`}
        id="avatarInput"
        name="avatar"
        placeholder="Ссылка на аватар"
        required
        value={values.avatar}
        onChange={(event) => {
          handleChange(event);
          handleValidation(event);
        }}
      />
      <span
        className={`input-error avatarInput-error ${
          errors.avatar ? "input-error_active" : ""
        }`}
      >
        {errors.avatar}
      </span>
    </PopupWithForm>
  );
}
