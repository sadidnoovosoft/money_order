import express from "express";
import pool from "../config/connection.js";
import checkAuth from "../middlewares/checkAuth.js";
import adminAuthorization from "../middlewares/adminAuthorization.js";

const router = express.Router();

router.use(checkAuth);

router.get("/", async (req, res) => {
    const {role, username} = req.user;
    const {limit, offset} = req.query;
    let paramIndex = 2;

    try {
        let query = `SELECT t.id,
                            t.type,
                            (SELECT username FROM users WHERE id = t.from_id) AS from_name,
                            (SELECT username FROM users WHERE id = t.to_id)   AS to_name,
                            t.amount,
                            t.status
                     FROM jobs t
                     WHERE type != ($1)`;
        const sqlParams = ["email"];

        if (role === "customer") {
            const customerId = (await pool.query(
                `SELECT id
                 FROM users
                 WHERE username = ($1)`,
                [username]
            )).rows[0].id;

            query += ` AND (t.from_id = ($${paramIndex})
                     or t.to_id = ($${paramIndex}))`;
            sqlParams.push(customerId);
            paramIndex += 1;
        }
        query += ` ORDER BY t.created_at DESC`;

        if (limit) {
            query += ` LIMIT ($${paramIndex})`;
            sqlParams.push(limit);
            paramIndex += 1;
        }
        if (offset) {
            query += ` OFFSET ($${paramIndex})`;
            sqlParams.push(offset);
        }

        const result = await pool.query(query, sqlParams);
        res.status(200).json(result.rows);

    } catch
        (error) {
        console.log(error)
        res.status(500).json(error);
    }
})

router.post("/", adminAuthorization, async (req, res) => {
    const {from_id, to_id, amount, type} = req.body;

    const client = await pool.connect();
    try {
        await client.query(
            "INSERT INTO jobs (type, from_id, to_id, amount) VALUES ($1, $2, $3, $4)",
            [type, from_id, to_id, amount]);

        res.status(200).json({
            "status": "success", "message": "Transaction Completed!"
        })

    } catch (error) {
        res.status(500).json(error);
    } finally {
        client.release();
    }
})

export default router;