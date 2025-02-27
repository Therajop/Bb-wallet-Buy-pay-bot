/*CMD
  command: onTransfer
  help: 
  need_reply: false
  auto_retry_time: 
  folder: Api

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: /ontransfer
  group: 
CMD*/

let json = JSON.parse(content);

if (json.error) {
  return WebApp.render({
    content: {
      status: "error",
      msg: "Transfer failed: " + json.error.title
    },
    mime_type: "application/json"
  });
}

// Cut user balance after successful withdrawal
//let userBalance = Libs.ResourcesLib.anotherChatRes("balance", user.id);
//userBalance.remove(json.amount);

return WebApp.render({
  content: {
    status: "success",
    msg: "Withdrawal successful"
    ,json:content
    // new_balance: userBalance.value()
  },
  mime_type: "application/json"
});

