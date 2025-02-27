/*CMD
  command: transaction
  help: 
  need_reply: false
  auto_retry_time: 
  folder: webpage

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// return url for command
// this command have simple template rendering
function getUrl(command){
  return WebApp.getUrl({ command: command })
}

WebApp.render({
   // command "index.html" will be used as page html template
   template: "transaction.html",
   // we can pass vars to template
   
})

