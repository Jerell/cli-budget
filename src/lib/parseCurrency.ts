import config from "../config.json";

export default function parseTransactionString(text: string) {
  const pattern = new RegExp(config.currencyRegex);
  const matches = text.match(pattern);

  if (!matches) return null;

  const sign = matches[0].includes("+") ? 1 : -1;

  return {
    value: sign * Number(matches[1]),
    label: matches[matches.length - 1],
  };
}
