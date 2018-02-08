const bearychat = require('bearychat');
const HTTPClient = bearychat.HTTPClient;
const RTMClient = require('bearychat-rtm-client');
const RTMClientEvents = RTMClient.RTMClientEvents;
const WebSocket = require('websocket').w3cwebsocket;


const token = process.env.HUBOT_BEARYCHAT_TOKENS;
const targetUserId = '=bw74b';

const httpClient = new HTTPClient(token);
const rtmClient = new RTMClient({
  url: async () => {
    const rtmData = await httpClient.rtm.start();
    return rtmData.ws_host;
  },
  WebSocket
});

rtmClient.on(RTMClientEvents.ONLINE, function() {
  console.log('RTM online');
});

rtmClient.on(RTMClientEvents.OFFLINE, function() {
  console.log('RTM offline');
});

async function start() {
  const targetVChannel = await httpClient.p2p.create({
    user_id: targetUserId
  });

  console.log(targetVChannel);

  rtmClient.on(RTMClientEvents.EVENT, function(eventMessage) {
    if (bearychat.rtm.message.isChatMessage(eventMessage) && eventMessage.vchannel_id !== targetVChannel.vchannel_id) {
      httpClient.message.create({
        vchannel_id: targetVChannel.vchannel_id,
        attachments: eventMessage.attachments || [],
        text: eventMessage.text
      });
    }
  });
}

start();
