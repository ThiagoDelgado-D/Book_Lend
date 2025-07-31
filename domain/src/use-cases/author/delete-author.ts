import { AuthorService, AuthService } from '../../services';
import { UUID } from '../../types/uuid';
import { verifyAdminRole } from '../../utils';

export interface DeleteAuthorDependencies {
  authorService: AuthorService;
  authService: AuthService;
}

export interface DeleteAuthorRequest {
  adminUserId: UUID;
  authorId: UUID;
}

export interface DeleteAuthorResponse {
  success: boolean;
  message: string;
}

export const deleteAuthor = async (
  { authorService, authService }: DeleteAuthorDependencies,
  request: DeleteAuthorRequest
): Promise<DeleteAuthorResponse> => {
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

  await authorService.delete(request.authorId);

  return {
    success: true,
    message: 'Author deleted successfully',
  };
};
