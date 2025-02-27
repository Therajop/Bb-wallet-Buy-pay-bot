/*CMD
  command: TranferBbPoint
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Api

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

let { to_tg_id, amount } = options || options?.web_app;

if (!to_tg_id || !amount) {
  return WebApp.render({
    content: {
      status: "error",
      msg: "Missing parameters: to_tg_id and amount are required"
    },
    mime_type: "application/json"
  });
}

// Ensure amount is a valid number
amount = parseFloat(amount);
if (isNaN(amount) || amount <= 0) {
  return WebApp.render({
    content: {
      status: "error",
      msg: "Invalid amount. Must be a positive number"
    },
    mime_type: "application/json"
  });
}

// Get user balance
let userBalance = Libs.ResourcesLib.anotherChatRes("balance", to_tg_id).value() || 0;

// Check if the user has enough balance
if (userBalance < amount) {
  return WebApp.render({
    content: {
      status: "error",
      msg: "Insufficient balance"
    },
    mime_type: "application/json"
  });
}

// Generate webhook URL for transfer confirmation
let webhookUrl = Libs.Webhooks.getUrlFor({
  command: "onTransfer",
  user_id: to_tg_id
});

// Make transfer request to BB Point bot
HTTP.post({
  url: "https://api.bots.business/v1/bots/14896/new-webhook?&command=onTransferRequest&public_user_token=6cedf6baebcfce9f3386fbcca868ba24&user_id=36805105",
  body: {
    amount: amount,
    to_tg_id: to_tg_id,
    note: "#testTransfer by " + bot.name,
    webhookUrl: webhookUrl,
    secret: "#$@"
  }
});
let CutHere = Libs.ResourcesLib.anotherChatRes("balance", to_tg_id).remove(amount);
//Api.sendMessage({chat_id:to_tg_id,text:'Withdrawal of amount = '+amount+' is successful'})
// Respond with successful status
return WebApp.render({
  content: {
    status: "success",
    msg: "Done"
  },
  mime_type: "application/json"
});

