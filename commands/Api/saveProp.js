/*CMD
  command: saveProp
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

let propname = options?.propname;
let propdata = options?.propdata;
let type = options?.type || "string"; // Default type is string

if (!propname || propdata === undefined) {
  return WebApp.render({
    content: {
      status: "error",
      msg: "Missing 'propname' or 'propdata' parameter"
    },
    mime_type: "application/json"
  });
}

// Set the property in the bot storage
Bot.setProperty(propname, propdata, type);

return WebApp.render({
  content: {
    status: "success",
    message: `Property '${propname}' has been set successfully`,
    propname: propname,
    propdata: propdata,
    type: type
  },
  mime_type: "application/json"
});

