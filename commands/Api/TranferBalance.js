/*CMD
  command: TranferBalance
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

// Extract required parameters
let fromId = params?.fromId;
let toId = params?.toId;
let amount = parseFloat(params?.amount);

// Validate input parameters
if (!fromId || !toId || isNaN(amount) || amount <= 0) {
  return WebApp.render({
    content: {
      status: "error",
      msg: "Invalid parameters. Provide valid sender ID, recipient ID, and amount."
    },
    mime_type: "application/json"
  });
}

// Prevent self-transfer
if (fromId === toId) {
  return WebApp.render({
    content: {
      status: "error",
      msg: "❌ You cannot transfer your own balance to your own ID!"
    },
    mime_type: "application/json"
  });
}

// Access sender's balance
let senderBalance = Libs.ResourcesLib.anotherChatRes("balance", fromId);
if (!senderBalance) {
  return WebApp.render({
    content: {
      status: "error",
      msg: "Sender's balance not found."
    },
    mime_type: "application/json"
  });
}

// Get sender's current balance safely
let senderCurrentBalance = parseFloat(senderBalance.value() || 0);
if (isNaN(senderCurrentBalance) || senderCurrentBalance < 0) {
  senderCurrentBalance = 0;
}

// Check if sender has sufficient balance
if (senderCurrentBalance < amount) {
  return WebApp.render({
    content: {
      status: "error",
      msg: `Insufficient balance. Available: ${senderCurrentBalance}, Required: ${amount}`
    },
    mime_type: "application/json"
  });
}

// Access recipient's balance
let recipientBalance = Libs.ResourcesLib.anotherChatRes("balance", toId);
if (!recipientBalance) {
  return WebApp.render({
    content: {
      status: "error",
      msg: "Recipient's balance not found."
    },
    mime_type: "application/json"
  });
}

// Transfer amount
senderBalance.remove(amount);  // Deduct from sender
recipientBalance.add(amount);  // Add to recipient

// Retrieve updated balances
let newSenderBalance = parseFloat(senderBalance.value() || 0);
let newRecipientBalance = parseFloat(recipientBalance.value() || 0);

// Return success response
return WebApp.render({
  content: {
    status: "success",
    msg: `✅ Transferred ${amount} from ${fromId} to ${toId}.`,
    senderBalance: newSenderBalance,
    recipientBalance: newRecipientBalance
  },
  mime_type: "application/json"
});
