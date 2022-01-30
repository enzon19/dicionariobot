function capitalize (str, obj, merge) {

  const defaultReplace = {"Do ": "do ", "Da ": "da ", "De ": "de ", "E ": "e ", "Aos ": "aos ", "Pela ": "pela ", "Pelo ": "pelo ", "Ao ": "ao ", "Pelas ": "pelas ", "Pelos ": "pelos ", "Dos ": "dos ", "Das ": "das ", "Com ": "com "};

  if (!obj) obj = defaultReplace;
  if (merge && obj) obj = {...defaultReplace, ...obj};

  var re = new RegExp(Object.keys(obj).join("|"),"g");

  return str.split(" ").reduce((a, c) => a + " " + c[0].toUpperCase() + c.substr(1), "").substring(1).replace(re, function(matched) {

    return obj[matched];

  });

}

module.exports = {capitalize}