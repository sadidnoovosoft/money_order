import pool from "../config/connection.js";

// Function to format transactions into an HTML table
function formatDataToHTML(transactions) {
    const style = '"border: 1px solid black; padding: 8px;"';
    let htmlTable = `<table style="border: 1px solid black;">`;

    // Create table header row
    htmlTable += '<tr>';
    htmlTable += `<td style=${style} >Type</th>`;
    htmlTable += `<td style=${style} >From</th>`;
    htmlTable += `<td style=${style} >To</th>`;
    htmlTable += `<td style=${style} >Amount</th>`;
    htmlTable += '</tr>';

    // Create table rows with transaction data
    transactions.forEach(({id, type, from_name, to_name, amount}) => {
        htmlTable += `<tr id=${id}>`;
        htmlTable += `<td style=${style} >${type}</td>`;
        htmlTable += `<td style=${style} >${from_name ? from_name : ''}</td>`;
        htmlTable += `<td style=${style} >${to_name ? to_name : ''}</td>`;
        htmlTable += `<td style=${style} >${amount}</td>`;
        htmlTable += `</tr>`;
    })
    htmlTable += '</table>';

    return htmlTable;
}

async function getTransactions() {
    const result = await pool.query(
        `SELECT *
         FROM transactions
         WHERE status = ($1)
         ORDER BY transaction_date
         LIMIT 10`,
        ['pending']
    );
    return result.rows;
}

async function getBalance(userId) {
    const result = await pool.query(
        `SELECT balance
         FROM users
         WHERE id = ($1)`,
        [userId]
    );
    return parseInt(result.rows[0]['balance']);
}

async function setBalance(userId, newBalance) {
    await pool.query(
        `UPDATE users
         SET balance = ($1)
         WHERE id = ($2)`,
        [newBalance, userId]
    );
}

async function updateTransactionStatus(transactionId, newStatus) {
    await pool.query(
        `UPDATE transactions
         SET status = ($1)
         WHERE id = ($2)`,
        [newStatus, transactionId]
    );
}

async function getEmails() {
    const result = await pool.query(
        `SELECT *
         FROM emails
         WHERE status = ($1)
         ORDER BY created_at
         LIMIT 10`,
        ['pending']
    );
    return result.rows;
}

async function getEmailContent(customerId, row_count) {
    const result = await pool.query(
        `SELECT *
         FROM (SELECT t.id,
                      t.type,
                      (SELECT username FROM users WHERE id = t.from_id) AS from_name,
                      (SELECT username FROM users WHERE id = t.to_id)   AS to_name,
                      t.amount,
                      t.transaction_date
               FROM transactions t
               WHERE t.from_id = ($1)
                  or t.to_id = ($2)
               ORDER BY t.transaction_date DESC` + `${row_count ? ' LIMIT ' + row_count : ''}) sub`
        + ` ORDER BY sub.transaction_date ASC`,
        [customerId, customerId]
    );
    return result.rows;
}

async function getReceiverDetails(receiver_id) {
    const result = await pool.query(
        `SELECT username, email
         FROM users
         WHERE id = ($1)`,
        [receiver_id]
    )
    return result.rows[0];
}

async function updateEmailStatus(id, newStatus) {
    await pool.query(
        `UPDATE emails
         SET status = ($1)
         WHERE id = ($2)`,
        [newStatus, id]
    );
}

export {
    formatDataToHTML,
    getTransactions,
    getBalance,
    setBalance,
    updateTransactionStatus,
    updateEmailStatus,
    getEmails,
    getEmailContent,
    getReceiverDetails
};