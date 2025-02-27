/*CMD
  command: getProp
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

let propname = options?.propname; // Get prop name from URL parameter

if (!propname) {
  return WebApp.render({
    content: {
      status: "error",
      msg: "Missing 'propname' parameter"
    },
    mime_type: "application/json"
  });
}

let data = Bot.getProperty(propname) || null; // Fetch data or return null if not found

return WebApp.render({
  content: {
    status: "success",
    data: data
  },
  mime_type: "application/json"
});

