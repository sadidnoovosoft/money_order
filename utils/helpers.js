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

async function updateStatus(transactionId, newStatus) {
    await pool.query(
        `UPDATE transactions
         SET status = ($1)
         WHERE id = ($2)`,
        [newStatus, transactionId]
    );
}

async function processSingleTransaction({id, type, from_id, to_id, amount}) {
    if (type === 'deposit') {
        const toBalance = await getBalance(to_id);
        await setBalance(to_id, toBalance + amount);
        await updateStatus(id, 'processed');
    } else if (type === 'withdraw') {
        const fromBalance = await getBalance(from_id);
        if (fromBalance < amount) {
            await updateStatus(id, 'failed');
            return;
        }
        await setBalance(from_id, fromBalance - amount);
        await updateStatus(id, 'processed');
    } else {
        const fromBalance = await getBalance(from_id);
        const toBalance = await getBalance(to_id);
        if (fromBalance < amount) {
            await updateStatus(id, 'failed');
            return;
        }
        await setBalance(from_id, fromBalance - amount);
        await setBalance(to_id, toBalance + amount);
        await updateStatus(id, 'processed');
    }
}

export {
    formatDataToHTML, getTransactions, getBalance,
    setBalance, updateStatus, processSingleTransaction
};