import { Author } from '../../entities';
import { AuthorService, AuthService, CryptoService } from '../../services';
import { Email } from '../../types/email';
import { UUID } from '../../types/uuid';
import { trimOrNull } from '../../utils';
import { verifyAdminRole } from '../../utils/authorization';
import {
  validateAndNormalizeEmail,
  validateBirthDeathDates,
  validateRequiredFields,
} from '../../validations';

export interface CreateAuthorDependencies {
  authorService: AuthorService;
  authService: AuthService;
  cryptoService: CryptoService;
}

export interface CreateAuthorRequest {
  adminUserId: UUID;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  biography: string;
  nationality: string;
  birthDate: Date;
  deathDate?: Date;
}

export interface CreateAuthorResponse {
  success: boolean;
  message: unknown | string;
  author?: Author;
}

export const createAuthor = async (
  { authorService, authService, cryptoService }: CreateAuthorDependencies,
  request: CreateAuthorRequest
): Promise<CreateAuthorResponse> => {
  const authResult = await verifyAdminRole(authService, request.adminUserId);
  if (!authResult.success) {
    return {
      success: false,
      message: authResult.message,
    };
  }

  const fieldsValidation = validateRequiredFields([
    { value: request.firstName, name: 'First name' },
    { value: request.lastName, name: 'Last name' },
    { value: request.biography, name: 'Biography' },
    { value: request.nationality, name: 'Nationality' },
  ]);

  if (!fieldsValidation.success) {
    return {
      success: false,
      message: fieldsValidation.message,
    };
  }

  if (!request.birthDate) {
    return {
      success: false,
      message: 'Birth date is required',
    };
  }

  const dateValidation = validateBirthDeathDates(request.birthDate, request.deathDate || null);
  if (!dateValidation.success) {
    return {
      success: false,
      message: dateValidation.message,
    };
  }

  let validatedEmail: Email | null = null;
  try {
    validatedEmail = validateAndNormalizeEmail(request.email);
  } catch {
    return {
      success: false,
      message: 'Invalid email format',
    };
  }

  const authorId = await cryptoService.generateUUID();

  const newAuthor: Author = {
    id: authorId,
    firstName: request.firstName.trim(),
    lastName: request.lastName.trim(),
    email: validatedEmail,
    phoneNumber: trimOrNull(request.phoneNumber),
    biography: request.biography.trim(),
    nationality: request.nationality.trim(),
    birthDate: request.birthDate,
    deathDate: request.deathDate || null,
    isPopular: false,
  };

  const savedAuthor = await authorService.save(newAuthor);

  return {
    success: true,
    message: 'Author created successfully',
    author: savedAuthor,
  };
};
