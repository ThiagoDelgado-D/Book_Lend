export interface FieldValidationResult {
  success: boolean;
  message: string;
}

export const validateRequiredField = (
  value: string | undefined | null,
  fieldName: string
): FieldValidationResult => {
  if (!value || value.trim() === '') {
    return {
      success: false,
      message: `${fieldName} is required`,
    };
  }

  return {
    success: true,
    message: 'Field is valid',
  };
};

export const validateRequiredFields = (
  fields: Array<{ value: string | undefined | null; name: string }>
): FieldValidationResult => {
  for (const field of fields) {
    const result = validateRequiredField(field.value, field.name);
    if (!result.success) {
      return result;
    }
  }

  return {
    success: true,
    message: 'All fields are valid',
  };
};
