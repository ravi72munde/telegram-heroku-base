var token = process.env.TOKEN;

var Bot = require('node-telegram-bot-api');
var bot;
var request = require("request");
if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
  console.log('environment url->>>'+process.env.HEROKU_URL);
}
else
{
  bot = new Bot(token);
  bot.deleteWebHook();
  bot = new Bot(token, { polling: true });
}

console.log('bot server started...');

bot.onText(/\/rate_me/, (msg) => {
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

bot.onText(/\/get_my_id/, (msg) => {
        console.log(JSON.stringify(msg));
        bot.sendMessage(msg.chat.id, "your user id :"+msg.from.id).then(function () {
    // reply sent!
  });

});


bot.on("callback_query", (callbackQuery) => {
    console.log(callbackQuery);
    //telegram user id of the user who sent the messge
    var userId = callbackQuery.from.id;
    //rating send by the user
    var rating = callbackQuery.data;
    //webhook hit to IFTTT maker channel for further processing.
    hitMe(userId,rating);
    //@TODO: what to do after success entry
    // bot.answerCallbackQuery(callbackQuery.id)
    //         .then(() => bot.editMessageReplyMarkup({text:'Thank you......'},{chat_id :callbackQuery.message.chat.id, message_id:callbackQuery.message.message_id} ));
    //
    var chat_id = callbackQuery.message.chat.id;
    var message_id = callbackQuery.message.message_id;
    var options = Object.assign({},{}, { chat_id: chat_id, message_id: message_id});
    bot.answerCallbackQuery(callbackQuery.id)
       .then(() => bot.editMessageText("Thank you....", options));
    getRandomGif(chat_id);

});

/******************************* Additional Methods*****************************/

/* hitMe @params: telegram userId and rating
 * prepare webhook hit request for IFTTT channel
 */
function hitMe(userId, rating){
    var options = {
        uri:" https://maker.ifttt.com/trigger/kugelblitz/with/key/b3mi2lXilqamDkfxybOo0t",
        method:"POST",
        json:{
                "value1":userId,
                "value2":rating
        }
    }
    request(options, function (error,response,body){
        console.log("response body : " + body)
    });
}

function getRandomGif(chatId){
    var offset = Math.floor((Math.random() * 10) + 1);
    var options = {
            uri:"http://api.giphy.com/v1/gifs/search?api_key=602eaf434f684e208df3562fae17a85b&q=kitten&limit=1&offset="+offset
    }
  request(options, function (error,response,body){
         if(!error){

          var bodyData = JSON.parse(body);

          var keysArray = Object.keys(bodyData);
          var key = keysArray[0];
          var value = bodyData[key];
          var gifURL = value[0].images.original.url;
          bot.sendDocument(chatId,gifURL,{caption:"Here's your kitten"});
         }
  });
}

function sing_me_to_sleep(){
//stupid function does nothing but makes me wait
}

module.exports = bot;
