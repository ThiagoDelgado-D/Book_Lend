export interface DateValidationResult {
  success: boolean;
  message: string;
}

export const validateBirthDeathDates = (
  birthDate: Date,
  deathDate: Date | null
): DateValidationResult => {
  if (deathDate && deathDate <= birthDate) {
    return {
      success: false,
      message: 'Death date must be after birth date',
    };
  }

  return {
    success: true,
    message: 'Dates are valid',
  };
};
