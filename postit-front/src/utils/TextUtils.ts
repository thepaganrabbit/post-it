// src/utils/tagUtils.ts

/**
 * Extract all tags from a string.
 * @example
 *   extractTags("Hello #world, #example") // ["world", "example"]
 */
export function extractTags(text: string): string[] {
  const regex = /#(\w+)/g;
  const tags: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // match[1] contains the tag without the '#'
    tags.push(match[1]);
  }

  return tags;
}

/**
 * Remove full tags (including the '#') from the string.
 * @example
 *   removeTags("Hello #world, #example") // "Hello , "
 */
export function removeTags(text: string): string {
  return text.replace(/#\w+/g, "");
}

/**
 * Remove only the '#' but keep the tag word.
 * @example
 *   removeHash("Hello #world, #example") // "Hello world, example"
 */
export function removeHash(text: string): string {
  return text.replace(/#(\w+)/g, "$1");
}

export function priorityFromTitle(input: string): number {
  let count = input
    .split("")
    .filter((char) => char === "!" || char === "?").length;

  if (count === 1) return 1;
  else if (count === 2) return 2;
  else return 0;
}

export function removeSymbol(str: string, symbolToRemove: string): string {
  let regex = new RegExp(symbolToRemove + "+", "g");
  return str.replace(regex, "");
}

export function stripPunctuation(arr: string[]): string[] {
  const regex = /[^A-Za-z0-9\s]/g; // matches anything that is NOT a letter, digit, or space
  return arr.map((str) => str.replace(regex, ""));
}

/**
 * Remove leading and trailing punctuation/symbols from each string in the array.
 * @param arr Array of strings to process.
 * @returns New array with cleaned strings.
 */
export function trimPunctuation(arr: string[]): string[] {
  // \p{P} = punctuation, \p{S} = symbols. ^ and $ anchor to string start/end.
  const pattern = /^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu;
  return arr.map((str) => str.replace(pattern, ""));
}

export function processString(input: string): string {
  const words = input.split(" ");
  const resultWords = words.filter((word) => !word.endsWith("~"));
  return resultWords.join(" ");
}

// tokeniser.ts
export function tokenize(text: string, separator = /\s+/): string[] {
  // 1. Normalise whitespace (spaces, tabs, newlines)
  // 2. Split on the supplied separator (defaults to any whitespace)
  // 3. Remove any empty strings that might result
  return text.trim().split(separator).filter(Boolean);
}

export function wordCount(str: string): number {
  return str.split(" ").length;
}

export function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}
