export const createElement = (
  tag,
  {
    classes = [], attributes = {}, children = [], textContent = '',
  } = {},
) => {
  const element = document.createElement(tag);
  element.classList.add(...classes);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  if (textContent) element.innerHTML = textContent;
  children.forEach((child) => element.appendChild(child));
  return element;
};

export const createLink = (inputText) => {
  if (!inputText) return '';
  const replacePattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;

  const replacedText = inputText.replace(replacePattern, (match) => `<a href="${match}" target="_blank" rel="noopener noreferrer">${match}</a>`);

  return replacedText;
};
