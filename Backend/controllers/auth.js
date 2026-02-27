import { pool } from "../config/db.js";
import { generateAccessJWT } from "../utils/jwt.js";
import bcrypt from "bcrypt"

// POST auth/register

export async function Register(req, res) {
    let { username, password } = req.body;

    username = username.toLowerCase();

    try {
        const [existingUsers] = await pool.execute(
            `SELECT * FROM Users WHERE username = '${username}'`
        );

        //existingUsers is empty if the user is not already registered
        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                status: "failed",
                data: [],
                message: "There is already an account with this username."
            });
        }
        
        //hash the password
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

// POST auth/login

export async function Login(req, res) {
    const { username, password } = req.body;
    
    try {
        const [users] = await pool.execute(
            `SELECT user_id, username, password_hash, created_at FROM Users WHERE username = '${username}'` 
        );

        if (users.length === 0) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Invalid email or password."
            });
        }

        const user = users[0];

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Invalid email or password."
            });
        }

        let options = {
            maxAge: 24 * 60 * 60 * 1000, //24 hours in milliseconds
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };
        const token = generateAccessJWT(user.user_id);
        res.cookie("SessionID", token, options);

        //remove the password from the user data
        const { password_hash, ...user_data} = user;

        res.status(200).json({
            status: "success",
            data: [user_data],
            message: "You have successfully logged in."
        })
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}

export async function Logout(req, res) {
    try {
        res.clearCookie("SessionID", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });

        res.status(200).json({
            status: "success",
            message: "You have been logged out successfully."
        });
    } catch {
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        })
    }
}