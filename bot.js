var token = process.env.TOKEN;

var Bot = require('node-telegram-bot-api');
var bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
  console.log('environment url->>>'+process.env.HEROKU_URL);
}
else{
  bot = new Bot(token, { polling: true });
}

console.log('bot server started...');

bot.onText(/\/start/, (msg) => {
        var keys = [];
        keys.push({"text":"1","callback_data":"1"});
        keys.push({"text":"2","callback_data":"2"});
        keys.push({"text":"3","callback_data":"3"});
        keys.push({"text":"4","callback_data":"4"});
        keys.push({"text":"5","callback_data":"5"});

        bot.sendMessage(msg.chat.id, "Are you feeling ok?", {
                "parse_mode":"Markdown",
                 "reply_markup": {
                         "inline_keyboard": [keys]
                }
        });

});


bot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    bot.answerCallbackQuery(callbackQuery.id)
       .then(() => bot.sendMessage(msg.chat.id,callbackQuery.data ));
});

// sum command
bot.onText(/^\/sum((\s+\d+)+)$/, function (msg, match) {
  var result = 0;
  match[1].trim().split(/\s+/).forEach(function (i) {
    result += (+i || 0);
  })
  bot.sendMessage(msg.chat.id, result).then(function () {
    // reply sent!
  });
});

module.exports = bot;
