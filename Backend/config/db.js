import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from "./index.js";

export let pool;

export const initDB = async () => {
    try {
        const con = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        multipleStatements: true
        });

        await con.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME};`);
        await con.query(`USE ${DB_NAME};`);

        const schemaPath = path.join(import.meta.dirname, '../CP476.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await con.query(schema);

        console.log("Database loaded");

        await con.end();

        pool = mysql.createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME
        });

    } catch (err) {
        throw err;
    }


}