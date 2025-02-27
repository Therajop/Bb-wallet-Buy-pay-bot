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
  text: "OPEN WEBAPP",
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


