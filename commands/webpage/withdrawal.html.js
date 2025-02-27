/*CMD
  command: withdrawal.html
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

<!DOCTYPE html><html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Withdraw BB Points</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Poppins', sans-serif; }
        body {
            display: flex; justify-content: center; align-items: center;
            height: 100vh; background: linear-gradient(135deg, #6a11cb, #2575fc);
        }
        .container {
            background: #fff; padding: 30px; border-radius: 12px;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
            max-width: 400px; width: 100%;
            display: flex; flex-direction: column;
        }
        h3 { color: #333; margin-bottom: 15px; text-align: center; }
        .balance { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .input-field {
            width: 100%; padding: 10px;
            font-size: 16px; border: 1px solid #ccc; border-radius: 5px;
            margin-bottom: 15px;
        }
       .btn {
    width: 100%; 
    background-color: #007bff; 
    color: white;
    padding: 10px; 
    border: none; 
    border-radius: 5px;
    cursor: pointer; 
    font-size: 16px;
    margin-top: 10px; /* Adds space between buttons */
}

.btn:hover { 
    background-color: #0056b3; 
}
        .status-message {
            margin-top: 15px; padding: 10px;
            text-align: center; font-weight: bold;
        }
        .success { color: green; }
        .error { color: red; }
    </style>
</head>
<body>
<div id="app">
    <div class="container">
        <h3>Withdraw BB Points</h3>
        <div class="balance">Balance: {{ balance }} BB Points</div>
        <input type="number" v-model="withdrawAmount" class="input-field" placeholder="Enter withdrawal amount">
        <button @click="withdraw" class="btn">Withdraw</button>
        <button @click="goBack" class="btn">⬅ Back</button>
        <div v-if="statusMessage" :class="['status-message', statusClass]">{{ statusMessage }}</div>
    </div>
</div>
<script>
    new Vue({
        el: "#app",
        data: {
            currentUser: { id: null, firstName: "" },
            balance: 0,
            withdrawAmount: '',
            statusMessage: '',
            statusClass: ''
        },
        mounted() {
            this.getUserDataFromURL();
        },
        methods: {
            getUserDataFromURL() {
                const params = new URLSearchParams(window.location.search);
                const tgWebAppData = params.get("tgWebAppData");
                if (tgWebAppData) {
                    try {
                        const decodedData = decodeURIComponent(tgWebAppData);
                        const userMatch = decodedData.match(/"id"\s*:\s*(\d+)/);
                        const firstNameMatch = decodedData.match(/"first_name"\s*:\s*"([^"]+)"/);
                        if (userMatch) {
                            this.currentUser.id = userMatch[1];
                        }
                        if (firstNameMatch) {
                            this.currentUser.firstName = firstNameMatch[1];
                        }
                        this.fetchBalance();
                    } catch (error) {
                        console.error("Error decoding user data.", error);
                    }
                }
            },
            fetchBalance() {
                if (!this.currentUser.id) return;
                const balanceApiUrl = `https://api.bots.business/v2/bots/1902146/web-app/getbalance?id=${this.currentUser.id}`;
                fetch(balanceApiUrl, { headers: { 'Cache-Control': 'no-cache' } })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "success") {
                            this.balance = data.balance;
                        } else {
                            this.setStatus("Error fetching balance.", "error");
                        }
                    })
                    .catch(error => {
                        console.error("API Error:", error);
                        this.setStatus("Error fetching balance.", "error");
                    });
            },
            withdraw() {
                const amount = parseFloat(this.withdrawAmount);
                if (!amount || amount <= 0) {
                    this.setStatus("Enter a valid withdrawal amount!", "error");
                    return;
                }
                if (amount > this.balance) {
                    this.setStatus("Insufficient balance!", "error");
                    return;
                }
                const apiUrl = `https://api.bots.business/v2/bots/1902146/web-app/TranferBbPoint?to_tg_id=${this.currentUser.id}&amount=${amount}`;
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "success") {
                            this.setStatus("Withdrawal Successful!", "success");
                            this.saveTransactionHistory(amount);
                            this.fetchBalance();
                        } else {
                            this.setStatus(data.message || "Withdrawal failed!", "error");
                        }
                    })
                    .catch(error => {
                        console.error("API Error:", error);
                        this.setStatus("API Error: " + error, "error");
                    });
            },
            saveTransactionHistory(amount) {
                const historyUrl = `https://api.bots.business/v2/bots/1902146/web-app/saveHistory?owner_id=${this.currentUser.id}&type=withdraw&from=${encodeURIComponent(this.currentUser.firstName)}&to=Withdraw&amount=${amount}`;
                fetch(historyUrl, { method: 'GET' })
                    .then(response => response.json())
                    .then(data => console.log("Transaction history saved:", data))
                    .catch(error => console.error("Error saving transaction history:", error));
            },
            setStatus(message, statusClass) {
                this.statusMessage = message;
                this.statusClass = statusClass;
            },
            goBack() {
                const params = new URLSearchParams(window.location.search);
                const tgWebAppData = params.get("tgWebAppData");
                const redirectUrl = tgWebAppData ? `https://api.bots.business/v2/bots/1902146/web-app/index#tgWebAppData=${encodeURIComponent(tgWebAppData)}` : "/index";
                window.location.href = redirectUrl;
            }
        }
    });
</script>
</body>
</html>
