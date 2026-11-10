import { pinyin } from "pinyin-pro";

export function getAvatarInitial(username: string): string {
  const firstCharacter = Array.from(username.trim())[0] ?? "";
  if (/\p{Script=Han}/u.test(firstCharacter)) {
    return pinyin(firstCharacter, { pattern: "first", toneType: "none" }).toUpperCase();
  }
  return firstCharacter.toUpperCase();
}
