import express from "express";
import { Verify } from "../middleware/verify.js";
import Validate from "../middleware/validate.js";
import { CreateCourse, GetRecent, GetSaved, SearchCourses } from "../controllers/courses.js";

const router = express.Router();

router.post("/", Verify, Validate, CreateCourse);

router.get("/saved", Verify, Validate, GetSaved);

router.get("/recent", Verify, Validate, GetRecent);

router.get("/search", Verify, Validate, SearchCourses);

export default router;