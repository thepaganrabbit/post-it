// src/utils/extractUniqueStrings.ts
/**
 * Extract all strings from an array of string arrays, normalise them
 * to lower case, and return a deduplicated flat array.
 *
 * @param data - The nested string array (e.g. [["html","coffee"],["bath","HTML"]])
 * @returns A flat array of unique, lower‑cased strings.
 */
export function extractUniqueStrings(
  data: string[][]
): string[] {
  // 1. Flatten the nested array
  // 2. Convert each string to lower case
  // 3. Use a Set to dedupe
  // 4. Convert the Set back to an array
  const uniqueSet = new Set(
    data.flatMap((subArr) => subArr.map((s) => s.toLowerCase()))
  );

  return Array.from(uniqueSet);
}