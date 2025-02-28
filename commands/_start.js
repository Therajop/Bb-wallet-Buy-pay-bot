/*CMD
  command: /start
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var userId = user.telegramid; var referrer = params; // Get the referral ID from the link

 var url = WebApp.getUrl({ command: "index" });

if (params == userId) { Api.sendMessage({ text: "OPEN WEBAPP", reply_markup: { inline_keyboard: [ [ { text: "Open App", web_app: { url: url } } ] ] } }); } else {
  var joinedUsers = Bot.getProp("joined_users") || {}; var userRewards = Bot.getProp("user_rewards") || {};

if (joinedUsers[userId]) { Api.sendMessage({ text: "OPEN WEBAPP", reply_markup: { inline_keyboard: [ [ { text: "Open App", web_app: { url: url } } ] ] } }); } else {  joinedUsers[userId] = true; Bot.setProp("joined_users", joinedUsers, "json");

Api.sendMessage({
  text: "🔥 Welcome to BB Point Bot\nHello Sir,\nI'm your **BB Payment Bot 🤖**\n\nHere you can **Pay, Buy, Withdraw & Refer BB Points** with full **PIN Security 🔑**\n\n✅ Features:\n➤ Pay BB Point to Anyone\n➤ Buy BB Point at Cheap Rate\n➤ Instant Withdrawal\n➤ QR Scan Payment\n➤ Refer & Earn\n\nUse the **Open WebApp** button to Explore 🔥\nLet's Get Started 🚀!",
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [
      [
        { text: "Open App", web_app: { url: url } }
      ]
    ]
  }
});

// Notify the referrer if exists and give reward
if (referrer) {
  userRewards[referrer] = (userRewards[referrer] || 0) + 1;
  Bot.setProp("user_rewards", userRewards, "json");

  Api.sendMessage({
    chat_id: referrer,
    text: "You have referred a new user!"
  });

  let balance = Libs.ResourcesLib.anotherChatRes("balance", referrer);
  // Add amount to balance
  balance.add(1);
}

} }


