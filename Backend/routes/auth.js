import express from "express";
import { Register, Login, Logout } from "../controllers/auth.js";
import Validate from "../middleware/validate.js";
import { check } from "express-validator";
import { Verify } from "../middleware/verify.js";

const router = express.Router();

// POST auth/register
router.post(
    "/register",

    check("username")
        .not()
        .isEmpty()
        .withMessage("Your username is required")
        .trim()
        .escape(),
    check("password")
        .notEmpty()
        .withMessage("Password must be at least 6 characters long")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    Validate,
    Register
);

// POST auth/login
router.post(
    "/login",
    check("username")
        .not()
        .isEmpty()
        .withMessage("Please enter a valid username and password")
        .trim()
        .escape(),
    check("password")
        .notEmpty()
        .withMessage("Please enter a valid username and password"),
    Validate,
    Login
);

router.get("/verify", Verify, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Session successfully verified"
    });
});

router.get("/logout", Logout);

export default router;
