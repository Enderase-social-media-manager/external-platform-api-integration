import fetch from 'node-fetch';
import 'dotenv/config'

export async function publishOnTelegramGroup(telegramGroupData, postData) {
  var telegramGroupResponse = {};
  let headersList = {
    Accept: '*/*',
    'Content-Type': 'application/json',
  };

  var mediaType = 'photo';
  var url =
    process.env.telegramUrl;

  for (const platform of telegramGroupData) {
    telegramGroupResponse[platform.id] = [];
    //single image
    if (postData.media.length == 1) {
      var path = 'sendPhoto';
      var bodyContent = JSON.stringify({
        chat_id: platform.platformSubtypeData.groupId,
        photo: postData.media[0],
        caption: postData.text,
      });
    }
    //multiple images
    else {
      var mediaArray = [];

      for (let index = 0; index < postData.media.length; index++) {
        if (index == 0) {
          mediaArray.push({
            media: postData.media[index],
            type: mediaType,
            caption: postData.text,
          });
        } else {
          mediaArray.push({
            media: postData.media[index],
            type: mediaType,
          });
        }
      }
      var path = 'sendMediaGroup';
      var bodyContent = JSON.stringify({
        chat_id: platform.platformSubtypeData.groupId,
        media: mediaArray,
      });
    }

    // posting content
    try {

      var r = await fetch(`${url}${path}`, {
        method: 'POST',
        body: bodyContent,
        headers: headersList,
      }).then((res) => res.text());

      //catching error occurred on telegram server

      if (JSON.parse(r).ok == true) {
        if (postData.media.length == 1) {
          telegramGroupResponse[platform.id]={
            status: 'success',
            code: 201,
            id: JSON.parse(r).result.message_id,
          };
        } else {
          let res = [];
          let resp = JSON.parse(r).result;
          for (const response of resp) {
            res.push(response.message_id);
          }
          telegramGroupResponse[platform.id]={
            status: 'success',
            code: 201,
            id: res,
          };
        }
      } else {
        console.log(r);
        telegramGroupResponse[platform.id]={
          status: 'fail',
          code: 400,
          message: JSON.parse(r).description,
          description: r,
        };
      }

    } catch (error) {
      console.log(error);
      telegramGroupResponse[platform.id]={
        status: 'fail',
        code: 400,
        message: '',
        description: error,
      };
    }
  }

  return telegramGroupResponse;
}
