import { pool } from "../config/db.js";

export async function CreateCourse(req, res) {
    let { course_code, course_title, professor_name, university_name } = req.body;

    try {

        const [existingCourses] = await pool.execute(
            `SELECT * FROM Courses WHERE course_code = '${course_code}'`
        );

        if (existingCourses.length > 0) {
            return res.status(400).json({ 
                    status: "failed",
                    data: [],
                    message: "There is already a course with this course code."
                });
        }

        const [result] = await pool.execute(
            `INSERT INTO Courses (course_code, course_title, professor_name, university_name) VALUES ('${course_code}', '${course_title}', '${professor_name}', '${university_name}')`,
        );

        res.status(200).json({
            status: "success",
            data: [{ id: result.insertId, course_code }],
            message: "The course has been created.",
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

export async function GetCourse(req, res) {
    let { course_code }  = req.body;

    try {

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

        const course = courses[0];

        res.status(200).json({
            status: "success",
            data: course
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

export async function GetSaved(req, res) {
    res.status(501).json({
        status: "error",
        code: 501,
        message: "Not implemented"
    });
}

export async function GetRecent(req, res) {
    res.status(501).json({
        status: "error",
        code: 501,
        message: "Not implemented"
    });
}

export async function SearchCourses(req, res) {
    res.status(501).json({
        status: "error",
        code: 501,
        message: "Not implemented"
    });
}