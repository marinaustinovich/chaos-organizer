export function parseCoordinates(input) {
  // Удаляем квадратные скобки, если они есть, и удаляем пробелы по краям строки
  const cleanedInput = input.replace(/^\s*\[|\]\s*$/g, '').trim();

  // Разбиваем строку на массив с помощью запятой и пробелов
  const parts = cleanedInput.split(/,\s*/);

  // Если массив не содержит двух элементов, выбрасываем исключение
  if (parts.length !== 2) {
    throw new Error('Некорректный формат ввода');
  }

  // Заменяем символ "минус" (U+2212) на стандартный знак "минус" (U+002D)
  const cleanedParts = parts.map((part) => part.replace(/−/g, '-'));

  // Конвертируем элементы массива в числа и проверяем их на валидность
  const latitude = parseFloat(cleanedParts[0]);
  const longitude = parseFloat(cleanedParts[1]);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    throw new Error('Некорректные значения широты и долготы');
  }

  // Возвращаем объект с широтой и долготой
  return {
    latitude,
    longitude,
  };
}

export default function isValidGeo(string) {
  try {
    const coordinates = parseCoordinates(string);
    return coordinates;
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
}
