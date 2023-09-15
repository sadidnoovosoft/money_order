import {
    getBalance,
    getTransactions,
    setBalance,
    updateTransactionStatus,
    getEmails,
    formatDataToHTML,
    getEmailContent,
    getReceiverDetails,
    updateEmailStatus
} from "./helpers.js";
import Email from "../config/emailConfig.js";

async function processTransaction() {
    const rows = await getTransactions();
    for (const transaction of rows) {
        await processSingleTransaction(transaction);
    }
}

async function processEmails() {
    const rows = await getEmails();
    for (const email of rows) {
        await processSingleEmail(email);
    }
}

async function processSingleTransaction(transaction) {
    const {id, to_id, from_id, type} = transaction;
    const amount = parseInt(transaction.amount);

    if (type === 'deposit') {
        const toBalance = await getBalance(to_id);
        await setBalance(to_id, toBalance + amount);
        await updateTransactionStatus(id, 'processed');
    } else if (type === 'withdraw') {
        const fromBalance = await getBalance(from_id);
        if (fromBalance < amount) {
            await updateTransactionStatus(id, 'failed');
            return;
        }
        await setBalance(from_id, fromBalance - amount);
        await updateTransactionStatus(id, 'processed');
    } else {
        const fromBalance = await getBalance(from_id);
        const toBalance = await getBalance(to_id);
        if (fromBalance < amount) {
            await updateTransactionStatus(id, 'failed');
            return;
        }
        await setBalance(from_id, fromBalance - amount);
        await setBalance(to_id, toBalance + amount);
        await updateTransactionStatus(id, 'processed');
    }
}

async function processSingleEmail({id, receiver_id, row_count}) {
    const emailContent = await getEmailContent(receiver_id, row_count);
    const htmlTable = formatDataToHTML(emailContent);
    const details = await getReceiverDetails(receiver_id);

    const email = new Email(details.email, details.username, htmlTable);
    await email.sendMail();
    await updateEmailStatus(id, 'sent');
}

export {processTransaction, processEmails};