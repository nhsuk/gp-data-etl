function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeWithSpecialCharacter(str) {
  return str.charAt(0) + str.charAt(1).toUpperCase() + str.slice(2);
}

function capitalizeAllCaps(str) {
  return str.charAt(0) + str.slice(1).toLowerCase();
}

function capitalizeWithSpecialCharacterCaps(str) {
  return str.charAt(0) + str.charAt(1).toUpperCase() + str.slice(2).toLowerCase();
}

function capitalizeNameWithApostrophes(str) {
  let stringArray = '';
  str.split(/'/).forEach((name, idx, array) => {
    if (idx === array.length - 1) {
      if (idx === 1) {
        // eslint-disable-next-line no-use-before-define
        stringArray += titleize(name);
      } else {
        stringArray += name.toLowerCase();
      }
    } else {
      // eslint-disable-next-line no-use-before-define
      stringArray += `${titleize(name)}'`;
    }
  });
  return stringArray;
}

function removeExtraSpaces(input) {
  return input.replace(/ {2}/g, ' ').split(' ');
}

function endsWithApostopheS(str) {
  return str.lastIndexOf('\'s') && str.lastIndexOf('\'s') === str.length - 2;
}

function titleize(input) {
  return removeExtraSpaces(input).map((str) => {
    if (str.includes("'")) {
      if (endsWithApostopheS(str)) {
        if (str.split(/'/).length === 2) {
          return `${titleize(str.split(/'(.+)/)[0])}'s`;
        }
        return `${capitalizeNameWithApostrophes(str.replace(new RegExp('\'s$'), ''))}'s`;
      }
      return capitalizeNameWithApostrophes(str);
    }
    if (str.toUpperCase() === str) {
      if (str.charAt(0).match(/[^a-zA-Z\d]/)) {
        return capitalizeWithSpecialCharacterCaps(str);
      }
      return capitalizeAllCaps(str);
    } else if (str.charAt(0).match(/[^a-zA-Z\d']/)) {
      return capitalizeWithSpecialCharacter(str);
    }
    return capitalize(str);
  })
    .join(' ');
}

module.exports = titleize;
