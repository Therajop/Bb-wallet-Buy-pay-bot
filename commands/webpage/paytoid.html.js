/*CMD
  command: paytoid.html
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
    <title>Transfer Balance</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Poppins', sans-serif; }
        body {
            display: flex; justify-content: center; align-items: center;
            height: 100vh; background: linear-gradient(135deg, #6a11cb, #2575fc);
        }
        .container {
            background: #fff; padding: 25px; border-radius: 12px;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
            text-align: center; max-width: 400px; width: 100%;
        }
        h3 { color: #333; margin-bottom: 10px; }
        input, button {
            width: 100%; padding: 12px; margin: 10px 0;
            border-radius: 6px; font-size: 16px;
        }
        input { border: 2px solid #ddd; text-align: center; }
        button {
            background: #28a745; border: none; color: white; cursor: pointer; transition: 0.3s;
        }
        button:hover { background: #218838; }
        .user-info { margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 6px; text-align: left; }
        .back-btn {
            background-color: #007bff; color: white; padding: 10px 15px;
            border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 10px;
        }
        .back-btn:hover { background-color: #0056b3; }
        .popup {
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: white; padding: 30px;
            border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            text-align: center; width: 320px;
        }
        .popup h3 { margin-bottom: 15px; }
        .popup input {
            font-size: 20px; text-align: center; width: 100%;
            border: 2px solid #ddd; padding: 10px; border-radius: 6px;
        }
        .popup .close-btn {
            position: absolute; top: 10px; right: 15px;
            background: none; border: none; font-size: 20px;
            cursor: pointer; color: #666;
        }
        .popup .close-btn:hover { color: #000; }
        .error { color: red; margin-top: 10px; }
    </style>
</head>
<body>
<div id="app">
    <div class="container">
        <h3>Transfer Balance</h3>
        <p><strong>Logged in as:</strong> {{ currentUser.name }} (ID: {{ currentUser.id }})</p>
        <input type="text" v-model="userId" placeholder="Enter Telegram ID">
        <button @click="fetchUserInfo"><i class="fas fa-search"></i> Check User</button>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

        <div v-if="userInfo" class="user-info">
            <p><strong>Name:</strong> {{ userInfo.name }}</p>
            <p><strong>Username:</strong> {{ userInfo.username }}</p>
            <p><strong>ID:</strong> {{ userInfo.id }}</p>
            <input type="number" v-model="amount" placeholder="Enter Amount">
            <button @click="checkPin"><i class="fas fa-wallet"></i> Confirm & Pay</button>
        </div>
        <button @click="goBack" class="back-btn">⬅ Back</button>
    </div>

    <!-- PIN Popup -->
    <div class="popup" v-if="showPinPopup">
        <button class="close-btn" @click="closePopup">&times;</button>
        <h3>Enter PIN</h3>
        <input type="text" v-model="enteredPin" inputmode="numeric" pattern="[0-9]*" placeholder="****" maxlength="4">
        <button @click="validatePin">Submit</button>
        <div v-if="pinError" class="error">{{ pinError }}</div>
    </div>
</div>

<script>
    new Vue({
        el: "#app",
        data: {
            currentUser: { id: null, name: "Guest" },
            userId: "",
            userInfo: null,
            amount: "",
            errorMessage: "",
            enteredPin: "",
            storedPin: "",
            showPinPopup: false,
            pinError: ""
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
                        const urlParams = new URLSearchParams(decodedData);
                        const userJson = urlParams.get("user");
                        if (userJson) {
                            const user = JSON.parse(decodeURIComponent(userJson));
                            this.currentUser = { id: user.id, name: user.first_name || "Unknown" };
                        }
                    } catch (error) {
                        this.errorMessage = "Error decoding user data.";
                    }
                }
            },
            async fetchUserInfo() {
                if (!this.userId) {
                    this.errorMessage = "Please enter a valid ID.";
                    return;
                }
                try {
                    const response = await fetch(`https://api.telegram.org/bot<%bot.token%>/getChat?chat_id=${this.userId}`);
                    const data = await response.json();
                    if (data.ok) {
                        this.userInfo = {
                            name: data.result.first_name || "Unknown",
                            username: data.result.username ? `@${data.result.username}` : "No username",
                            id: data.result.id
                        };
                    } else {
                        this.errorMessage = "User not found.";
                    }
                } catch (error) {
                    this.errorMessage = "Error fetching user data.";
                }
            },
            async checkPin() {
                const response = await fetch(`https://api.bots.business/v2/bots/1902146/web-app/getProp?propname=${this.currentUser.id}Pin`, {
                    headers: { 'Cache-Control': 'no-cache' }
                });
                const data = await response.json();
                if (data.data) {
                    this.storedPin = data.data;
                    this.showPinPopup = true;
                } else {
                    alert("You need to set a PIN first.");
                }
            },
            validatePin() {
                if (this.enteredPin === this.storedPin) {
                    this.processPayment();
                } else {
                    this.pinError = "Incorrect PIN.";
                }
            },
            async processPayment() {
                const apiUrl = `https://api.bots.business/v2/bots/1902146/web-app/TranferBalance?fromId=${this.currentUser.id}&amount=${this.amount}&toId=${this.userInfo.id}`;
                try {
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    if (data.status === "success") {
                        await this.saveHistory();
                        await this.saveReceiverHistory();
                        alert("Payment Successful!");
                    } else {
                        alert("Payment Failed.");
                    }
                } catch (error) {
                    alert("Error processing payment.");
                }
                this.showPinPopup = false;
            },
            async saveHistory() {
                await fetch(`https://api.bots.business/v2/bots/1902146/web-app/saveHistory?owner_id=${this.currentUser.id}&from=${this.currentUser.name}&to=${this.userInfo.name}&amount=${this.amount}&type=Sent&status=Success`);
            },
            async saveReceiverHistory() {
                await fetch(`https://api.bots.business/v2/bots/1902146/web-app/saveHistory?owner_id=${this.userInfo.id}&from=${this.userInfo.name}&to=${this.currentUser.name}&amount=${this.amount}&type=Received&status=Success`);
            },
            closePopup() { this.showPinPopup = false; },
            goBack() { window.history.back(); }
        }
    });
</script>
</body>
</html>
