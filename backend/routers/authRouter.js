import Router from 'express';
import { isAuthenticated, login, logout, register, resetOtp, resetPassword, sendpassresetOtp, sentVerfyOtp, verifyOtp, verifyResetOtp } from '../controllers/authController.js';
import { userAuth } from '../midleware/userAuth.js';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/isauthenticated', isAuthenticated);
router.post('/sentotp',userAuth, sentVerfyOtp)
router.post('/verifyotp',userAuth, verifyOtp);
router.post('/resetotp',userAuth, resetOtp);
router.post('/verifyresetotp',userAuth, verifyResetOtp);
router.post('/sentpassresetotp',sendpassresetOtp);
router.post('/verifyresetpassotp', resetPassword);
export default router;