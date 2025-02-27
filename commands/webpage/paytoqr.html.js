/*CMD
  command: paytoqr.html
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
    <title>QR Code Scan & Pay</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js"></script>
    <script src="https://unpkg.com/html5-qrcode"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Poppins', sans-serif; }
        body {
            display: flex; justify-content: center; align-items: center;
            height: 100vh; background: linear-gradient(135deg, #ff7eb3, #ff758c);
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
        input { border: 2px solid #ddd; }
        button {
            background: #ff5e78; border: none; color: white; cursor: pointer;
        }
        button:hover { background: #ff405f; }
        .user-info { margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 6px; text-align: left; }
        .back-btn { background-color: #007bff; color: white; padding: 10px 15px; border-radius: 5px; cursor: pointer; }
        .back-btn:hover { background-color: #0056b3; }
        #reader { width: 300px; margin: auto; }
        .hidden { display: none; }
    </style>
</head>
<body>
<div id="app">
    <div class="container">
        <h3>QR Code Scanner</h3>
        <div id="reader" v-if="!scannedId"></div>
        <p v-if="scannedId"><strong>Scanned ID:</strong> {{ scannedId }}</p>

        <div v-if="scannedId">
            <h3>Transfer Balance</h3>
            <p><strong>Name:</strong> {{ userInfo.name }}</p>
            <p><strong>ID:</strong> {{ userInfo.id }}</p>
            <input type="number" v-model="amount" placeholder="Enter Amount">
            <input type="text" v-model="pin" inputmode="numeric" pattern="[0-9]*" placeholder="****" maxlength="4">
            <button @click="confirmPayment"><i class="fas fa-wallet"></i> Confirm & Pay</button>
        </div>
        <button @click="goBack" class="back-btn">⬅ Back</button>
    </div>
</div>

<script>
    new Vue({
        el: "#app",
        data: {
            scannedId: null,
            userInfo: {},
            amount: "",
            pin: "",
            errorMessage: "",
            currentUser: { id: null, name: "Guest" }
        },
        mounted() {
            this.getUserDataFromURL();
            let html5QrCode = new Html5Qrcode("reader");
            html5QrCode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                this.onScanSuccess,
                this.onScanFailure
            );
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
            onScanSuccess(decodedText) {
                this.scannedId = decodedText;
                document.getElementById("reader").classList.add("hidden");
                this.fetchUserInfo();
            },
            onScanFailure(error) {
                console.warn(`QR Scan Error: ${error}`);
            },
            async fetchUserInfo() {
                try {
                    const response = await fetch(`https://api.telegram.org/bot<%bot.token%>/getChat?chat_id=${this.scannedId}`);
                    const data = await response.json();
                    if (data.ok) {
                        this.userInfo = {
                            name: data.result.first_name || "Unknown",
                            id: data.result.id
                        };
                    } else {
                        this.errorMessage = "User not found.";
                    }
                } catch (error) {
                    this.errorMessage = "Error fetching user data.";
                }
            },
            async validatePin() {
                const pinApiUrl = `https://api.bots.business/v2/bots/1902146/web-app/getProp?propname=${this.currentUser.id}Pin`;
                
                try {
                    const response = await fetch(pinApiUrl);
                    const data = await response.json();
                    if (data.status === "success" && data.data === this.pin) {
                        return true;
                    } else {
                        alert("Invalid PIN. Please try again.");
                        return false;
                    }
                } catch (error) {
                    alert("Error validating PIN.");
                    return false;
                }
            },
            async confirmPayment() {
                if (!this.amount || isNaN(this.amount) || this.amount <= 0) {
                    alert("Enter a valid amount.");
                    return;
                }
                if (!this.pin || this.pin.length !== 4 || isNaN(this.pin)) {
                    alert("Enter a valid 4-digit PIN.");
                    return;
                }

                const isPinValid = await this.validatePin();
                if (!isPinValid) return;

                const fromId = this.currentUser.id;
                const toId = this.userInfo.id;
                const apiUrl = `https://api.bots.business/v2/bots/1902146/web-app/TranferBalance?fromId=${fromId}&amount=${this.amount}&toId=${toId}`;

                try {
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    if (data.status === "success") {
                        this.saveHistory(fromId, this.currentUser.name, this.userInfo.name, this.amount, "Success");
                        this.saveHistory(toId, this.userInfo.name, this.currentUser.name, this.amount, "Received");
                        alert("Payment Successful!");
                    } else {
                        alert("Payment Failed.");
                    }
                } catch (error) {
                    alert("Error processing payment.");
                }
            },
            async saveHistory(Id, fromName, toName, amount, status) {
                await fetch(`https://api.bots.business/v2/bots/1902146/web-app/saveHistory?owner_id=${Id}&from=${fromName}&to=${toName}&amount=${amount}&type=${status}&status=Success`, {
                    method: "get"
                });
            },
            goBack() {
                window.history.back();
            }
        }
    });
</script>
</body>
</html>
