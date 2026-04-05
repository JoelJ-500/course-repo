import { pool } from "../config/db.js";
import fs from "fs";
import path from "path";

export async function GetFile(req, res) {
    const { file_id } = req.query;

    try {

        const [files] = await pool.execute(
                `SELECT * FROM CourseFiles WHERE file_id = '${file_id}'`
        );

        if (files.length === 0) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "File does not exist."
            });
        }

        res.status(200).json({
            status: "success",
            data: files[0]
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

export async function Upload(req, res) {
    if (!req.file) {
        return res.status(400).json({
            status: "error",
            message: "No file provided"
        });
    }

    try {

        let { course_id, display_name, description, category} = req.body;

        if (course_id == '' || !course_id) {
            return res.status(400).json({
                status: "error",
                message: "Please enter a course id"
            });
        }

        if (display_name == '' || !display_name) {
            display_name = req.file.originalname;
        }

        if (description == '' || !description) {
            description = "";
        }

        const validTypes = ['outline', 'midterm_real', 'midterm_mock', 'final_real', 'final_mock', 'misc'];

        if (category == '' || !category) {
            category = null;
        } else if (!validTypes.includes(category)) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Invalid category."
            });
        }

        const [courses] = await pool.execute(
            `SELECT * FROM Courses WHERE course_id = '${course_id}'`
        );

        if (courses.length === 0) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Course does not exist."
            });
        }

        let course_code = courses[0].course_code;

        const folderName = `data/${course_id}_${course_code}/${Date.now()}`; 
        fs.mkdirSync(folderName, { recursive: true });

        const newPath = path.join(folderName, req.file.originalname);
        fs.renameSync(req.file.path, newPath);

        const [result] = await pool.execute(
            `INSERT INTO CourseFiles (course_id, user_id, category, display_name, description, stored_path) VALUES ('${course_id}', '${req.user.user_id}', '${category}', '${display_name}', '${description}', '${newPath}')`
        )

        res.status(200).json({
            status: "success",
            data: [{ id: result.insertId, filename: display_name }],
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

export async function Download(req, res) {
    const file_id = req.params.id;

    try {

        const [files] = await pool.execute(
                `SELECT * FROM CourseFiles WHERE file_id = '${file_id}'`
        );

        if (files.length === 0) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "File does not exist."
            });
        }

        let filePath = files[0].stored_path;

        let fileName = filePath.split('/').pop();

        res.download(filePath, fileName, (err) => {
            if (err) {
                res.status(500).json({
                    status: "error",
                    code: 500,
                    data: [],
                    message: "Internal Server Error",
                });
            }
        })
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

export async function SaveFile(req, res) {

    let { file_id } = req.body;

    try {

        const [files] = await pool.execute(
            `SELECT * FROM CourseFiles WHERE file_id = '${file_id}'`
        );

        if (files.length === 0) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "File does not exist."
            });
        }

        let file = files[0];

        const [saved] = await pool.execute(
            `SELECT * FROM SavedItems WHERE file_id = '${file_id}' AND user_id = '${req.user.user_id}' AND item_type = 'file'`
        )

        if (saved.length > 0) {

            const [result] = await pool.execute(
            `DELETE FROM SavedItems WHERE saved_id = '${saved[0].saved_id}'`
            )

            res.status(200).json({
                status: "success",
                data: [{ file_id: file.file_id }],
                message: "The file has been unsaved.",
            });
            
            return
        }

        const [result] = await pool.execute(
            `INSERT INTO SavedItems (user_id, course_id, file_id, item_type) VALUES ('${req.user.user_id}', '${file.course_id}', '${file.file_id}', 'file')`
        )

        res.status(200).json({
            status: "success",
            data: [{ id: result.insertId, file_id: file.file_id }],
            message: "The file has been saved.",
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
    try {

        const [files] = await pool.execute(
            `SELECT * FROM SavedItems WHERE user_id = '${req.user.user_id}' AND item_type = 'file'`
        );

        res.status(200).json({
            status: "success",
            data: files
        })

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

export async function deleteFile(req, res) {
    const file_id = req.params.id;

    try {

        const [files] = await pool.execute(
            `SELECT * FROM CourseFiles WHERE file_id = '${file_id}'`
        );

        if (files.length === 0) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "File does not exist."
            });
        }

        const file = files[0];

        const [result] = await pool.execute(
            `DELETE FROM CourseFiles WHERE file_id = ${file_id}`
        )

        const [resultSaved] = await pool.execute(
            `DELETE FROM SavedItems WHERE file_id = ${file_id}`
        )


        res.status(200).json({
            status: "success",
            message: `Successfully deleted file ${file.display_name}`
        })

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