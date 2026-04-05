import { pool } from "../config/db.js";

export async function CreateCourse(req, res) {
    let { course_code, course_title, professor_name, university_name } = req.body;

    try {

        const [existingCourses] = await pool.execute(
            `SELECT * FROM Courses WHERE course_code = '${course_code}' AND professor_name = '${professor_name}' AND university_name = '${university_name}'`
        );

        if (existingCourses.length > 0) {
            return res.status(400).json({ 
                    status: "failed",
                    data: [],
                    message: "This course already exists"
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
    let { course_id }  = req.query;

    try {

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
    try {

        const [courses] = await pool.execute(
            `SELECT * FROM SavedItems WHERE user_id = '${req.user.user_id}' AND item_type = 'course'`
        );

        res.status(200).json({
            status: "success",
            data: courses
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

export async function GetRecent(req, res) {
    res.status(501).json({
        status: "error",
        code: 501,
        message: "Not implemented"
    });
}

export async function SearchCourses(req, res) {
    try {
        const { q, university, sortBy } = req.query;

        const sortOptions = {
            "code_asc": "course_code ASC",
            "code_desc": "course_code DESC",
            "newest": "course_id DESC"
        };

        const orderBy = sortOptions[sortBy] || "course_code ASC";

        const queryTerm = `%${q}%`;

        let sql = `SELECT * FROM Courses WHERE (
                        course_code LIKE ? 
                        OR course_title LIKE ? 
                        OR professor_name LIKE ?
                        OR university_name LIKE ?
                    )`;

        const params = [queryTerm, queryTerm, queryTerm, queryTerm];

        if (university) {
            sql += ` AND university_name = ?`;
            params.push(university);
        }

        sql += ` ORDER BY ${orderBy}`;

        const [courses] = await pool.execute(sql, params);

        res.status(200).json({
            status: "success",
            data: courses
        });

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
}

export async function GetCourseFiles(req, res) {
    let { course_id }  = req.query;

    try {

        const [courses] = await pool.execute(
            `SELECT course_id FROM Courses WHERE course_id = '${course_id}'`
        );

        if (courses.length === 0) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Course does not exist."
            });
        }

        const [files] = await pool.execute(
            `SELECT * FROM CourseFiles WHERE course_id = '${course_id}'`
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

export async function SaveCourse(req, res) {
    let { course_id } = req.body;

    try {

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

        const [saved] = await pool.execute(
            `SELECT * FROM SavedItems WHERE course_id = '${course_id}' AND user_id = '${req.user.user_id}' AND item_type = 'course'`
        )

        if (saved.length > 0) {

            const [result] = await pool.execute(
            `DELETE FROM SavedItems WHERE saved_id = '${saved[0].saved_id}'`
            )

            res.status(200).json({
                status: "success",
                data: [{ course_id: courses[0].course_id }],
                message: "The course has been unsaved.",
            });
            
            return
        }

        const [result] = await pool.execute(
            `INSERT INTO SavedItems (user_id, course_id, item_type) VALUES ('${req.user.user_id}', '${course_id}', 'course')`
        )

        res.status(200).json({
            status: "success",
            data: [{ id: result.insertId, course_id: course_id }],
            message: "The Course has been saved.",
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

export async function GetUniversities(req, res) {
    try {

        const [universities] = await pool.execute(
            `SELECT DISTINCT university_name FROM Courses;`
        )

        res.status(200).json({
            status: "success",
            data: universities
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

export async function deleteCourse(req, res) {
    const course_id = req.params.id;

    try {

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

        const course = courses[0];

        const [result] = await pool.execute(
            `DELETE FROM Courses WHERE course_id = ${course_id}`
        )

        const [resultSaved] = await pool.execute(
            `DELETE FROM SavedItems WHERE course_id = ${course_id}`
        )

        res.status(200).json({
            status: "success",
            message: `Successfully deleted course ${course.course_code}`
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