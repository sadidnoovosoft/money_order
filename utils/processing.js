import {getBalance, getTransactions, setBalance, updateStatus} from "./helpers.js";

async function processTransaction() {
    const rows = await getTransactions();
    for (const transaction of rows) {
        await processSingleTransaction(transaction);
    }
}

async function processSingleTransaction(transaction) {
    const {id, to_id, from_id, type} = transaction;
    const amount = parseInt(transaction.amount);

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

export default processTransaction;