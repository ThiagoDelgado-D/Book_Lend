import { UserRole } from '../entities';
import { AuthService } from '../services';
import { UUID } from '../types';

export interface AuthorizationResult {
  success: boolean;
  message: string;
}

export const verifyAdminRole = async (
  authService: AuthService,
  userId: UUID
): Promise<AuthorizationResult> => {
  const user = await authService.findById(userId);

  if (!user) {
    return {
      success: false,
      message: 'User not found',
    };
  }

  if (user.role !== UserRole.ADMIN) {
    return {
      success: false,
      message: 'Access denied. Admin role required',
    };
  }

  return {
    success: true,
    message: 'Authorization successful',
  };
};
