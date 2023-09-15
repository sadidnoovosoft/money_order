import express from "express";

import pool from "../config/connection.js";
import checkAuth from "../middlewares/checkAuth.js";
import customerAuthorization from "../middlewares/customerAuthorization.js";

const router = express.Router();

router.use([checkAuth, customerAuthorization]);

router.post("/", async (req, res) => {
    const {rows} = req.body;
    const rowCount = isNaN(rows) ? null : Number(rows);
    const {username} = req.user;

    try {
        const customerId = (await pool.query(
            `SELECT id
             FROM users
             WHERE username = ($1)`,
            [username]
        )).rows[0].id;

        if (rowCount) {
            await pool.query(
                `INSERT INTO emails (receiver_id, row_count)
                 VALUES (($1), ($2))`,
                [customerId, rowCount]
            );
        } else {
            await pool.query(
                `INSERT INTO emails (receiver_id)
                 VALUES (($1))`,
                [customerId]
            );
        }

        res.status(200).json({
            message: "Email added to queue!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.get("/", async (req, res) => {
    const {username, email} = req.user;
    try {
        const receiver_id = (await pool.query(
            `SELECT id
             FROM users
             WHERE username = ($1)`,
            [username]
        )).rows[0].id;

        const result = await pool.query(
            `SELECT id, ($1) as email, row_count, status
             FROM emails
             WHERE receiver_id = ($2)
             ORDER BY created_at`,
            [email, receiver_id]
        );
        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).send(error);
    }
})

export default router;