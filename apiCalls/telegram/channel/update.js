import 'dotenv/config';
import fetch from 'node-fetch';
export async function updateOnTelegramChannel(postData, platformSubtypeData) {

  var url = process.env.telegramUrl;
  var errorOccurred = false;
  var description = {}
  var errorData = [];

  let headersList = {
    'Accept': '*/*',
    'Content-Type': 'application/json',
  };

  var mediaType = 'photo';

  var telegramChannelResponse = {};

  //editing the media
  for (var index = 0; index < platformSubtypeData.contentId.length; index++) {
    let bodyContent = {
      chat_id: platformSubtypeData.platformSubtypeData.channelId,
      message_id: platformSubtypeData.contentId[index],
      media: {
        media: postData.media[index],
        type: mediaType,
      },
    };

    try {
      var r = await fetch(`${url}/editMessageMedia`, {
        method: 'POST',
        body: JSON.stringify(bodyContent),
        headers: headersList,
      }).then((response) => response.text());
     r=JSON.parse(r)

     description[bodyContent.message_id]= r
    } catch (error) {
      console.log(error);
      errorOccurred = true;
      errorData.push({
        type: 'media error',
        error: error,
        message_id: bodyContent.message_id,
      });
      description[bodyContent.message_id]= error
    }
  }

  //editing the caption
  let bodyContent = {
    chat_id: platformSubtypeData.platformSubtypeData.channelId,
    message_id: platformSubtypeData.contentId[0],
    caption: postData.text,
  };

  try {
    var r = await fetch(`${url}/editMessageCaption`, {
      method: 'POST',
      body: JSON.stringify(bodyContent),
      headers: headersList,
    }).then((resp) => resp.text());
    r = JSON.parse(r);
    description["caption"]= r

  } catch (error) {
    console.log(error);
    errorOccurred = true;
    errorData.push({
      type: 'caption error',
      error: error,
    });
    description["caption"]= error

  }

  if (errorOccurred) {
    telegramChannelResponse = {
      status: 'fail',
      code: 400,
      error: errorData,
      description:description
    };
  } else {
    telegramChannelResponse= {
      status: 'success',
      code: 200,
      description:description
    };
  }

  return telegramChannelResponse;
}
