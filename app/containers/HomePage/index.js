/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import SocketIOClient from 'socket.io-client';
import messages from './messages';

import webrtcApi from '../../utils/webrtcApi';

const RTCPeerConnection =
  window.RTCPeerConnection ||
  window.mozRTCPeerConnection ||
  window.webkitRTCPeerConnection ||
  window.msRTCPeerConnection;
const RTCSessionDescription =
  window.RTCSessionDescription ||
  window.mozRTCSessionDescription ||
  window.webkitRTCSessionDescription ||
  window.msRTCSessionDescription;
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.msGetUserMedia;
const twilioIceServers = [
  { url: 'stun:global.stun.twilio.com:3478?transport=udp' },
];
const configuration = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] };
// configuration.iceServers = twilioIceServers;

const pcPeers = {};
const selfView = document.getElementById('selfView');
const remoteViewContainer = document.getElementById('remoteViewContainer');
let localStream;

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pc: null };
    this.socket = SocketIOClient('http://localhost:3001', {
      transports: ['websocket'],
    });
    this.join = this.join.bind(this);
    this.createPC = this.createPC.bind(this);
    this.exchange = this.exchange.bind(this);
    this.logError = this.logError.bind(this);
    this.getLocalStream = this.getLocalStream.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    // this.join('1');
  }
  componentDidMount() {
    // this.socket.on('exchange', data => {
    //   console.log('a exchange happend!');
    //   const pc = this.exchange(data);
    //   this.setState({ pc });
    // });
    // this.socket.on('leave', socketId => {
    //   this.leave(socketId);
    // });
    //
    // this.socket.on('connect', data => {
    //   console.log('connect: ', data);
    //   this.getLocalStream();
    // });
    // this.socket.on('join', data => {
    //   console.log('joined call: ', data);
    // });
    window.webrtcApi;
  }
  logError(error) {
    console.info('shit went down:', error);
  }

  join(roomID) {
    this.socket.emit('join', roomID, socketIds => {
      console.log('join', socketIds);
      const pc = null;
      for (const i in socketIds) {
        const socketId = socketIds[i];
        this.createPC(socketId, true);
      }
      console.log('pc here:', pc);
    });
  }

  getLocalStream() {
    navigator.getUserMedia(
      { audio: true, video: true },
      stream => {
        localStream = stream;
        // selfView.src = URL.createObjectURL(stream);
        // selfView.muted = true;
      },
      this.logError,
    );
  }

  createPC(socketId, isOffer) {
    const that = this;
    const pc = new RTCPeerConnection(configuration);
    console.log('created pc!');
    pcPeers[socketId] = pc;

    pc.onicecandidate = function(event) {
      console.log('onicecandidate', event);
      if (event.candidate) {
        that.socket.emit('exchange', {
          to: socketId,
          candidate: event.candidate,
        });
      }
    };

    function createOffer() {
      pc.createOffer(
        desc => {
          console.log('createOffer', socketId);
          pc.setLocalDescription(desc, () => {
            console.log('setLocalDescription', pc.localDescription);
            that.socket.emit('exchange', {
              to: socketId,
              sdp: pc.localDescription,
            });
          });
        },
        logError => {
          console.log(logError);
        },
      );
    }

    pc.onnegotiationneeded = function() {
      console.log('onnegotiationneeded');
      if (isOffer) {
        createOffer();
      }
    };

    pc.oniceconnectionstatechange = function(event) {
      console.log('oniceconnectionstatechange', event);
      if (event.target.iceConnectionState === 'connected') {
        createDataChannel();
      }
    };
    pc.onsignalingstatechange = function(event) {
      console.log('onsignalingstatechange', event);
    };
    pc.ondatachannel = function(event) {
      console.log('ondatachannel:', event.channel);
      const dataChannel = event.channel;
      pc.textDataChannel = dataChannel;
    };
    pc.onaddstream = function(event) {
      console.log('onaddstream', event);
    };
    console.log(localStream);
    if (!isOffer) {
      pc.addStream(localStream);
    }

    function createDataChannel() {
      console.log('creating dataChannel');
      if (pc.textDataChannel) {
        return;
      }
      const dataChannel = pc.createDataChannel('text');
      console.log('created data channel');

      dataChannel.onerror = function(error) {
        console.log('dataChannel.onerror', error);
      };

      dataChannel.onmessage = function(event) {
        console.log('dataChannel.onmessage:', event.data);
      };

      dataChannel.onopen = function() {
        console.log('dataChannel.onopen');
        dataChannel.send('Hello World!');
      };

      dataChannel.onclose = function() {
        console.log('dataChannel.onclose');
      };

      pc.textDataChannel = dataChannel;
    }
    if (isOffer) {
      createDataChannel();
      pc.createOffer(pc.localDescription, this.logError);
    }
    this.setState({ pc });
    return pc;
  }

  exchange(data) {
    const fromId = data.from;
    let pc;
    if (fromId in pcPeers) {
      pc = pcPeers[fromId];
    } else {
      pc = this.createPC(fromId, false);
    }

    if (data.sdp) {
      console.log('exchange sdp', data);
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp), () => {
        if (pc.remoteDescription.type === 'offer')
          pc.createAnswer(desc => {
            console.log('createAnswer', desc);
            pc.setLocalDescription(desc, () => {
              console.log('setLocalDescription', pc.localDescription);
              this.socket.emit('exchange', {
                to: fromId,
                sdp: pc.localDescription,
              });
            });
          });
      });
    } else {
      console.log('exchange candidate', data);
      pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
    console.info('Exchange pc: ', pc);
    return pc;
  }
  sendMessage() {
    console.log(this.state.pc.textDataChannel.readyState);
    this.state.pc.textDataChannel.send('hello');
  }

  render() {
    // console.log(pcPeers);
    // if (this.state.pc != null) {
    //   console.log('yey!: ', this.state.pc);
    //   this.state.pc.createDataChannel('text');
    //   this.state.pc.textDataChannel.onmessage('hej hej');
    // }
    return (
      <div>
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
        <button onClick={this.sendMessage}>Click me!</button>
      </div>
    );
  }
}
