/*CMD
  command: setPin.html
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
    <title>Set or Change PIN</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14"></script>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #1e1e2d, #2a2a3c);
            color: white;
            text-align: center;
            padding: 20px;
        }
        .container {
            max-width: 400px;
            margin: auto;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
        input {
            width: 80%;
            padding: 12px;
            margin: 10px 0;
            border: none;
            border-radius: 8px;
            text-align: center;
            font-size: 18px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            outline: none;
        }
        button {
            padding: 12px 18px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            background: linear-gradient(135deg, #ff9800, #ff5722);
            color: white;
            font-weight: bold;
            margin-top: 10px;
            transition: 0.3s;
        }
        button:hover {
            transform: scale(1.05);
            background: linear-gradient(135deg, #ff5722, #ff9800);
        }
        .back-button {
            background: #ff5722;
        }
    </style>
</head>
<body>
    <div id="app" class="container">
        <h2>{{ hasPin ? "Change Your PIN" : "Set a New PIN" }}</h2>

        <p v-if="step === 1 && hasPin">Enter your current PIN:</p>
        <input v-if="step === 1 && hasPin" type="number" v-model="oldPin" maxlength="4" placeholder="Current PIN">

        <p v-if="step === 2">Enter a new 4-digit PIN:</p>
        <input v-if="step === 2" type="number" v-model="newPin" maxlength="4" placeholder="New PIN">

        <p v-if="step === 2">Confirm your new PIN:</p>
        <input v-if="step === 2" type="number" v-model="confirmPin" maxlength="4" placeholder="Confirm New PIN">

        <button v-if="step === 1 && hasPin" @click="verifyOldPin">Next</button>
        <button v-if="step === 1 && !hasPin" @click="goToStep2">Set PIN</button>
        <button v-if="step === 2" @click="saveNewPin">Save PIN</button>

        <p v-if="pinSet">✅ PIN successfully {{ hasPin ? "changed" : "set" }}!</p>
        <p v-if="pinSet" style="color: red; font-size: 14px;">If you lose your PIN, it cannot be recovered.</p>

        <button class="back-button" @click="goBack">Back</button>
    </div>

    <script>
        new Vue({
            el: "#app",
            data: {
                currentUser: {},
                oldPin: "",
                newPin: "",
                confirmPin: "",
                step: 1,
                pinSet: false,
                hasPin: false,
                existingPin: null
            },
            created() {
                this.getUserDataFromURL();
            },
            methods: {
                async getUserDataFromURL() {
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
                                await this.checkExistingPin();
                            }
                        } catch (error) {
                            console.error("Error parsing Telegram data:", error);
                        }
                    }
                },
                async checkExistingPin() {
                    const userId = this.currentUser.id;
                    if (!userId) return;

                    // Check local storage
                    let storedPin = localStorage.getItem(`${userId}Pin`);
                    
                    // If not found in localStorage, check API
                    if (!storedPin) {
                        try {
                            const response = await fetch(`https://api.bots.business/v2/bots/1902146/web-app/getProp?propname=${userId}Pin`);
                            const data = await response.json();
                            if (data.status === "success" && data.data) {
                                storedPin = data.data;
                                localStorage.setItem(`${userId}Pin`, storedPin);
                            }
                        } catch (error) {
                            console.error("Error fetching PIN:", error);
                        }
                    }

                    if (storedPin) {
                        this.hasPin = true;
                        this.existingPin = storedPin;
                    }
                },
                verifyOldPin() {
                    if (this.oldPin.length !== 4) {
                        alert("Please enter a valid 4-digit PIN.");
                        return;
                    }
                    if (this.oldPin !== this.existingPin) {
                        alert("Incorrect PIN. Please try again.");
                        return;
                    }
                    this.step = 2;
                },
                goToStep2() {
                    this.step = 2;
                },
                async saveNewPin() {
                    if (this.newPin.length !== 4 || this.confirmPin.length !== 4) {
                        alert("PIN must be exactly 4 digits.");
                        return;
                    }
                    if (this.newPin !== this.confirmPin) {
                        alert("PINs do not match!");
                        return;
                    }

                    const userId = this.currentUser.id;
                    if (!userId) {
                        alert("User ID not found!");
                        return;
                    }

                    try {
                        // Save to API
                        const response = await fetch(`https://api.bots.business/v2/bots/1902146/web-app/saveProp?propname=${userId}Pin&propdata=${this.newPin}&type=int`);
                        const result = await response.json();
                        
                        if (result.status === "success") {
                            // Save to local storage
                            localStorage.setItem(`${userId}Pin`, this.newPin);
                            this.pinSet = true;
                            this.hasPin = true;
                            alert(`✅ PIN successfully ${this.hasPin ? "changed" : "set"}!`);
                        } else {
                            alert("Error saving PIN. Please try again.");
                        }
                    } catch (error) {
                        console.error("Error saving PIN:", error);
                        alert("An error occurred while saving your PIN.");
                    }
                },
                goBack() {
                    window.history.back();
                }
            }
        });
    </script>
</body>
</html>
