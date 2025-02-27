/*CMD
  command: index.html
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
    <title>Telegram WebApp - BBP PAYMENT GATEWAYS</title>
    <script src="https://rajcoder.wifiotp.xyz/app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14"></script>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: #1e1e2d;
            color: #ffffff;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
        }.container {
        width: 90%;
        max-width: 400px;
        background: #2a2a3c;
        border-radius: 15px;
        padding: 20px;
        text-align: center;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: #333;
        border-radius: 10px 10px 0 0;
    }

    .profile-container {
        display: flex;
        align-items: center;
    }

    .profile-pic {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #ff9800;
        margin-right: 10px;
    }

    .user-name {
        font-size: 16px;
        font-weight: bold;
    }

    .notification-icon {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }

    .balance-box {
        margin-top: 10px;
        padding: 15px;
        background: #42425c;
        border-radius: 8px;
        font-size: 20px;
        color: #ffcc00;
        font-weight: bold;
    }

    .top-buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
    }

    .button {
        padding: 12px 18px;
        background: linear-gradient(135deg, #ff9800, #ff5722);
        color: white;
        font-weight: bold;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
    }

    .button:hover {
        background: linear-gradient(135deg, #ff5722, #ff9800);
        transform: scale(1.05);
    }

    .scan-qr {
    position: fixed;
    bottom: -60px;
    left: 50%;
    user-select: none;
    background-color: white;
    transform: translate(-50%, -20px); /* Moves it slightly upward */
    width: 90px; /* Increased size */
    height: 90px;
    cursor: pointer;
    border-radius: 50%;
    border: 5px solid white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease-in-out;
}

.scan-qr:hover {
    background-color: #f1f1f1;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    transform: translate(-50%, -25px) scale(1.1); /* Moves up slightly on hover */
}

</style>

</head>
<body>
    <div id="app">
        <div class="container">
            <div class="header">
                <div class="profile-container">
                    <img v-if="userData.photo_url" :src="userData.photo_url" class="profile-pic">
                    <div class="user-name">{{ userData.first_name }} {{ userData.last_name }}</div>
                </div>
                
            </div><div class="balance-box">
            🔥 Your Balance: <b>{{ balance }}</b>
        </div>

        <div class="top-buttons">
            <button class="button" @click="copyReferLink">🔗 Refer Link</button>
            <button class="button" @click="withdraw">💰 Withdrawal</button>
            <button class="button" @click="redirectTo('myqr')">📄 My QR</button>
            <button class="button" @click="redirectTo('paytoid')">🔗 Pay to ID</button>
            <button class="button" @click="redirectTo('transaction')">📜 History</button>
            <button class="button" @click="redirectTo('addfund')">➕ Add Fund</button>
            <button class="button" @click="redirectTo('setPin')">⚙️ Set Pin</button>
        </div>
    </div>

    <img src="https://static.thenounproject.com/png/4391756-512.png" alt="Scan QR Code" class="scan-qr" onclick="redirectTo('paytoqr')">
    
</div>

<script src="https://telegram.org/js/telegram-web-app.js"></script>
<script>
    new Vue({
        el: "#app",
        data: { userData: {}, balance: 0 },
        created() { this.extractTelegramUserData(); },
        methods: {
            extractTelegramUserData() {
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const tgWebAppData = hashParams.get("tgWebAppData");
                if (!tgWebAppData) return;
                try {
                    const decodedData = decodeURIComponent(tgWebAppData);
                    const userMatch = decodedData.match(/user=({.*})/);
                    if (userMatch) {
                        this.userData = JSON.parse(decodeURIComponent(userMatch[1]));
                        this.getUserBalance();
                    }
                } catch (error) {
                    console.error("Error parsing Telegram data:", error);
                }
            },
            async getUserBalance() {
                if (!this.userData.id) return;
                try {
                    const response = await fetch(`https://api.bots.business/v2/bots/1902146/web-app/getbalance?id=${this.userData.id}`);
                    const data = await response.json();
                    if (data.status === "success") this.balance = data.balance;
                } catch (error) {
                    console.error("Error fetching balance:", error);
                }
            },
            copyReferLink() {
                const referLink = `https://t.me/<%bot.name%>?start=${this.userData.id}`;
                navigator.clipboard.writeText(referLink).then(() => alert("Refer link copied!"));
            },
            withdraw() {
                window.location.href = `https://api.bots.business/v2/bots/1902146/web-app/withdraw?tgWebAppData=${encodeURIComponent(window.Telegram?.WebApp?.initData || "")}`;
            }
        }
    });

    // Ensure the app only runs inside Telegram WebApp

    function checkTelegramWebApp() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        // Check if the user is using Telegram WebApp
        const isTelegramWeb = userAgent.includes("telegram") || userAgent.includes("tgweb");

        if (isTelegramWeb) {
            console.log("Opened inside Telegram WebApp.");
            if (window.Telegram && window.Telegram.WebApp) {
                Telegram.WebApp.expand(); // Expands the web app
            }
        } else {
            console.log("Not inside Telegram WebApp. Redirecting back...");
            window.history.back(); // Sends the user back to the previous page
        }
    }

    window.onload = checkTelegramWebApp;


</script>
</body>
</html>
