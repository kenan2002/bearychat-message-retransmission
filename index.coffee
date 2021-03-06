# This is the same with index.js but in coffeescript

bearychat = require 'bearychat'
HTTPClient = bearychat.HTTPClient
RTMClient = require 'bearychat-rtm-client'
RTMClientEvents = RTMClient.RTMClientEvents
WebSocket = require('websocket').w3cwebsocket


token = process.env.HUBOT_BEARYCHAT_TOKENS
targetUserId = '=bw74b'

httpClient = new HTTPClient token
rtmClient = new RTMClient
  url: ->
    httpClient.rtm.start().then (data) -> data.ws_host
  WebSocket: WebSocket

rtmClient.on RTMClientEvents.ONLINE, ->
  console.log 'RTM online'

rtmClient.on RTMClientEvents.OFFLINE, ->
  console.log 'RTM offline'

httpClient.p2p.create({user_id: targetUserId})
  .then (targetVChannel) ->
    console.log targetVChannel

    rtmClient.on RTMClientEvents.EVENT, (eventMessage) ->
      if bearychat.rtm.message.isChatMessage(eventMessage) and eventMessage.vchannel_id != targetVChannel.vchannel_id
        httpClient.message.create
          vchannel_id: targetVChannel.vchannel_id,
          attachments: eventMessage.attachments ? [],
          text: eventMessage.text

