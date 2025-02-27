/*CMD
  command: saveHistory
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

let owner_id = options?.owner_id;
let type = options?.type;
let amount = options?.amount;
let from = options?.from;
let to = options?.to;

// Get current date and time in Asia/Kolkata
let date = new Intl.DateTimeFormat('en-IN', { 
  timeZone: 'Asia/Kolkata', 
  year: 'numeric', 
  month: '2-digit', 
  day: '2-digit', 
  hour: '2-digit', 
  minute: '2-digit', 
  second: '2-digit' 
}).format(new Date());

if (!owner_id || !type || !amount || !from || !to) {
  return WebApp.render({
    content: {
      status: "error",
      msg: "Missing required parameters (owner_id, type, amount, from, to)"
    },
    mime_type: "application/json"
  });
}

// Fetch existing history or initialize an empty array
let history = Bot.getProperty(owner_id) || [];

// Create new transaction entry
let newEntry = {
  type: type,
  amount: amount,
  from: from,
  to: to,
  date: date
};

// Append new entry to history
history.push(newEntry);

// Save updated history back to the property
Bot.setProperty(owner_id, history, "json");

return WebApp.render({
  content: {
    status: "success",
    message: "Transaction history updated successfully",
    history: history
  },
  mime_type: "application/json"
});

