import express from "express";
import { check } from "express-validator";
import { Verify } from "../middleware/verify.js";
import Validate from "../middleware/validate.js";
import upload from "../middleware/upload.js";
import { Upload, GetSaved } from "../controllers/file.js";
import fs from "fs";

const router = express.Router();

router.post("/upload",
    Verify, Validate, (req, res, next) => {
    upload.single('file')(req, res, function (err) {
        if (err) {

            //if an error occurs remove the folder created
            if (req.tempUploadFolder && fs.existsSync(req.tempUploadFolder)) {
                fs.rmSync(req.tempUploadFolder, { recursive: true, force: true });
            }

            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    status: "error",
                    message: "File too large"
            });
            }

            return res.status(400).json({
                status: "error",
                message: err.message
            });
        }
        next();
    });
    }, 
    Upload);

router.get("/saved", Verify, Validate, GetSaved);

export default router;