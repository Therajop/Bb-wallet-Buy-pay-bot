/*CMD
  command: addfund.html
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
    <title>Add Funds</title>  
    <style>  
        body {  
            font-family: Arial, sans-serif;  
            text-align: center;  
            background-color: #121212;  
            color: white;  
            padding: 20px;  
        }  
        .qr-container {  
            display: flex;  
            justify-content: center;  
            align-items: center;  
            height: 60vh;  
        }  
        .qr-box {  
            background: white;  
            padding: 20px;  
            border-radius: 10px;  
            box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.2);  
        }  
        .back-button {  
            display: inline-block;  
            padding: 10px 20px;  
            margin: 20px;  
            font-size: 16px;  
            color: white;  
            background: linear-gradient(135deg, #ff416c, #ff4b2b);  
            border: none;  
            border-radius: 8px;  
            cursor: pointer;  
            transition: 0.3s;  
        }  
        .back-button:hover {  
            background: linear-gradient(135deg, #ff4b2b, #ff416c);  
        }  
    </style>  
    <script>  
    function getTelegramUserData() {  
        const params = new URLSearchParams(window.location.search);  
        const tgWebAppData = params.get("tgWebAppData");  
        if (tgWebAppData) {  
            try {  
                const decodedData = decodeURIComponent(tgWebAppData);  
                const userMatch = decodedData.match(/"id"\s*:\s*(\d+)/);  
                const firstNameMatch = decodedData.match(/"first_name"\s*:\s*"([^"]+)"/);  
                return {  
                    id: userMatch ? userMatch[1] : null,  
                    firstName: firstNameMatch ? firstNameMatch[1] : "User"  
                };  
            } catch (error) {  
                console.error("Error parsing Telegram WebApp data:", error);  
            }  
        }  
        return { id: null, firstName: "User" };  
    }  

    const userData = getTelegramUserData();  
    const userId = userData.id;  
    const userName = userData.firstName;  

    if (!userId) {  
        alert("Error: Unable to get Telegram User ID.");  
    }  

    const transactionId = Math.random().toString(36).substr(2, 21).toUpperCase();  
    const qrUrl = `https://api.wifiotp.xyz/Qr.php?vpa=kumarrajvir547@freecharge&name=RAJ&amount=&tid=${transactionId}&tn=${transactionId}`;  
    let paymentProcessed = false;  
    let processedTransactions = new Set(); // Store processed transaction IDs  

    function checkPayment() {  
        if (paymentProcessed) return;  

        const checkUrl = `https://api.wifiotp.xyz/FREECHARGE.php?cookie=app_fc=uE7hVQspD47b02A-fZuobHtBZyad0gaVK_T78TmmtbKZifE1QoTmJXkPIMDsVsmqLKU19mr1uzN5n2-MBJtbPGybY2EvTQodyYV0xEZ-iHMpyRwYlV_AFWrWA2BvDNeg&txnid=${transactionId}&sid=h`;  

        fetch(checkUrl)  
            .then(response => response.json())  
            .then(data => {  
                if (data.status === "SUCCESS") {  
                    if (processedTransactions.has(transactionId)) {  
                        console.log("Transaction ID already used:", transactionId);  
                        return;  
                    }  

                    clearInterval(paymentCheckInterval);  
                    paymentProcessed = true;  
                    processedTransactions.add(transactionId); // Mark transaction as processed  

                    updateBalance(data.amount);  
                    saveTransactionHistory(data.amount);  
                    showSuccessPopup();  
                }  
            })  
            .catch(error => console.error("Error checking payment:", error));  
    }  

    function updateBalance(amount) {  
        const points = amount * 2;  
        const balanceUrl = `https://api.bots.business/v2/bots/1902146/web-app/savebalance?id=${userId}&amount=${points}`;  
          
        fetch(balanceUrl, { method: 'GET' })  
            .then(response => response.json())  
            .then(data => console.log("Balance updated:", data))  
            .catch(error => console.error("Error updating balance:", error));  
    }  

    function saveTransactionHistory(amount) {  
        const historyUrl = `https://api.bots.business/v2/bots/1902146/web-app/saveHistory?owner_id=${userId}&type=deposit&from=Admin&to=${encodeURIComponent(userName)}&amount=${amount}`;  
          
        fetch(historyUrl, { method: 'GET' })  
            .then(response => response.json())  
            .then(data => console.log("Transaction history saved:", data))  
            .catch(error => console.error("Error saving transaction history:", error));  
    }  

    function showSuccessPopup() {  
        const popup = document.createElement("div");  
        popup.style.position = "fixed";  
        popup.style.top = "50%";  
        popup.style.left = "50%";  
        popup.style.transform = "translate(-50%, -50%)";  
        popup.style.background = "rgba(0, 0, 0, 0.8)";  
        popup.style.padding = "20px";  
        popup.style.borderRadius = "10px";  
        popup.style.zIndex = "1000";  

        const img = document.createElement("img");  
        img.src = "https://rajcoder.wifiotp.xyz/Payment/success.gif";  
        img.style.width = "100%";  
        img.style.height = "auto";  

        const closeButton = document.createElement("button");  
        closeButton.innerText = "Close";  
        closeButton.style.marginTop = "10px";  
        closeButton.style.padding = "10px";  
        closeButton.style.background = "red";  
        closeButton.style.color = "white";  
        closeButton.style.border = "none";  
        closeButton.style.cursor = "pointer";  
        closeButton.style.borderRadius = "5px";  
        closeButton.onclick = () => popup.remove();  

        popup.appendChild(img);  
        popup.appendChild(closeButton);  
        document.body.appendChild(popup);  
    }  

    function goBack() {  
        if (window.Telegram && window.Telegram.WebApp) {  
            window.Telegram.WebApp.close();  
        } else {  
            window.history.back();  
        }  
    }  

    const paymentCheckInterval = setInterval(checkPayment, 10000);  
</script>  

<h2>Scan QR to Add Funds</h2>  
<div class="qr-container">  
    <div class="qr-box">  
        <img id="qrCode" src="" alt="QR Code" width="300" height="300">  
    </div>  
</div>  
<button class="back-button" onclick="goBack()">⬅ Back</button>  
<script>  
    document.getElementById("qrCode").src = qrUrl;  
</script>  
</body>  
</html>
