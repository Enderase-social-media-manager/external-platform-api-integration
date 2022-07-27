import FB from 'fb'
export async function removeFromFacebookPage( platformSubtypeData) {
  
    try {
        var r = await FB.api(`/${platformSubtypeData.contentId}`, 'DELETE', {
          access_token: platformSubtypeData.platformSubtypeData.pageAccessToken,
        });
        var finalResp = {
          status: 'success',
          code: 200,
          description:r
        };
      } catch (error) {

        var finalResp = {
          status: 'fail',
          code: 400,
          message : error.response.error.message,
          description :error
        };
      }
    
      return finalResp
}
