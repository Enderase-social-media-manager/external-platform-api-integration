import FB from 'fb';

export async function updateOnFacebookPage(postData, platformSubtypeData) {
  /* can only update text */
//   console.log(postData, platformSubtypeData);

  /* check if the post is made by the post and return an error message if not */
  try {
    var r = await FB.api(`/${platformSubtypeData.contentId}`, 'POST', {
      message: `${postData.text}`,
      access_token: platformSubtypeData.platformSubtypeData.pageAccessToken,
    });
    var finalResp = {
      status: 'success',
      code: 200,
    };
  } catch (error) {
    console.log("fb",error)
    var finalResp = {
      status: 'fail',
      code: 400,
      message : error.message,
      description :error
    };
  }

  return finalResp
  //
}
