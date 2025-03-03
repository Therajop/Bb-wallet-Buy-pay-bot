# BB Wallet Buy & Pay Bot (Beta)  
**Version: 1.0.0**  

---
*Note - The add fund Option (addfund.html.js)only work for Indian (INR) PAY THROUGH INR(UPI)*
## 🔥 Features  
- ✅ Pay BB Point to anyone using their Telegram ID with **PIN security**  [Paytoid.html.js]
- 💰 Buy BB Points at **Cheap Rate** (Default ₹1 = 2 BB Points)  [addfund.html.js]
- 📲 QR Scan Payment System  in [Paytoqr.html.js]
- 🔒 Set & Change Payment PIN  [Setpin.html.js]
- 💸 Withdraw BB Points Anytime  [withdrawal.html.js]
- 🎯 Refer & Earn (**1 BBP per Refer**)  [index.html.js for get link]
- 📄 Full Transaction History  [Transactions.html.js]
- 🔗 My QR - Accept Payments through Your QR Code  [myqr.html.js]

---

## 💪 How It Works  
1. **Set Your PIN** (Required for Payment & Withdrawal)  
2. **Add Funds** by paying money  
3. Use **Payto ID** to pay others or **Scan QR**  
4. Refer your friends & Earn BB Points  
5. Withdraw your BB Points anytime  

---

## ⚙️ Setup  
### 1. Webpage Setup  
- Go to `webpage/` folder  
- Edit all HTML & JS files  
- Replace your **BOT ID** in every file  

### 2. API Setup  
- Go to `api/` folder  
- Add your **Bot Token**  
- Adjust webhook URL according to your hosting  

### 3. Rate Setup  
- Default: ₹1 = **2 BB Points**  
- Change this in:  
  - `webpage/addfund.html`  
  - `webpage/js/main.js`  

---

## 🔑 PIN System  
| Action    | Description         |  
|-----------|-------------------|  
| Set Pin   | Set your Payment PIN |  
| Change Pin| Update your PIN anytime |  
| Security  | Payment & Withdrawal requires PIN |  

---

## 💰 BB Point Rates  
| Amount (₹) | BB Points |  
|------------|-----------|  
| 1₹         | 2 BB Points |  
| 10₹        | 20 BB Points |  
| 100₹       | 200 BB Points |  

---

## 🤝 Refer & Earn  
- Share your **Referral Link**  
- Get **1 BB Point** per referral *(You can change this from Start Command)*  

---

## 📄 History  
See all your transactions in the **History** page with date & time.  

---

## 🛠️ Developer Setup  
| File               | Description        |  
|------------------|-------------------|  
| `webpage/addfund.html` | BB Point Rate Setup |  
| `api/`      | API Code & Webhook |  
| `webpage/SetPin.html` | PIN System |  

---

## 📌 How to Install  
1. import this repo in bb 
2. Set token from BotFather
3. follow all Process 
4. Start Bot with **/start**  

---

## 🚀 Developer  
**@Thecoder_Raj**  
BB Webapp Contest 2025  

---

## ⚠️ Disclaimer  
This is a **Beta Version**. Any loss of BB Points due to bugs will not be refunded.  

---

### 🎯 contact me for Updates  
[@Thecoder_Raj](https://t.me/Thecoder_raj)



# Bb_webapp_bot - chat bot
It is repository for chat bot: [@Bb_webapp_bot](https://t.me/Bb_webapp_bot)

## What it is?
This repository can be imported to [Bots.Business](https://bots.business) as a worked chat bot.

[Bots.Business](https://bots.business) - it is probably the first CBPaaS - Chat Bot Platform as a Service.

A CBPaaS is a cloud-based platform that enables developers to create chatbots without needing to build backend infrastructure.

## Create your own bot for Telegram from this Git repo

How to create bot?
1. Create bot with [@BotFather](https://telegram.me/BotFather) and take Secret Token
2. Create bot in App and add Secret Token
3. Add Public Key from App as [Deploy key](https://developer.github.com/v3/guides/managing-deploy-keys/#deploy-keys) with read access (and write access for bot exporting if you need it)
4. Do import for this git repo

Now you can talk with yours new Telegram Bot

See [more](https://help.bots.business/getting-started)

## Commands - in commands folder
File name - it is command name (Bot it can be rewritten in command description)

Command can have: `name`, `help`, `aliases` (second names), `answer`, `keyboard`, `scnarios` (for simple logic) and other options.

### Command description
It is file header:

    /*CMD
      command: /test
      help: this is help for ccommand
      need_reply: [ true or false here ]
      auto_retry_time: [ time in sec ]
      answer: it is example answer for /test command
      keyboard: button1, button2
      aliases: /test2, /test3
    CMD*/

See [more](https://help.bots.business/commands)

### Command body
It is command code in JavaScript.
Use Bot Java Script for logic in command.

For example:
> Bot.sendMessage(2+2);

See [more](https://help.bots.business/scenarios-and-bjs)


## Libraries - in libs folder
You can store common code in the libs folder. File name - it is library name.

For example code in myLib.js:

    function hello(){ Bot.sendMessage("Hello from lib!") }
    function goodbye(name){ Bot.sendMessage("Goodbye, " + name) }

    publish({
      sayHello: hello,
      sayGoodbyeTo: goodbye
    })

then you can run in any bot's command:

    Libs.myLib.hello()
    Libs.myLib.sayGoodbyeTo("Alice")

See [more](https://help.bots.business/git/library)

## Other bots example
See other bots examples in the [github](https://github.com/bots-business?utf8=✓&tab=repositories&q=&type=public&language=javascript) or in the [Bot Store](https://bots.business/)


## Other help
[Help.bots.business](https://help.bots.business)

## API
See [API](https://api.bots.business/docs#/docs/summary)


![](https://bots.business/images/web-logo.png)
