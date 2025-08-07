import { Router, type Router as ExpressRouter } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticateToken, authRateLimit } from '../middlewares/auth.middleware.js';

const router: ExpressRouter = Router();

router.use(authRateLimit);

router.post('/send-verification', authController.sendEmailVerification);

router.get('/verify-token/:token', authController.verifyEmailToken);

router.post('/complete-registration', authController.completeRegistration);

router.post('/login', authController.login);

router.post('/refresh', authenticateToken, authController.refreshToken);

router.get('/profile', authenticateToken, authController.getProfile);

export { router as authRoutes };
