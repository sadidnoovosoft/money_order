import express from "express";
import bcrypt from "bcrypt";
import pool from "../connection.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    const {username, password} = req.body;
    try {

        const result = await pool.query("SELECT * FROM users WHERE username=($1)", [username]);
        if (result.rows.length !== 0) {
            return res.status(409).json({
                "status": "fail",
                "message": "User already present!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO users (username, role, password) VALUES ($1, $2, $3)",
            [username, "admin", hashedPassword]
        );
        res.status(200).json({
            "status": "success",
            "message": "User registered successfully!"
        })

    } catch (error) {
        res.status(500).json({error});
    }
})

export default router;