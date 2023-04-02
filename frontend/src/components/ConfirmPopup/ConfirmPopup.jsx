import PopupWithForm from "../PopupWithForm/PopupWithForm";

/**
 * Компонент попапа подтверждения
 * @param {object} props - пропсы:
 * - handleSubmit - функция обновления/подтверждения
 * - onClose - функция обработчик клика по крестику
 * - onOverlayClick - функция обработчик клика по оверлею
 * - isOpen - флаг открытия попапа
 * - isLoading - флаг процесса отправки данных
 */
export default function ConfirmPopup(props) {
  const buttonText = props.isLoading ? "Удаление" : "Удалить";

  return (
    <PopupWithForm
      name="Confirm"
      title="Вы уверены?"
      buttonText={buttonText}
      isDisabled={false}
      {...props}
    />
  );
}
