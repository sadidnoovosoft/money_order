import {getTransactions, processSingleTransaction} from "./helpers.js";

async function processTransaction() {
    const rows = await getTransactions();
    rows.forEach(transaction => {
        processSingleTransaction(transaction);
    });
}

export default processTransaction;