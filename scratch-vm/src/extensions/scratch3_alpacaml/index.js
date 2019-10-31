const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');

const HAT_TIMEOUT = 100;

class Scratch3AlpacaMLBlocks {
  constructor (runtime) {
    this.runtime = runtime;
    this.matchMsg = 'un71k37y';

    //----------WebRTC stuff-----------------------------------------------

    this.socket = new WebSocket('ws://10.201.45.10:8080'); //Change this to the URL of your signaling server
    this.decoder = new TextDecoder("utf-8");
    var _this = this;

    // Use Google's public stun servers
    var iceServers = ["stun:stun.l.google.com:19302",
      "stun:stun1.l.google.com:19302", //TODO: maybe uncomment some of these; Firefox warned "Using more than two STUN/TURN servers slows down discovery"
      "stun:stun2.l.google.com:19302",
      "stun:stun3.l.google.com:19302",
      "stun:stun4.l.google.com:19302"];

    this.configuration = { iceServers: [{
        urls: "stun:stun.l.google.com:19302"
      }, {
        urls: iceServers
      }]
    };

    this.localConnection = new RTCPeerConnection(this.configuration);
    this.alpacaDataChannel = this.localConnection.createDataChannel("alpacaChannel", {negotiated: true, id: 101});

    this.alpacaDataChannel.onopen = function(event) {
      _this.alpacaDataChannel.send('Hi from Scratch!');
    }

    this.socket.onopen = function(event) {
      console.log("Connected to the WebSocket signaling server!");
      //var fakeRemoteSDP = '{\"payload\":{\"sdp\":\"v=0\\r\\no=- 6330964353754507835 5 IN IP4 127.0.0.1\\r\\ns=-\\r\\nt=0 0\\r\\na=group:BUNDLE 0 1 2\\r\\na=msid-semantic: WMS stream\\r\\nm=audio 62787 UDP\\\/TLS\\\/RTP\\\/SAVPF 111 103 104 9 102 0 8 106 105 13 110 112 113 126\\r\\nc=IN IP4 192.168.195.45\\r\\na=rtcp:9 IN IP4 0.0.0.0\\r\\na=candidate:20413722 1 udp 2122260223 192.168.195.45 62787 typ host generation 0 network-id 6 network-cost 50\\r\\na=ice-ufrag:bCI6\\r\\na=ice-pwd:6NK+JLeqYS2\\\/qgaZ8D8ibtFc\\r\\na=ice-options:trickle renomination\\r\\na=fingerprint:sha-256 5F:42:B1:8D:E2:3F:DB:32:D7:E0:1B:1F:D3:AB:79:66:C7:B7:B4:E0:F4:88:93:5C:1A:85:DC:24:E7:01:92:CA\\r\\na=setup:actpass\\r\\na=mid:0\\r\\na=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\\r\\na=extmap:2 http:\\\/\\\/www.webrtc.org\\\/experiments\\\/rtp-hdrext\\\/abs-send-time\\r\\na=extmap:3 http:\\\/\\\/www.ietf.org\\\/id\\\/draft-holmer-rmcat-transport-wide-cc-extensions-01\\r\\na=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid\\r\\na=extmap:5 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\\r\\na=extmap:6 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\\r\\na=sendrecv\\r\\na=msid:stream audio0\\r\\na=rtcp-mux\\r\\na=rtpmap:111 opus\\\/48000\\\/2\\r\\na=rtcp-fb:111 transport-cc\\r\\na=fmtp:111 minptime=10;useinbandfec=1\\r\\na=rtpmap:103 ISAC\\\/16000\\r\\na=rtpmap:104 ISAC\\\/32000\\r\\na=rtpmap:9 G722\\\/8000\\r\\na=rtpmap:102 ILBC\\\/8000\\r\\na=rtpmap:0 PCMU\\\/8000\\r\\na=rtpmap:8 PCMA\\\/8000\\r\\na=rtpmap:106 CN\\\/32000\\r\\na=rtpmap:105 CN\\\/16000\\r\\na=rtpmap:13 CN\\\/8000\\r\\na=rtpmap:110 telephone-event\\\/48000\\r\\na=rtpmap:112 telephone-event\\\/32000\\r\\na=rtpmap:113 telephone-event\\\/16000\\r\\na=rtpmap:126 telephone-event\\\/8000\\r\\na=ssrc:3677135693 cname:Gdp2PyOaQjpJ4nLj\\r\\na=ssrc:3677135693 msid:stream audio0\\r\\na=ssrc:3677135693 mslabel:stream\\r\\na=ssrc:3677135693 label:audio0\\r\\nm=video 9 UDP\\\/TLS\\\/RTP\\\/SAVPF 96 97 98 99 100 101 127 124 125\\r\\nc=IN IP4 0.0.0.0\\r\\na=rtcp:9 IN IP4 0.0.0.0\\r\\na=ice-ufrag:bCI6\\r\\na=ice-pwd:6NK+JLeqYS2\\\/qgaZ8D8ibtFc\\r\\na=ice-options:trickle renomination\\r\\na=fingerprint:sha-256 5F:42:B1:8D:E2:3F:DB:32:D7:E0:1B:1F:D3:AB:79:66:C7:B7:B4:E0:F4:88:93:5C:1A:85:DC:24:E7:01:92:CA\\r\\na=setup:actpass\\r\\na=mid:1\\r\\na=extmap:14 urn:ietf:params:rtp-hdrext:toffset\\r\\na=extmap:2 http:\\\/\\\/www.webrtc.org\\\/experiments\\\/rtp-hdrext\\\/abs-send-time\\r\\na=extmap:13 urn:3gpp:video-orientation\\r\\na=extmap:3 http:\\\/\\\/www.ietf.org\\\/id\\\/draft-holmer-rmcat-transport-wide-cc-extensions-01\\r\\na=extmap:12 http:\\\/\\\/www.webrtc.org\\\/experiments\\\/rtp-hdrext\\\/playout-delay\\r\\na=extmap:11 http:\\\/\\\/www.webrtc.org\\\/experiments\\\/rtp-hdrext\\\/video-content-type\\r\\na=extmap:7 http:\\\/\\\/www.webrtc.org\\\/experiments\\\/rtp-hdrext\\\/video-timing\\r\\na=extmap:8 http:\\\/\\\/tools.ietf.org\\\/html\\\/draft-ietf-avtext-framemarking-07\\r\\na=extmap:9 http:\\\/\\\/www.webrtc.org\\\/experiments\\\/rtp-hdrext\\\/color-space\\r\\na=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid\\r\\na=extmap:5 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\\r\\na=extmap:6 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\\r\\na=sendrecv\\r\\na=msid:stream video0\\r\\na=rtcp-mux\\r\\na=rtcp-rsize\\r\\na=rtpmap:96 H264\\\/90000\\r\\na=rtcp-fb:96 goog-remb\\r\\na=rtcp-fb:96 transport-cc\\r\\na=rtcp-fb:96 ccm fir\\r\\na=rtcp-fb:96 nack\\r\\na=rtcp-fb:96 nack pli\\r\\na=fmtp:96 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=640c1f\\r\\na=rtpmap:97 rtx\\\/90000\\r\\na=fmtp:97 apt=96\\r\\na=rtpmap:98 H264\\\/90000\\r\\na=rtcp-fb:98 goog-remb\\r\\na=rtcp-fb:98 transport-cc\\r\\na=rtcp-fb:98 ccm fir\\r\\na=rtcp-fb:98 nack\\r\\na=rtcp-fb:98 nack pli\\r\\na=fmtp:98 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\\r\\na=rtpmap:99 rtx\\\/90000\\r\\na=fmtp:99 apt=98\\r\\na=rtpmap:100 VP8\\\/90000\\r\\na=rtcp-fb:100 goog-remb\\r\\na=rtcp-fb:100 transport-cc\\r\\na=rtcp-fb:100 ccm fir\\r\\na=rtcp-fb:100 nack\\r\\na=rtcp-fb:100 nack pli\\r\\na=rtpmap:101 rtx\\\/90000\\r\\na=fmtp:101 apt=100\\r\\na=rtpmap:127 red\\\/90000\\r\\na=rtpmap:124 rtx\\\/90000\\r\\na=fmtp:124 apt=127\\r\\na=rtpmap:125 ulpfec\\\/90000\\r\\na=ssrc-group:FID 3415672297 3989345415\\r\\na=ssrc:3415672297 cname:Gdp2PyOaQjpJ4nLj\\r\\na=ssrc:3415672297 msid:stream video0\\r\\na=ssrc:3415672297 mslabel:stream\\r\\na=ssrc:3415672297 label:video0\\r\\na=ssrc:3989345415 cname:Gdp2PyOaQjpJ4nLj\\r\\na=ssrc:3989345415 msid:stream video0\\r\\na=ssrc:3989345415 mslabel:stream\\r\\na=ssrc:3989345415 label:video0\\r\\nm=application 9 UDP\\\/DTLS\\\/SCTP webrtc-datachannel\\r\\nc=IN IP4 0.0.0.0\\r\\na=ice-ufrag:bCI6\\r\\na=ice-pwd:6NK+JLeqYS2\\\/qgaZ8D8ibtFc\\r\\na=ice-options:trickle renomination\\r\\na=fingerprint:sha-256 5F:42:B1:8D:E2:3F:DB:32:D7:E0:1B:1F:D3:AB:79:66:C7:B7:B4:E0:F4:88:93:5C:1A:85:DC:24:E7:01:92:CA\\r\\na=setup:actpass\\r\\na=mid:2\\r\\na=sctp-port:5000\\r\\na=max-message-size:262144\\r\\n\",\"type\":\"offer\"},\"type\":\"SessionDescription\"}';
      //var fakeRemoteCandidate = '{"payload":{"sdp":"candidate:2657894056 1 udp 1685855999 128.138.138.122 60714 typ srflx raddr 10.247.19.18 rport 60714 generation 0 ufrag bCI6 network-id 5 network-cost 50","sdpMLineIndex":1,"sdpMid":"1"},"type":"IceCandidate"}';
    };

    this.socket.onmessage = function(event) {
      const reader = new FileReader();

      // This fires after the blob has been read/loaded.
      reader.addEventListener('loadend', (e) => {
        const messageStr = e.srcElement.result;
        const message = JSON.parse(messageStr);

        if (message.type == 'SessionDescription') {
            _this.localConnection.setRemoteDescription(new RTCSessionDescription(message.payload));   
        } else if (message.type == 'IceCandidate') {
          var candidate = message.payload;

          //Replace "sdp" key from AlpacaML with "candidate" to conform to standard
          candidate.candidate = candidate.sdp;
          delete candidate.sdp; 

          _this.localConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      // Start reading the blob as text.
      reader.readAsText(event.data);
    };

    //-----------------------------------------------------------------------
  }

  getInfo() {

    return {
      id: 'alpacaml',
      name: 'AlpacaML',
      blocks: [
        {
          opcode: 'connectToAlpaca',
          blockType: BlockType.COMMAND,
          text: "Connect To AlpacaML"
        },
        {
          opcode: 'whenReceivedHat',
          text: "When received: [MESSAGE]",
          blockType: BlockType.HAT,
          arguments: {
            MESSAGE: {
              type: ArgumentType.STRING,
              defaultValue: ''
            }
          }
        }
      ]
    };
  }

  //ASSUME THE APP WILL CRASH. PUT ALL CONNECITON OFFER LOGIC HERE.
  connectToAlpaca() {
    console.log("Connect To AlpacaML clicked.");
    
    this.localConnection.createOffer()
        .then(offer => {
          this.localConnection.setLocalDescription(offer);
          var sdp = makeSDPString(this.localConnection.localDescription.type, this.localConnection.localDescription.sdp);
          this.socket.send(sdp); 
        });
      
    this.localConnection.onicecandidate = event => {
      if (event.candidate) {
        var iceCandidate = makeCandidateString(event.candidate.candidate, event.candidate.sdpMLineIndex, event.candidate.sdpMid);
        this.socket.send(iceCandidate);
      }
    };

    function makeSDPString(type, sdp) {
      return '{"payload": {"type": "' + type + '", "sdp": "' + sdp.replace(/(?:\r\n|\r|\n)/g, '\\n') + '"}, "type": "SessionDescription"}';
    }

    function makeCandidateString(sdp, sdpMlineIndex, sdpMid) {
      return '{"payload":{"sdp":"' + sdp + '","sdpMLineIndex":' + sdpMlineIndex + ',"sdpMid":"' + sdpMid + '"},"type":"IceCandidate"}';
    }
  }

  whenReceivedHat(args) {
    console.log("whenReceivedHat called with argument '" + args.MESSAGE + "'.");
    var _this = this;

    this.alpacaDataChannel.onmessage = function(event) {
      var msg = _this.decoder.decode(event.data);
      console.log(msg);
      _this.matchMsg = msg;
    }

    if (args.MESSAGE === this.matchMsg) {
      this.matchMsg = 'un71k37y';
      return true;
    } else {
      return false;
    }

  }

}

module.exports = Scratch3AlpacaMLBlocks;
