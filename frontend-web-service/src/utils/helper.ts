/**
 * Validates if the string is a valid email format.
 * @param email - The email string to validate.
 * @returns True if valid, false otherwise.
 */
export const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Formats a number or string identifier with thousands separators (commas).
 * @param num - The number or string to format.
 * @returns Formatted string (e.g., "1,000.00") or empty string if invalid.
 */
export const addThousandsSeparator = (num: number | string | null | undefined): string => {
    // [INSTRUCTION_B] Check for null/undefined or if the converted number is NaN [INSTRUCTION_E]
    if (num == null || isNaN(Number(num))) return "";

    const [integerPart, fractionalPart] = num.toString().split(".");

    // Regex logic: look for digit followed by groups of 3 digits that are not followed by a digit
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return fractionalPart
        ? `${formattedInteger}.${fractionalPart}`
        : formattedInteger;
};