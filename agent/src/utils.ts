/**
 * Check if a value is valid (not empty, not "undefined", not undefined, and exists).
 */
export function isValidField(value: any): boolean {
  return value !== undefined && value !== null && value !== '' && value !== 'undefined';
}
