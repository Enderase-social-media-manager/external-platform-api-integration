import 'dotenv/config';
import fetch from 'node-fetch';

export async function removeFromTelegramChannel( platformSubtypeData) {
  let headersList = {
    Accept: '*/*',
    'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
    'Content-Type': 'application/json',
  };
  var finalResp={}
  for (var index=0; index<platformSubtypeData.contentId.length; index++){
    var bodyContent ={
        chat_id: platformSubtypeData.platformSubtypeData.channelId,
        message_id: platformSubtypeData.contentId[index],
      };

      try {
        var r = await fetch(`${process.env.telegramUrl}/deleteMessage`, {
          method: 'POST',
          body:  JSON.stringify(bodyContent),
          headers: headersList,
        }).then(function (response) {
          return response.text();
        });

        var resp = JSON.parse(r);

        if (resp.ok) {
           finalResp[bodyContent.message_id] = {
            status: 'success',
            code: 200,
            description: resp,
          };
        } else {
             finalResp[bodyContent.message_id] = {
            status: 'fail',
            code: 400,
            message: resp.description,
            description: resp,
          };
        }
      } catch (error) {
        console.log(error);
         finalResp[bodyContent.message_id] = {
          status: 'fail',
          code: 400,
          message: error,
          description: error,
        };
      }
  }
  

  return finalResp;
}
