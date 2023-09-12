// Get all customers
function getCustomers() {
    fetch(`${baseURL}/users/customers`)
        .then(response => response.json())
        .then(users => {
            Array.from(document.getElementsByTagName("select")).forEach(selectElement => {
                addCustomersToDropdown(users, selectElement);
            })
        })
}

getCustomers();

function addCustomersToDropdown(users, selectElement) {
    users.forEach(user => {
        const option = document.createElement("option");
        option.text = user.username;
        option.value = user.id;
        selectElement.add(option);
    })
}


// Post transaction
async function postTransaction(formData) {
    const objectData = Object.fromEntries(formData.entries());
    try {
        const response = await fetch(`${baseURL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objectData)
        });

        const data = await response.json();
        if (response.ok) {
            console.log(data);
        } else {
            throw new Error(data.message);
        }

    } catch (error) {
        console.log(error);
    }
}

document.getElementById("deposit-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    formData.set("type", "deposit");

    await postTransaction(formData);
    fetchTransactionHistory();
    this.reset();
});

document.getElementById("withdraw-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    formData.set("type", "withdraw");

    await postTransaction(formData);
    fetchTransactionHistory();
    this.reset();
});

document.getElementById("transfer-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    formData.set("type", "transfer");

    if (formData.get("from_id") === formData.get("to_id")) {
        alert("Transfer should be between two distinct account")
        return;
    }

    await postTransaction(formData);
    fetchTransactionHistory();
    this.reset();
});


// Get Transaction History
function fetchTransactionHistory() {
    fetch(`${baseURL}/transactions`)
        .then(response => response.json())
        .then(transactions => addTransactionsToTable(transactions));
}

fetchTransactionHistory();

function addTransactionsToTable(transactions) {
    const oldTableBody = document.getElementById("history").getElementsByTagName("tbody")[0];
    const newTableBody = document.createElement("tbody");

    transactions.forEach(transaction => {
        const tr = document.createElement("tr");
        tr.id = transaction.id;
        tr.appendChild(getCell(transaction.type));
        tr.appendChild(getCell(transaction.from_name));
        tr.appendChild(getCell(transaction.to_name));
        tr.appendChild(getCell(transaction.amount));
        newTableBody.appendChild(tr);
    })

    function getCell(text) {
        const cell = document.createElement("td");
        cell.innerText = text;
        return cell;
    }

    oldTableBody.parentNode.replaceChild(newTableBody, oldTableBody);
    scrollToBottom("table-wrapper");
}

window.onload = async function () {
    const currentUser = await getCurrentUser();
    if (currentUser.role === "customer") {
        document.querySelector(".transaction-container").remove();
    }
}