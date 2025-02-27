/*CMD
  command: savebalance
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

// Ensure options exist and extract parameters safely
let params = options?.web_app || options || {};

// Extract id and amount from parameters
let id = params.id;
let amount = parseFloat(params.amount); // Ensure amount is a valid number

// Validate id and amount
if (!id || isNaN(amount) || amount <= 0) {
  return WebApp.render({
    content: {
      status: "error",
      msg: "Invalid parameters. Provide a valid user id and amount."
    },
    mime_type: "application/json"
  });
}

// Access user's balance using ResourcesLib
let balance = Libs.ResourcesLib.anotherChatRes("balance", id);

// Add amount to balance
balance.add(amount);

// Retrieve updated balance
let newBalance = balance.value() ?? 0;

// Prepare user data for leaderboard

return WebApp.render({
  content: {
    status: "success",
    newbalance: newBalance
  },
  mime_type: "application/json"
});
