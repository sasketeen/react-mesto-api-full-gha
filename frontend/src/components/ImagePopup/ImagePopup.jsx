import Popup from "../Popup/Popup"

/**
 * Компонент попапа с фото
 * @param {object} props - пропсы:
 * - card - объект карточки, на которую кликнули
 * - onClose - функция обработчик клика по крестику
 */
export default function ImagePopup({ card, onClose }) {
  return (
    <Popup type='image' isOpen={card.name?true:false} onClose={onClose}>
        <figure className="popup__figure">
          <img src={card.link} alt={card.name} className="popup__image" />
          <figcaption className="popup__subtitle">{card.name}</figcaption>
        </figure>
    </Popup>
  );
}
