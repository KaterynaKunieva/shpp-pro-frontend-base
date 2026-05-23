'use strict';

/**
 * Selects TOP-N cities by population from passed CSV and returns function, 
 * that adds to all names of cities (found in selected TOP-N) info line.
 * @param {*} csv - raw CSV-content (x,y,city,population), can contain empty lines and comments
 * @param {*} separator - separator that splits row into columns
 * @param {*} colsAmount - amount of columns
 * @param {*} commentSign - sign that defines line as comment line
 * @param {*} top - amount of cities to select
 * @returns function that adds to all names of cities info line
 */
function useCsv(csv, separator = ",", colsAmount = 4, commentSign = "#", top = 10) {
  const separatorRegexp = new RegExp(`${separator}`, "g");
  const parsedData = csv
    .split("\n")
    .filter(line => isCsvData(line, commentSign, separatorRegexp, colsAmount))
    .map(line => parseCityInfo(line))
    .sort((city1, city2) => city2.population - city1.population)
    .slice(0, top)
    .reduce((acc, el, index) => ({
      ...acc,
      [el.city.toLowerCase()]: {
        population: el.population,
        rating: index + 1,
      }
    }), {});

  return function (text) {
    return Object.keys(parsedData).reduce((acc, city) =>
      acc.replace(new RegExp(`${city}`, "gi"), `$& (${stringifyCity(parsedData[city], top)})`),
      text);
  }
}

/**
 * Checks, if passed line contains CSV data:
 * - not comment
 * - not empty line
 * - contains at least expected amount of columns
 * @param {*} line - line to check
 * @param {*} commentSign - sign of comment
 * @param {*} separatorRegexp - regexp object to find separator sign
 * @param {*} colsAmount - expected amount of columns
 * @returns true, if line contains valid CSV data; otherwise - false.
 */
function isCsvData(line, commentSign, separatorRegexp, colsAmount) {
  return !line.startsWith(commentSign) &&
    line.trim() !== "" &&
    (line.match(separatorRegexp) || []).length >= colsAmount;
}

/**
 * Parses city info from CSV-line to associative array
 * @param {*} line - CSV line in format: x, y, name, population,
 * @returns associative array {x, y, name, population}
 */
function parseCityInfo(line) {
  const arr = line.trim().split(separator);
  return {
    x: parseNumeric(arr[0].trim()),
    y: parseNumeric(arr[1].trim()),
    city: arr[2].trim(),
    population: parseNumeric(arr[3].trim()),
  }
}

/**
 * Converts passed string to numeric with validation 
 * @param {*} str - string to convert
 * @returns number, if string valid, null - if invalid
 */
function parseNumeric(str) {
  const numeric = Number.parseFloat(str);
  return Number.isNaN(numeric) ? null : numeric;
}

/**
 * Returns string representation of people amount depending on population value.
 * @param {*} population - amount of people
 * @returns string representation of population in Ukranian language
 */
function getPeopleString(population) {
  const lastDigit = population % 10;
  const lastTwoDigits = population % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${population} людей`;
  }
  else if (lastDigit === 1) {
    return `${population} людина`;
  }
  else if (lastDigit >= 2 && lastDigit <= 4) {
    return `${population} людини`;
  }

  return `${population} людей`;
}

/**
 * Returns string representation of the city from TOP-N list
 * @param {*} obj - {name, rating}
 * @param {*} top - N from TOP-N
 * @returns string representation of the city info in Ukranian language
 */
function stringifyCity(obj, top) {
  return `${obj.rating} місце в ТОП-${top} найбільших міст України, населення ${getPeopleString(obj.population)}`;
}

const csvData = `48.30,32.16,Кропивницький,200000,
44.38,34.33,Алушта,31440,
49.46,30.17,Біла Церква,200131,
49.54,28.49,Бердичів,87575,#некоммент

#
46.49,36.58,#Бердянськ,121692,
49.15,28.41,Вінниця,356665,
#45.40,34.29,Джанкой,43343,

# в цьому файлі три рядки-коментаря :)`;

const enrichText = useCsv(csvData, ",", 4, "#", 10);

const input = "Я була в таких містах як Вінниця та АЛУШТА.";
console.log(enrichText(input));
