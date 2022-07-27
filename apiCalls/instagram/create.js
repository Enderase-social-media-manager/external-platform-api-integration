import FB from 'fb';

export async function publishOnInstagramAccount(
  instagramAccountData,
  postData
) {
  var body = {};
  var finalInstaResp = {};
  var creationId;
  for (const platform of instagramAccountData) {
    var errorOccurred = false;
    var imageIdArray = [];

    // iteratively organize data/body and upload images
    for (const media of postData.media) {

      // organize data/body for single and multiple images
      if (postData.media.length == 1) {
        body = {
          image_url: media,
          caption: postData.text,
          is_carousel_item: 'true',
          access_token: platform.platformSubtypeData.userAccessToken,
        };
      } else {
        body = {
          image_url: media,
          is_carousel_item: 'true',
          access_token: platform.platformSubtypeData.userAccessToken,
        };
      }

      //upload media
      if (!errorOccurred) {
        try {
          var r = await FB.api(
            `/${platform.platformSubtypeData.userId}/media`,
            'POST',
            body
          );

          imageIdArray.push(r.id);
        } catch (error) {
          console.log(error);
          finalInstaResp[platform.id] = {
            status: 'fail',
            code: 400,
            message: error.response.error.message,
            description: error,
          };
          errorOccurred = true;
        }
      }
    }

    //create single upload id(creation id)
    if (!errorOccurred) {
      if (postData.media.length != 1) {
        try {
          var r = await FB.api(
            `/${platform.platformSubtypeData.userId}/media`,
            'POST',
            {
              access_token: platform.platformSubtypeData.userAccessToken,
              media_type: 'CAROUSEL',
              caption: postData.text,
              children: imageIdArray,
            }
          );
          creationId = r.id;
        } catch (error) {
          console.log(error);
          finalInstaResp[platform.id] = {
            status: 'fail',
            code: 400,
            message: error.response.error.message,
            description: error,
          };
          errorOccurred = true;
        }
      } else {
        creationId = imageIdArray[0];
      }
    }

    //post the content
    if (!errorOccurred) {
      try {
        var r = await FB.api(
          `/${platform.platformSubtypeData.userId}/media_publish`,
          'POST',
          {
            access_token: platform.platformSubtypeData.userAccessToken,
            creation_id: creationId,
          }
        );
        finalInstaResp[platform.id]={
          status: 'success',
          code: 201,
          id: r.id,
        };
      } catch (error) {
        finalInstaResp[platform.id] = {
          status: 'fail',
          code: 400,
          message: error.response.error.message,
          description: error,
        };
        errorOccurred = true;
      }
    }
  }

  return finalInstaResp;
}
