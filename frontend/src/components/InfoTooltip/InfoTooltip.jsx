import Popup from "../Popup/Popup";

/** Компонент информационного модального окна */
export default function InfoTooltip({
  onClose,
  isOpen,
  isSuccess,
}) {
  const message = isSuccess
    ? "Вы успешно зарегистрировались!"
    : "Что-то пошло не так!Попробуйте ещё раз";

  return (
    <Popup type='tooltip' isOpen={isOpen} onClose={onClose}>
        <div
          className={`tooltip ${
            isSuccess ? "tooltip_type_success" : "tooltip_type_fail"
          }`}
        >
          <p className="tooltip__message">{message}</p>
        </div>
    </Popup>
  );
}
