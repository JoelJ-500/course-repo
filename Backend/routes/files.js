import express from "express";
import { check } from "express-validator";
import { Verify, isAdmin } from "../middleware/verify.js";
import Validate from "../middleware/validate.js";
import upload from "../middleware/upload.js";
import { GetFile, Upload, Download, GetSaved, SaveFile, deleteFile } from "../controllers/file.js";
import fs from "fs";

const router = express.Router();

router.get("/",
    check("file_id")
        .not()
        .isEmpty()
        .withMessage("Please enter a file id")
        .trim()
        .escape(),
    Verify, Validate, GetFile)

router.post("/upload",
    Verify, Validate, (req, res, next) => {
    upload.single('file')(req, res, function (err) {
        if (err) {

            //if an error occurs remove the folder created
            if (req.tempUploadFolder && fs.existsSync(req.tempUploadFolder)) {
                fs.rmSync(req.tempUploadFolder, { recursive: true, force: true });
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

router.post("/save",
    check("file_id")
        .not()
        .isEmpty()
        .withMessage("Please enter a file id")
        .trim()
        .escape(),
    Verify, Validate, SaveFile);


router.get("/saved", Verify, Validate, GetSaved);

router.get("/:id", Verify, Validate, Download);

router.delete("/:id", Verify, Validate, isAdmin, deleteFile);


export default router;