/**
 * Basic email format validation.
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validates a Bangladeshi phone number.
 * Accepts formats: +8801XXXXXXXXX, 01XXXXXXXXX (11 digits starting with 01)
 */
export function validatePhone(phone: string): boolean {
  return /^(\+880|0)1[3-9]\d{8}$/.test(phone.trim());
}

/**
 * Returns true if the string is non-empty after trimming.
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}
