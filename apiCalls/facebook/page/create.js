import FB from 'fb';

export async function publishOnFacebookPage(facebookPageData, postData) {
  var finalResp = {};
  var mediaIdArray = {};
  var mediaDataArray = [];
  var body = {};

  for (const platform of facebookPageData) {
    var errorOccurred = false;

    mediaIdArray[platform.id] = [];
    mediaDataArray = [];

    //iterate through media and upload it
    for (const media of postData.media) {

      if (!errorOccurred) {
        try {
          var r = await FB.api(
            `/${platform.platformSubtypeData.pageId}/photos`,
            'POST',
            {
              url: `${media}`,
              published: 'false',
              access_token: `${platform.platformSubtypeData.pageAccessToken}`,
            }
          );
          mediaIdArray[platform.id].push(parseInt(r.id));
        } catch (error) {
          finalResp[platform.id] = {
            status: 'fail',
            code: 400,
            message: error.response.error.message,
            detail: error,
          };
          errorOccurred = true;
        }
      }
    }

    // organize data/body for single or multiple media

    if (mediaIdArray[platform.id].length == 1) {
      mediaDataArray.push({
        media_fbid: mediaIdArray[platform.id][0],
        message: postData.text,
      });

      body = {
        attached_media: mediaDataArray,
        access_token: `${platform.platformSubtypeData.pageAccessToken}`,
      };
    } else {
      for (const media of mediaIdArray[platform.id]) {
        mediaDataArray.push({
          media_fbid: media,
        });
      }
      body = {
        attached_media: mediaDataArray,
        message: `${postData.text}`,
        access_token: `${platform.platformSubtypeData.pageAccessToken}`,
      };
    }

    //post content
    if (!errorOccurred) {
      try {
        var r = await FB.api(
          `/${platform.platformSubtypeData.pageId}/feed`,
          'POST',
          body
        );
        finalResp[platform.id] = {
          status: 'success',
          code: 201,
          id: r.id,
        };
      } catch (error) {
        finalResp[platform.id] = {
          status: 'fail',
          code: 400,
          message: error.response.error.message,
          detail: error,
        };
        errorOccurred = true;
      }
    }
  }

  return finalResp;
}
