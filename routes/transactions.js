import express from "express";
import pool from "../config/connection.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.use(checkAuth);

router.get("/", async (req, res) => {
    const {role, username} = req.user;
    try {
        let result;
        if (role === "customer") {
            const customerId = (await pool.query(
                `SELECT id
                 FROM users
                 WHERE username = ($1)`,
                [username]
            )).rows[0].id;

            result = await pool.query(
                `SELECT t.id,
                        t.type,
                        (SELECT username FROM users WHERE id = t.from_id) AS from_name,
                        (SELECT username FROM users WHERE id = t.to_id)   AS to_name,
                        t.amount
                 FROM transactions t
                 WHERE t.from_id = ($1)
                    or t.to_id = ($2)
                 ORDER BY t.transaction_date`,
                [customerId, customerId]
            );
        } else {
            result = await pool.query(
                `SELECT t.id,
                        t.type,
                        (SELECT username FROM users WHERE id = t.from_id) AS from_name,
                        (SELECT username FROM users WHERE id = t.to_id)   AS to_name,
                        t.amount
                 FROM transactions t
                 ORDER BY t.transaction_date`,
            );
        }
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post("/", async (req, res) => {
    const {from_id, to_id, amount, type} = req.body;
    const client = await pool.connect();
    try {
        await client.query(
            "INSERT INTO transactions (type, from_id, to_id, amount) VALUES ($1, $2, $3, $4)",
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