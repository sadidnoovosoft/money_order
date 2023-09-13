import express from "express";

import Email from "../config/emailConfig.js";
import pool from "../config/connection.js";
import checkAuth from "../middlewares/checkAuth.js";
import {formatDataToHTML} from "../utils/helpers.js";

const router = express.Router();

router.use(checkAuth);

router.get("/", async (req, res) => {
    const rowCount = req.query;
    const {email: emailAddress, username} = req.user;

    try {
        const customerId = (await pool.query(
            `SELECT id
             FROM users
             WHERE username = ($1)`,
            [username]
        )).rows[0].id;

        const result = await pool.query(
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

        const htmlTable = formatDataToHTML(result.rows);
        const email = new Email(emailAddress, username, htmlTable);
        email.sendMail();

        res.status(200).json({
            message: "Email sent successfully!"
        })
    } catch (error) {
        res.status(500).json(error);
    }
})

export default router;