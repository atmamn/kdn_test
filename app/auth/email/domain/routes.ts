import { Router } from "express";
import { loginUserViaEmail } from "../api/login";
import { createOTP } from "../api/createOTP";
import { verifyOTP } from "../api/verifyOTP";
import { getUserEmail } from "../api/getUserEmail";
import { logout } from "../api/logout";
import { forgotPassword } from "../api/forgotPassword";

const router = Router();

router.post("/create-otp", createOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUserViaEmail);
router.get("/get-user-email", getUserEmail);
router.post("/forgot-password", forgotPassword);
router.get("/logout", logout);

export default router;
