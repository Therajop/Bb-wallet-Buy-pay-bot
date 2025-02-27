/*CMD
  command: myqr.html
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
    <title>QR Code Generator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 20px;
        }
        .popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            text-align: center;
        }
        .popup button {
            margin-top: 10px;
            padding: 10px;
            background: red;
            color: white;
            border: none;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div id="popup" class="popup">
        <img id="qrcode" src="" alt="QR Code">
        <button onclick="window.history.back()">Close</button>
    </div>
    <script>
        let currentUser = { id: "UnknownID", name: "Unknown" };function getUserDataFromURL() {
        const params = new URLSearchParams(window.location.search);
        const tgWebAppData = params.get("tgWebAppData");
        if (tgWebAppData) {
            try {
                const decodedData = decodeURIComponent(tgWebAppData);
                const urlParams = new URLSearchParams(decodedData);
                const userJson = urlParams.get("user");
                if (userJson) {
                    const user = JSON.parse(decodeURIComponent(userJson));
                    currentUser = { id: user.id, name: user.first_name || "Unknown" };
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }
    
    function generateQRCode(id) {
        const qrCodeUrl = `https://api.wifiotp.xyz/Qrcode.php?data=${id}&size=300&file=png`;
        document.getElementById("qrcode").src = qrCodeUrl;
    }
    
    // Fetch user data and generate QR code on load
    getUserDataFromURL();
    generateQRCode(currentUser.id);
</script>

</body>
</html>
