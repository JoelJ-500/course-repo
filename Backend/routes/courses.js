import express from "express";
import { check } from "express-validator";
import { Verify, isAdmin } from "../middleware/verify.js";
import Validate from "../middleware/validate.js";
import { CreateCourse, GetCourse, GetRecent, GetSaved, SearchCourses, GetCourseFiles, SaveCourse, GetUniversities, deleteCourse } from "../controllers/courses.js";

const router = express.Router();

router.get("/",
    check("course_id")
        .not()
        .isEmpty()
        .withMessage("Please enter a course code")
        .trim()
        .escape(),
    Verify, Validate, GetCourse
);

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
    Verify, Validate, CreateCourse
);

router.get("/files",
    check("course_id")
        .not()
        .isEmpty()
        .withMessage("Please enter a course id")
        .trim()
        .escape(),
    Verify, Validate, GetCourseFiles
)

router.post("/save",
    check("course_id")
        .not()
        .isEmpty()
        .withMessage("Please enter a course id")
        .trim()
        .escape(),
    Verify, Validate, SaveCourse
)

router.get("/saved", Verify, Validate, GetSaved);

router.get("/recent", Verify, Validate, GetRecent);

router.get("/search",
    check("q")
        .not()
        .isEmpty()
        .withMessage("Please enter a search term")
        .trim()
        .escape(),
    Verify, Validate, SearchCourses);

router.get("/universities", Verify, Validate, GetUniversities);

router.delete("/:id", Verify, Validate, isAdmin, deleteCourse);

export default router;