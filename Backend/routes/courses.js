import express from "express";
import { check } from "express-validator";
import { Verify } from "../middleware/verify.js";
import Validate from "../middleware/validate.js";
import { CreateCourse, GetCourse, GetRecent, GetSaved, SearchCourses } from "../controllers/courses.js";

const router = express.Router();

router.get("/",
    check("course_code")
        .not()
        .isEmpty()
        .withMessage("Please enter a course code")
        .trim()
        .escape(),
    Verify, Validate, GetCourse);

router.post("/create",
    check("course_code")
        .not()
        .isEmpty()
        .withMessage("Please enter a course code")
        .trim()
        .escape(),
    check("course_title")
        .not()
        .isEmpty()
        .withMessage("Please enter a course title")
        .trim()
        .escape(),
    check("professor_name")
        .not()
        .isEmpty()
        .withMessage("Please enter a professor name")
        .trim()
        .escape(),
    check("university_name")
        .not()
        .isEmpty()
        .withMessage("Please enter a university name")
        .trim()
        .escape(),
    Verify, Validate, CreateCourse);

router.get("/saved", Verify, Validate, GetSaved);

router.get("/recent", Verify, Validate, GetRecent);

router.get("/search", Verify, Validate, SearchCourses);

export default router;