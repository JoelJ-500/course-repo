import { pool } from "../config/db.js";
import fs from "fs";
import path from "path";

export async function Upload(req, res) {
    if (!req.file) {
        return res.status(400).json({
            status: "error",
            message: "No file provided"
        });
    }

    try {

        let { course_code, display_name } = req.body;

        console.log(course_code);

        if (course_code == '' || !course_code) {
            return res.status(400).json({
                status: "error",
                message: "Please enter a course code"
            });
        }

        if (display_name == '' || !display_name) {
            return res.status(400).json({
                status: "error",
                message: "Please enter a display name"
            });
        }

        const folderName = `data/${course_code}/${Date.now()}`; 
        fs.mkdirSync(folderName, { recursive: true });

        const newPath = path.join(folderName, req.file.originalname);
        fs.renameSync(req.file.path, newPath);

        const [courses] = await pool.execute(
            `SELECT * FROM Courses WHERE course_code = '${course_code}'`
        );

        if (courses.length === 0) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Course does not exist."
            });
        }

        let course_id = courses[0].course_id;

        const [result] = await pool.execute(
            `INSERT INTO CourseFiles (course_id, user_id, display_name, stored_path) VALUES ('${course_id}', '${req.user.user_id}', '${display_name}', '${newPath}')`
        )

        res.status(200).json({
            status: "success",
            data: [{ id: result.insertId, filepath: newPath }],
            message: "The file has been uploaded.",
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }

    

    
}

export async function GetSaved(req, res) {
    res.status(501).json({
        status: "error",
        code: 501,
        message: "Not implemented"
    });
}
