export function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

export function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
}

export function parseHobbies(hobbies: string): string[] {
  try {
    return JSON.parse(hobbies);
  } catch {
    return [];
  }
}

export function getTargetAgeLabel(targetAge: string): string {
  switch (targetAge) {
    case "65-74":
      return "アクティブシニア（65-74歳）";
    case "75-84":
      return "75-84歳";
    case "85+":
      return "85歳以上";
    default:
      return targetAge;
  }
}

export function getGenderLabel(gender: string): string {
  switch (gender) {
    case "mother":
      return "お母さん向け";
    case "father":
      return "お父さん向け";
    case "both":
      return "両親向け";
    default:
      return gender;
  }
}
