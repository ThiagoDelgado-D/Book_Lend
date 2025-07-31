import { Author } from '../../entities';
import { AuthorService, AuthService } from '../../services';
import { Email, UUID } from '../../types';
import { trimOrDefault, trimOrNull } from '../../utils';
import { verifyAdminRole } from '../../utils/authorization';
import { validateAndNormalizeEmail, validateBirthDeathDates } from '../../validations';

export interface UpdateAuthorDependencies {
  authorService: AuthorService;
  authService: AuthService;
}

export interface UpdateAuthorRequest {
  adminUserId: UUID;
  authorId: UUID;
  firstName?: string;
  lastName?: string;
  email?: Email;
  phoneNumber?: string;
  biography?: string;
  nationality?: string;
  birthDate?: Date;
  deathDate?: Date;
  isPopular?: boolean;
}

export interface UpdateAuthorResponse {
  success: boolean;
  message: string;
  author?: Author;
}

export const updateAuthor = async (
  { authorService, authService }: UpdateAuthorDependencies,
  request: UpdateAuthorRequest
): Promise<UpdateAuthorResponse> => {
  const authResult = await verifyAdminRole(authService, request.adminUserId);
  if (!authResult.success) {
    return {
      success: false,
      message: authResult.message,
    };
  }

  const existingAuthor = await authorService.findById(request.authorId);
  if (!existingAuthor) {
    return {
      success: false,
      message: 'Author not found',
    };
  }

  const newBirthDate = request.birthDate || existingAuthor.birthDate;
  const newDeathDate =
    request.deathDate !== undefined ? request.deathDate : existingAuthor.deathDate;

  const dateValidation = validateBirthDeathDates(newBirthDate, newDeathDate);
  if (!dateValidation.success) {
    return {
      success: false,
      message: dateValidation.message,
    };
  }

  let validatedEmail: Email | null | undefined = existingAuthor.email;
  if (request.email !== undefined) {
    try {
      validatedEmail = validateAndNormalizeEmail(request.email);
    } catch {
      return {
        success: false,
        message: 'Invalid email format',
      };
    }
  }

  const updatedAuthor: Author = {
    ...existingAuthor,
    firstName: trimOrDefault(request.firstName, existingAuthor.firstName),
    lastName: trimOrDefault(request.lastName, existingAuthor.lastName),
    email: validatedEmail,
    phoneNumber:
      request.phoneNumber !== undefined
        ? trimOrNull(request.phoneNumber)
        : existingAuthor.phoneNumber,
    biography: trimOrDefault(request.biography, existingAuthor.biography),
    nationality: trimOrDefault(request.nationality, existingAuthor.nationality),
    birthDate: newBirthDate,
    deathDate: newDeathDate,
    isPopular: request.isPopular !== undefined ? request.isPopular : existingAuthor.isPopular,
  };

  const savedAuthor = await authorService.save(updatedAuthor);

  return {
    success: true,
    message: 'Author updated successfully',
    author: savedAuthor,
  };
};
