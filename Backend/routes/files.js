import express from "express";
import { Verify } from "../middleware/verify.js";
import Validate from "../middleware/validate.js";
import { Upload, GetSaved } from "../controllers/file.js";

const router = express.Router();

router.post("/upload", Verify, Validate, Upload);

router.get("/saved", Verify, Validate, GetSaved);

export default router;