import { Router, type Router as ExpressRouter } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticateToken, authRateLimit } from '../middlewares/auth.middleware.js';
import { getAuthDependencies } from '../container/index.js';

const router: ExpressRouter = Router();
const controller = authController(getAuthDependencies());

router.use(authRateLimit);

router.post('/send-verification', controller.sendEmailVerification);

router.get('/verify-token/:token', controller.verifyEmailToken);

router.post('/complete-registration', controller.completeRegistration);

router.post('/login', controller.login);

router.post('/refresh', authenticateToken, controller.refreshToken);

router.get('/profile', authenticateToken, controller.getProfile);

export { router as authRoutes };
