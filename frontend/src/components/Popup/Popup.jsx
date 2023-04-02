import { useEffect } from "react";

export default function Popup({
  type,
  isOpen,
  onClose,
  children,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscPress = ({ key }) => {
      if (key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscPress);
    return () => document.removeEventListener("keydown", handleEscPress);
  }, [isOpen, onClose]);

  const handleOverlayClick = ({ target, currentTarget }) => {
    if (target === currentTarget) onClose();
  };

  return (
    <div
      className={`popup popup_type_${type} ${isOpen ? "popup_opened" : ""}`}
      onMouseDown={handleOverlayClick}
    >
      <div className={`popup__container popup__container_type_${type}`}>
        <button
          className="button popup__closeButton"
          type="button"
          name="close"
          onClick={onClose}
        />
        {children}
      </div>
    </div>
  );
}
