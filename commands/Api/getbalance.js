/*CMD
  command: getbalance
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

let { id } = options || options?.web_app;

if (!id) {
  return WebApp.render({
    content: JSON.stringify({
      status: "error",
      msg: "give parameters"
    }),
    mime_type: "application/json"
  });
}

let balance = Libs.ResourcesLib.anotherChatRes("balance", id).value() || 0;


return WebApp.render({
  content: ({
    status: "success",
    balance: balance
  }),
  mime_type: "application/json"
});

