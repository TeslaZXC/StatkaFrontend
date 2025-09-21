export function cleanPlayerName(nick) {
  if (!nick || typeof nick !== "string") return "";

  let cleaned = nick.replace(/\[[^\]]*\]/g, "");

  cleaned = cleaned.trim();

  if (cleaned.endsWith(".")) {
    cleaned = cleaned.slice(0, -1);
  }

  return cleaned;
}
