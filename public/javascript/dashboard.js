// Get all customers
async function getCustomers() {
    try {
        const users = await callFetch(`${baseURL}/users/customers`);
        Array.from(document.getElementsByTagName("select")).forEach(selectElement => {
            addCustomersToDropdown(users, selectElement);
        });
    } catch (error) {
        console.log(error);
    }
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
    try {
        const objectData = Object.fromEntries(formData.entries());
        await callFetch(`${baseURL}/transactions`, {
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
    await fetchTransactionHistory();
    this.reset();
});

document.getElementById("withdraw-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    formData.set("type", "withdraw");

    await postTransaction(formData);
    await fetchTransactionHistory();
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
    await fetchTransactionHistory();
    this.reset();
});


// Get Transaction History
async function fetchTransactionHistory() {
    try {
        const transactions = await callFetch(`${baseURL}/transactions`);
        addTransactionsToTable(transactions);
    } catch (error) {
        console.log(error);
    }
}

function addTransactionsToTable(transactions) {
    const oldTableBody = document.getElementById("history").getElementsByTagName("tbody")[0];
    const newTableBody = document.createElement("tbody");

    transactions.forEach(({id, type, from_name, to_name, amount, status}) => {
        const tr = document.createElement("tr");
        tr.id = id;
        tr.appendChild(getCell(capitalize(type)));
        tr.appendChild(getCell(capitalize(from_name)));
        tr.appendChild(getCell(capitalize(to_name)));
        tr.appendChild(getCell(amount));
        tr.appendChild(getCell(capitalize(status)));
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
document.getElementById('email-form').addEventListener("submit", async function (e) {
    e.preventDefault();

    const rowCount = document.getElementById("rowCount").value;
    const isChecked = document.getElementById("all").checked;

    try {
        await callFetch(`${baseURL}/emails`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({rows: isChecked ? null : rowCount})
        });
        await fetchEmailHistory();
    } catch (error) {
        console.log(error);
    }
    this.reset();
})

// Rows input should be disabled when checkbox is checked
document.getElementById("all").addEventListener("click", function () {
    document.getElementById("rowCount").disabled = this.checked;
})


// Displaying email table to customers
async function fetchEmailHistory() {
    try {
        const emailList = await callFetch(`${baseURL}/emails`);
        addToEmailsTable(emailList);
    } catch (error) {
        console.log(error);
    }
}

function addToEmailsTable(emailList) {
    const oldTableBody = document.getElementById("email").getElementsByTagName("tbody")[0];
    const newTableBody = document.createElement("tbody");

    emailList.forEach(({id, email, row_count, status}) => {
        const tr = document.createElement("tr");
        tr.id = id;
        tr.appendChild(getCell(email));
        tr.appendChild(getCell(row_count || "All", status === "pending", id));
        tr.appendChild(getCell(capitalize(status)));
        newTableBody.appendChild(tr);
    })

    function getCell(text, contenteditable, emailId) {
        const cell = document.createElement("td");
        cell.innerText = text;
        cell.setAttribute("contenteditable", contenteditable);
        if (contenteditable) {
            cell.addEventListener('keydown', async function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (isNaN(this.textContent) || !this.textContent) {
                        this.textContent = "All";
                    }
                    const {message} = await callFetch(`${baseURL}/emails/${emailId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({rowCount: this.textContent})
                    })
                    await fetchEmailHistory();
                    alert(message);
                }
            })
        }
        return cell;
    }

    oldTableBody.parentNode.replaceChild(newTableBody, oldTableBody);
    scrollToBottom("#email-table");
}

async function init() {
    try {
        const currentUser = await getCurrentUser();

        if (currentUser.role === "customer") {
            document.getElementById("admin-container").remove();
            await fetchEmailHistory();
            setInterval(() => fetchEmailHistory(), 5000);
        } else {
            document.getElementById("email").remove();
            await getCustomers();
        }

        await fetchTransactionHistory();
        setInterval(() => fetchTransactionHistory(), 15000);
    } catch (error) {
        console.log(error);
    }
}

init();