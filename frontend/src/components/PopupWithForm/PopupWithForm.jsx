/**
 * Компонент попапа с формой
 * @param {object} props - пропсы
 * - name - значение модификатора формы
 * - title - заголовок формы
 * - buttonText - текст кнопки
 * - isDisabled - флаг дизейбла сабмита формы
 * - isOpen - флаг открытия попапа
 * - isLoading - флаг процесса отправки данных
 * - onClose - функция обработчик клика по крестику
 * - onOverlayClick - функция обработчик клика по оверлею
 * - onSubmit - функция обработчик сабмита
 * - children - внутренняя разметка формы
 */

import Popup from "../Popup/Popup";

export default function PopupWithForm({
  name,
  title,
  buttonText,
  isDisabled,
  isOpen,
  isLoading,
  onClose,
  onOverlayClick,
  onSubmit,
  children,
}) {
  return (
    <Popup type='form' isOpen={isOpen} onClose={onClose}>
      <form
        className="form"
        name={`${name}-form`}
        noValidate
        onSubmit={onSubmit}
      >
        <h2 className="form__title">{title}</h2>
        {children}
        <button
          type="submit"
          className={`button form__submit-button form__submit-button_place_popup
            ${isLoading || isDisabled ? "form__submit-button_disabled" : ""}`}
          disabled={isLoading || isDisabled}
        >
          {buttonText}
        </button>
      </form>
    </Popup>
    // <div
    //   className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`}
    //   onMouseDown={onOverlayClick}
    // >
    //   <div className="popup__container">
    //     <button
    //       className="button popup__closeButton"
    //       type="button"
    //       name="close"
    //       onClick={onClose}
    //     />

    //   </div>
    // </div>
  );
}
