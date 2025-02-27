/*CMD
  command: transaction.html
  help: 
  need_reply: false
  auto_retry_time: 
  folder: webpage

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction History</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Poppins', sans-serif; }
        body {
            display: flex; justify-content: center; align-items: center;
            height: 100vh; background: linear-gradient(135deg, #6a11cb, #2575fc); padding: 20px;
        }
        .container {
            background: #fff; padding: 20px; border-radius: 12px;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
            text-align: center; max-width: 500px; width: 100%;
        }
        h3 { color: #333; margin-bottom: 10px; }
        .search-box {
            width: 100%; padding: 8px; border: 1px solid #ccc;
            border-radius: 6px; margin-bottom: 10px;
        }
        .filter-buttons {
            display: flex; justify-content: space-between; margin-bottom: 15px;
        }
        .filter-btn {
            flex: 1; padding: 10px; border: none; cursor: pointer;
            background: #ddd; color: #333; border-radius: 5px; margin: 0 5px; font-size: 14px;
        }
        .filter-btn.active { background: #007bff; color: white; }
        .history {
            max-height: 300px; overflow-y: auto; text-align: left;
            background: #f8f9fa; padding: 10px; border-radius: 6px;
        }
        .history-item {
            padding: 10px; border-bottom: 1px solid #ddd; font-size: 14px;
            display: flex; justify-content: space-between; align-items: center;
        }
        .history-item span { font-weight: bold; }
        .credit { color: green; }
        .debit { color: red; }
        .arrow {
            font-size: 18px; font-weight: bold; margin-left: 5px;
        }
        .back-btn {
            background-color: #007bff; color: white; padding: 10px 15px;
            border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 10px;
        }
        .back-btn:hover { background-color: #0056b3; }
    </style>
</head>
<body>
<div class="container">
    <h3>Transaction History</h3>
    <input type="text" class="search-box" placeholder="Search transactions..." onkeyup="searchTransactions()">

    <div class="filter-buttons">
        <button class="filter-btn active" onclick="filterTransactions('all')">All</button>
        <button class="filter-btn" onclick="filterTransactions('sent')">Sent</button>
        <button class="filter-btn" onclick="filterTransactions('received')">Received</button>
        <button class="filter-btn" onclick="filterTransactions('deposit')">Deposit</button>
    </div>

    <div class="history" id="transaction-list">Loading transactions...</div>

    <button onclick="goBack()" class="back-btn">⬅ Back</button>
</div>

<script>
    let userId = null;
    let transactions = [];

    function getUserIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    const tgWebAppData = params.get("tgWebAppData");

    if (tgWebAppData) {
        try {
            const decodedData = decodeURIComponent(tgWebAppData); // First decode
            const urlParams = new URLSearchParams(decodedData);
            const userJson = urlParams.get("user");

            if (userJson) {
                const user = JSON.parse(decodeURIComponent(userJson)); // Second decode
                userId = user.id;
                console.log("Extracted User ID:", userId);
                fetchTransactions();
            }
        } catch (error) {
            console.error("Error decoding user data:", error);
        }
    }
}

    function fetchTransactions() {
        if (!userId) return;

        fetch(`https://api.bots.business/v2/bots/1902146/web-app/getProp?propname=${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success" && data.data.length > 0) {
                    transactions = data.data.reverse(); // Newest first
                    displayTransactions(transactions);
                } else {
                    document.getElementById("transaction-list").innerHTML = "No transactions found.";
                }
            })
            .catch(error => {
                console.error("Error fetching transactions:", error);
                document.getElementById("transaction-list").innerHTML = "Failed to load transactions.";
            });
    }

    function displayTransactions(filteredList) {
        const container = document.getElementById("transaction-list");
        container.innerHTML = "";

        if (filteredList.length === 0) {
            container.innerHTML = "No transactions found.";
            return;
        }

        filteredList.forEach(tx => {
            const isCredit = ["bonus", "credit", "deposit", "received"].includes(tx.type.toLowerCase());
            const arrow = isCredit ? "↓" : "↑";
            const colorClass = isCredit ? "credit" : "debit";

            const div = document.createElement("div");
            div.classList.add("history-item");
            div.innerHTML = `
                <div>
                    <span class="${colorClass}">${arrow} ${tx.type}</span><br>
                    Amount: <strong>${tx.amount}</strong><br>
                    ${isCredit ? `From <strong>${tx.from}</strong>` : `To <strong>${tx.to}</strong>`}
                </div>
                <small>${tx.date}</small>
            `;
            container.appendChild(div);
        });
    }

    function filterTransactions(type) {
        document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
        event.target.classList.add("active");

        if (type === "all") {
            displayTransactions(transactions);
        } else {
            const filtered = transactions.filter(tx => tx.type.toLowerCase() === type.toLowerCase());
            displayTransactions(filtered);
        }
    }

    function searchTransactions() {
        const searchQuery = document.querySelector(".search-box").value.toLowerCase();
        const filtered = transactions.filter(tx => 
            tx.type.toLowerCase().includes(searchQuery) || 
            tx.amount.includes(searchQuery) ||
            tx.from.toLowerCase().includes(searchQuery) ||
            tx.to.toLowerCase().includes(searchQuery)
        );
        displayTransactions(filtered);
    }

    function goBack() {
        window.history.back();
    }

    window.onload = getUserIdFromURL;
</script>
</body>
</html>
