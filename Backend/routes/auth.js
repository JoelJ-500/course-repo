import express from "express";
import { Register, Login } from "../controllers/auth.js";
import Validate from "../middleware/validate.js";
import { check } from "express-validator";

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
        .isLength({ min: 6 })
        .withMessage("Must be at least 6 chars long"),
    Validate,
    Register
);

// POST auth/login
router.post(
    "/login",
    check("username")
        .not()
        .isEmpty()
        .withMessage("Please enter a valid username")
        .trim()
        .escape(),
    check("password")
        .notEmpty()
        .withMessage("Please enter a password"),
    Validate,
    Login
)


export default router;
