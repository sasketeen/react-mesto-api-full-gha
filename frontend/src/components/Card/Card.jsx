import { useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

/**
 * Компонент карточки
 * @param {object} props - пропсы:
 * - card - объект экземпляра карточки
 * - onClickImage - функция обработчик клика по фото
 * - onClickLike - функция обработчик лайка карточки
 * - onClickDelete - функция обработчик удаления карточки
 */
export default function Card({
  card,
  onClickImage,
  onClickLike,
  onClickDelete,
}) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((user) => user._id === currentUser._id);

  /**
   * колбек при клике на картинку
   */
  const handleImageClick = () => {
    onClickImage(card);
  };

  /**
   * колбек при клике на лайк
   */
  const handleLikeClick = () => {
    onClickLike(card);
  };

  /**
   * колбек при клике на удаление
   */
  const handleDeleteCard = () => {
    onClickDelete(card);
  };

  return (
    <div className="card">
      {isOwn && (
        <button
          className="button card__buttonDelete"
          type="button"
          name="delete"
          onClick={handleDeleteCard}
        />
      )}
      <img
        src={card.link}
        alt={card.name}
        className="card__image"
        onClick={handleImageClick}
      />
      <div className="card__description">
        <h2 className="card__subtitle">{card.name}</h2>
        <div className="card__likeContainer">
          <button
            className={`button card__likeButton ${
              isLiked && "card__likeButton_active"
            }`}
            type="button"
            name="like"
            aria-label="Like"
            onClick={handleLikeClick}
          ></button>
          <span className="card__likeCounter">{card.likes.length}</span>
        </div>
      </div>
    </div>
  );
}
