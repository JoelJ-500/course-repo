import { pool } from "../config/db.js";
import bcrypt from "bcrypt"

/**
 * @route POST auth/register
 */

export async function Register(req, res) {
    let { username, password } = req.body;

    username = username.toLowerCase();

    console.log(username);

    try {
        const [existingUsers] = await pool.execute(
            `SELECT * FROM Users WHERE username = '${username}'`
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                status: "failed",
                data: [],
                message: "There is already an account with this username."
            });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.execute(
            `INSERT INTO Users (username, password_hash) VALUES ('${username}', '${hashedPassword}')`,
        );

        res.status(200).json({
            status: "success",
            data: [{ id: result.insertId, username }],
            message: "Your account has been created.",
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