import { messages } from '../constants';

export const isValidPassword = (password) => {
  const validPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  return validPasswordPattern.test(password);
};

const parseCoordinates = (input) => {
  const cleanedInput = input.replace(/^\s*\[|\]\s*$/g, '').trim();
  const parts = cleanedInput.split(/,\s*/);

  if (parts.length !== 2) {
    throw new Error(messages.INVALID_INPUT_FORMAT);
  }

  const cleanedParts = parts.map((part) => part.replace(/−/g, '-'));
  const latitude = parseFloat(cleanedParts[0]);
  const longitude = parseFloat(cleanedParts[1]);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    throw new Error(messages.INVALID_COORDS);
  }

  return {
    latitude,
    longitude,
  };
};

export const isValidGeo = (string) => {
  try {
    return parseCoordinates(string);
  } catch (error) {
    return error.message;
  }
};

export const isValidTimeFormat = (time) => {
  const regex = /^\d{2}\.\d{2}.\d{4} \d{2}:\d{2}$/;

  return regex.test(time);
};
