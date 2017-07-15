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
