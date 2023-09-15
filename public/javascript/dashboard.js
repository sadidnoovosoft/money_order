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
        await fetch(`${baseURL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objectData)
        });
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
setInterval(() => fetchTransactionHistory(), 15000)

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
        tr.appendChild(getCell(transaction.status));
        newTableBody.appendChild(tr);
    })

    function getCell(text) {
        const cell = document.createElement("td");
        cell.innerText = text;
        return cell;
    }

    oldTableBody.parentNode.replaceChild(newTableBody, oldTableBody);
    scrollToBottom(".table-wrapper");
}


// Send email
document.getElementById('email-form').addEventListener("submit", function (e) {
    e.preventDefault();

    const rowCount = document.getElementById("rowCount").value;
    const isChecked = document.getElementById("all").checked;

    fetch(`${baseURL}/email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({rows: isChecked ? null : rowCount})
    })
        .then(response => response.json())
        .then(() => fetchEmailHistory())
        .catch(err => console.log(err));

    this.reset();
})

// Rows input should be disabled when checkbox is checked
document.getElementById("all").addEventListener("click", function () {
    document.getElementById("rowCount").disabled = this.checked;
})


// Displaying email table to customers
function fetchEmailHistory() {
    console.log("hi hi")
    fetch(`${baseURL}/email`)
        .then(response => response.json())
        .then(emailList => addToEmailsTable(emailList));
}

function addToEmailsTable(emailList) {
    console.log(emailList)
    const oldTableBody = document.getElementById("email").getElementsByTagName("tbody")[0];
    const newTableBody = document.createElement("tbody");

    emailList.forEach(email => {
        const tr = document.createElement("tr");
        tr.id = email.id;
        tr.appendChild(getCell(email.email));
        tr.appendChild(getCell(email.row_count || "All"));
        tr.appendChild(getCell(email.status));
        newTableBody.appendChild(tr);
    })

    function getCell(text) {
        const cell = document.createElement("td");
        cell.innerText = text;
        return cell;
    }

    oldTableBody.parentNode.replaceChild(newTableBody, oldTableBody);
    scrollToBottom("#email-table");
}

window.onload = async function () {
    const currentUser = await getCurrentUser();
    if (currentUser.role === "customer") {
        console.log("hi")
        document.getElementById("admin-container").remove();
        fetchEmailHistory();
        setInterval(() => fetchEmailHistory(), 15000)
    } else {
        document.getElementById("email").remove();
        getCustomers();
    }
}