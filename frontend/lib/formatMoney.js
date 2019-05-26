/*
Formats can be found here:
https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry

Which was found on the MDN docs
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation

Options include:
"nl"
"de-DE"
"en-US"
*/
export default function(amountOfCents, currency = "EUR", format = "nl") {
  const options = {
    style: "currency",
    currency,
    minimumFractionDigits: 2
  };
  // if its a whole, dollar amount, leave off the .00
  if (amountOfCents % 100 === 0) options.minimumFractionDigits = 0;
  const formatter = new Intl.NumberFormat(format, options);
  return formatter.format(amountOfCents / 100);
}
