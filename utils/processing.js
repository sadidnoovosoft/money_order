import {
    getBalance,
    getJobs,
    setBalance,
    updateStatus,
    formatDataToHTML,
    getEmailContent,
    getReceiverDetails,
} from "./helpers.js";
import Email from "../config/emailConfig.js";

async function processJobs() {
    const jobs = await getJobs();
    for (const job of jobs) {
        if (job.type === "email") {
            await processEmail(job);
        } else if (job.type === "deposit") {
            await processDeposit(job);
        } else if (job.type === "withdraw") {
            await processWithdraw(job);
        } else if (job.type === "transfer") {
            await processTransfer(job);
        }
    }
}

async function processDeposit(transaction) {
    const {id, to_id} = transaction;
    const amount = parseInt(transaction.amount);

    const toBalance = await getBalance(to_id);
    await setBalance(to_id, toBalance + amount);
    await updateStatus(id, 'processed');
}

async function processWithdraw(transaction) {
    const {id, from_id} = transaction;
    const amount = parseInt(transaction.amount);

    const fromBalance = await getBalance(from_id);
    if (fromBalance < amount) {
        await updateStatus(id, 'failed');
        return;
    }
    await setBalance(from_id, fromBalance - amount);
    await updateStatus(id, 'processed');
}

async function processTransfer(transaction) {
    const {id, from_id, to_id} = transaction;
    const amount = parseInt(transaction.amount);

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

async function processEmail({id, receiver_id, row_count}) {
    const emailContent = await getEmailContent(receiver_id, row_count);
    const htmlTable = formatDataToHTML(emailContent);
    const details = await getReceiverDetails(receiver_id);

    const email = new Email(details.email, details.username, htmlTable);
    await email.sendMail();
    await updateStatus(id, 'sent');
}

export default processJobs;