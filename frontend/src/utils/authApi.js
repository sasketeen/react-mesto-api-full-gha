// const serverLink = "api.sasketeen.nomoredomains.monster";
import { apiConfig } from "./apiConfig";

const apiLink = apiConfig.serverLink;
/**
 * Функция проверки ответа
 * @param {Object} response - ответ от сервера
 * @param {String} functionName - название метода API, из которого вызывается данная функция
 * @returns {Promise} промис с объектом JSON или отклоненный промис
 */
const gotResponse = (response, functionName) => {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(`Error in ${functionName}: ${response.status}`);
};

/**
 * Запрос для регистрации пользователя
 * @param {Object} formData объект с данными формы
 * @returns {Promise} промис
 */
export const signup = (formData) => {
  return fetch(`${apiLink}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).then((response) => gotResponse(response, "signup"));
};

/**
 * Запрос для входа пользователя
 * @param {Object} formData объект с данными формы
 * @returns {Promise} промис
 */
export const signin = (formData) => {
  return fetch(`${apiLink}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).then((response) => gotResponse(response, "signin"));
};

/**
 * Запрос для проверки валидности токена и получения  email
 * @param {String} token jwt токен из localStorage
 * @returns {Promise} промис
 */
export const checkToken = (token) => {
  return fetch(`${apiLink}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => gotResponse(response, "checkToken"));
};
