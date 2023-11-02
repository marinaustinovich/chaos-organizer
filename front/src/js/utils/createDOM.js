const createElement = (
  tag,
  {
    classes = [], attributes = {}, children = [], textContent = '',
  } = {},
) => {
  const element = document.createElement(tag);
  element.classList.add(...classes);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  if (textContent) element.textContent = textContent;
  children.forEach((child) => element.appendChild(child));
  return element;
};

export default createElement;
