import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../connection.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    const {username, email, password} = req.body;
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM users WHERE email=($1)", [email]);
        if (result.rows.length !== 0) {
            return res.status(409).json({
                "status": "fail", "message": "Email already registered!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Transaction
        await client.query('BEGIN');
        await client.query(
            "INSERT INTO users (username, role, email, password) VALUES ($1, $2, $3, $4)",
            [username, "admin", email, hashedPassword]);
        await client.query('COMMIT');

        res.status(200).json({
            "status": "success", "message": "User registered successfully!"
        })

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json(error);
    } finally {
        client.release();
    }
})

router.post('/login', async (req, res) => {
    const {username, email, password} = req.body;
    const client = await pool.connect();
    try {
        const result = await client.query("select * from users where email=($1)", [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({"message": "Incorrect Credentials"});
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({"message": "Incorrect Credentials"});
        }

        const token = jwt.sign({username, email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('access_token', token, {
            httpOnly: true
        }).status(200).json({
            "message": "Login successful", "username": username
        });

    } catch (error) {
        res.status(500).send(error);
    } finally {
        client.release();
    }
})

export default router;