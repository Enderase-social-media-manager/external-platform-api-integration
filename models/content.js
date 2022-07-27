import { publishOnFacebookGroup } from '../apiCalls/facebook/group/create.js';
import { publishOnFacebookPage } from '../apiCalls/facebook/page/create.js';
import { publishOnInstagramAccount } from '../apiCalls/instagram/create.js';
import { publishOnTelegramChannel } from '../apiCalls/telegram/channel/create.js';
import { publishOnTelegramGroup } from '../apiCalls/telegram/group/create.js';

import { mediaArrayMaker } from '../functions/mediaArrayMaker.js';

import { updateOnTelegramGroup } from '../apiCalls/telegram/group/update.js';
import { updateOnTelegramChannel } from '../apiCalls/telegram/channel/update.js';
import { updateOnFacebookPage } from '../apiCalls/facebook/page/update.js';

import { removeFromFacebookPage } from '../apiCalls/facebook/page/delete.js';
import { removeFromTelegramChannel } from '../apiCalls/telegram/channel/delete.js';
import { removeFromTelegramGroup } from '../apiCalls/telegram/group/delete.js';

export async function publishContents(req, res) {
  /* way --- collect similar platform subtypes  */
  var parameters = req.body;
  var postData = {
    media: mediaArrayMaker(parameters),
    text: parameters.content.postFormatTemplate,
  };

  var facebookPageData = [];
  var instagramAccountData = [];
  var telegramGroupData = [];
  var telegramChannelData = [];

  parameters.client.connectedPlatforms.forEach((connectedPlatform) => {
    if (connectedPlatform.platformSubtypeId == '01_01') {
      facebookPageData.push(connectedPlatform);
    } else if (connectedPlatform.platformSubtypeId == '02_01') {
      instagramAccountData.push(connectedPlatform);
    } else if (connectedPlatform.platformSubtypeId == '03_01') {
      telegramGroupData.push(connectedPlatform);
    } else if (connectedPlatform.platformSubtypeId == '03_02') {
      telegramChannelData.push(connectedPlatform);
    }
  });

  var facebookPageResponse = await publishOnFacebookPage(
    facebookPageData,
    postData
  );
  var instagramAccountResponse = await publishOnInstagramAccount(
    instagramAccountData,
    postData
  );
  var telegramChannelResponse = await publishOnTelegramChannel(
    telegramChannelData,
    postData
  );
  var telegramGroupResponse = await publishOnTelegramGroup(
    telegramGroupData,
    postData
  );

  var connectedPlatformsResponse = {
    '01_01': facebookPageResponse,
    '02_01': instagramAccountResponse,
    '03_01': telegramGroupResponse,
    '03_02': telegramChannelResponse,
  };

  var publishedInfo = [];

  for (const platformTypeId in connectedPlatformsResponse) {
    for (const platformSubtypeId in connectedPlatformsResponse[
      platformTypeId
    ]) {
      if (
        connectedPlatformsResponse[platformTypeId][platformSubtypeId].status ==
        'success'
      ) {
        publishedInfo.push({
          connectedPlatformId: platformSubtypeId,
          contentId:
            connectedPlatformsResponse[platformTypeId][platformSubtypeId].id,
        });
      }
    }
  }

  var responseData = {
    status: 'success',
    code: '201',
    connectedPlatformsResponse: connectedPlatformsResponse,
    publishedInfo: publishedInfo,
  };

  res.status(201).send(responseData);

  // var facebookGroupResponse = publishOnFacebookGroup(req);
}

export async function editContent(req, res) {
  /*way --- iterate trough every connected platform */
  var parameters = req.body;

  // identifying edit content

  var postData = {
    media: mediaArrayMaker(parameters),
    text: parameters.content.postFormatTemplate,
  };
  //

  //identifying platforms to edit to
  var platformData = [];
  for (const publishedInfo of parameters.content.publishedInfo) {
    for (const connectedPlatform of parameters.client.connectedPlatforms) {
      if (publishedInfo.connectedPlatformId == connectedPlatform.id) {
        platformData.push({
          id: connectedPlatform.id,
          platformSubtypeId: connectedPlatform.platformSubtypeId,
          platformSubtypeData: connectedPlatform.platformSubtypeData,
          contentId: publishedInfo.contentId,
        });
      }
    }
  }

  var telegramGroupEdit = false;
  var telegramChannelEdit = false;
  var facebookPageEdit = false;

  var facebookPageResponse = {};
  var telegramGroupResponse = {};
  var telegramChannelResponse = {};

  //sending data to each model
  for (const platformSubtypeData of platformData) {
    if (platformSubtypeData.platformSubtypeId == '03_01') {
      telegramGroupResponse[platformSubtypeData.id] =
        await updateOnTelegramGroup(postData, platformSubtypeData);
      telegramGroupEdit = true;
    } else if (platformSubtypeData.platformSubtypeId == '03_02') {
      telegramChannelResponse[platformSubtypeData.id] =
        await updateOnTelegramChannel(postData, platformSubtypeData);
      telegramChannelEdit = true;
    } else if (platformSubtypeData.platformSubtypeId == '01_01') {
      facebookPageResponse[platformSubtypeData.id] = 
      await updateOnFacebookPage(postData,platformSubtypeData);
      facebookPageEdit = true;
    }
  }

  var connectedPlatformsResponse = {};

  facebookPageEdit
    ? (connectedPlatformsResponse['facebookPageResponse'] =
        facebookPageResponse)
    : null;
  telegramGroupEdit
    ? (connectedPlatformsResponse['telegramGroupResponse'] =
        telegramGroupResponse)
    : null;
  telegramChannelEdit
    ? (connectedPlatformsResponse['telegramChannelResponse'] =
        telegramChannelResponse)
    : null;

  res.status(200).send({
    status: 'success',
    code: 200,
    connectedPlatformsResponse,
  });
}

export async function removeContent(req, res) {
  var parameters = req.body;
  var platformData = [];

  for (const publishedInfo of parameters.content.publishedInfo) {
    for (const connectedPlatform of parameters.client.connectedPlatforms) {
      if (publishedInfo.connectedPlatformId == connectedPlatform.id) {
        platformData.push({
          id: connectedPlatform.id,
          platformSubtypeId: connectedPlatform.platformSubtypeId,
          platformSubtypeData: connectedPlatform.platformSubtypeData,
          contentId: publishedInfo.contentId,
        });
      }
    }
  }

  var telegramGroupDelete = false;
  var telegramChannelDelete = false;
  var facebookPageDelete = false;

  var facebookPageResponse = {};
  var telegramGroupResponse = {};
  var telegramChannelResponse = {};
  //sending data to each model
  for (const platformSubtypeData of platformData) {
    if (platformSubtypeData.platformSubtypeId == '03_01') {
      telegramGroupResponse[platformSubtypeData.id] =
        await removeFromTelegramGroup(platformSubtypeData);
      telegramGroupDelete = true;
    } else if (platformSubtypeData.platformSubtypeId == '03_02') {
      telegramChannelResponse[platformSubtypeData.id] =
        await removeFromTelegramChannel(platformSubtypeData);
      telegramChannelDelete = true;
    } else if (platformSubtypeData.platformSubtypeId == '01_01') {
      facebookPageResponse[platformSubtypeData.id] =
        await removeFromFacebookPage(platformSubtypeData);
      facebookPageDelete = true;
    }
  }

  var connectedPlatformsResponse = {};

  facebookPageDelete
    ? (connectedPlatformsResponse['facebookPageResponse'] =
        facebookPageResponse)
    : null;
  telegramGroupDelete
    ? (connectedPlatformsResponse['telegramGroupResponse'] =
        telegramGroupResponse)
    : null;
  telegramChannelDelete
    ? (connectedPlatformsResponse['telegramChannelResponse'] =
        telegramChannelResponse)
    : null;

  res.status(200).send({
    status: 'success',
    code: 200,
    connectedPlatformsResponse,
  });
}
