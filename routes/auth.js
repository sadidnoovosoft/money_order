import express from "express";
import bcrypt from "bcrypt";
import pool from "../connection.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    const {username, password} = req.body;
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM users WHERE username=($1)", [username]);
        if (result.rows.length !== 0) {
            return res.status(409).json({
                "status": "fail",
                "message": "User already present!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Transaction
        await client.query('BEGIN');
        await client.query(
            "INSERT INTO users (username, role, password) VALUES ($1, $2, $3)",
            [username, "admin", hashedPassword]
        );
        await client.query('COMMIT');

        res.status(200).json({
            "status": "success",
            "message": "User registered successfully!"
        })

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({error});
    } finally {
        client.release();
    }
})

export default router;