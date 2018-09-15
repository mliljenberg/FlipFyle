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
import { saveAs } from 'file-saver/FileSaver';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import SocketIOClient from 'socket.io-client';

import messages from './messages';

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

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};
// configuration.iceServers = twilioIceServers;
let isInitiator = false;
const roomId = '1';

const Header = styled.h1`
  margin-top: 5vh;
`;
const QR = styled.div`
  width: 40vh;
  height: 40vh;
  margin-top: 10vh;
  background-color: black;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const Description = styled.p`
  margin-top: 10vh;
`;

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { pc: null };
    this.socket = SocketIOClient('http://192.168.1.100:3001', {
      transports: ['websocket'],
    });
    this.peerConn;
    this.dataChannel;
    this.handleOnClick = this.handleOnClick.bind(this);
    this.signalingMessageCallback = this.signalingMessageCallback.bind(this);
    this.createPeerConnection = this.createPeerConnection.bind(this);
    this.onLocalSessionCreated = this.onLocalSessionCreated.bind(this);
    this.onDataChannelCreated = this.onDataChannelCreated.bind(this);
    this.logError = this.logError.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.randomToken = this.randomToken.bind(this);
    this.receiveDataChromeFactory = this.receiveDataChromeFactory.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.sendData = this.sendData.bind(this);
    // this.join('1');
  }

  componentDidMount() {
    this.socket.emit('create or join', roomId);
    this.socket.on('ipaddr', ipaddr => {
      console.log(`Server IP address is: ${ipaddr}`);
      // updateRoomURL(ipaddr);
    });

    this.socket.on('created', (room, clientId) => {
      console.log('Created room', room, '- my client ID is', clientId);
      isInitiator = true;
      // grabWebCamVideo();
    });

    this.socket.on('joined', (room, clientId) => {
      console.log(
        'This peer has joined room',
        room,
        'with client ID',
        clientId,
      );
      isInitiator = false;
      this.createPeerConnection(isInitiator, configuration);
      // grabWebCamVideo();
    });

    this.socket.on('full', room => {
      alert(`Room ${room} is full. We will create a new room for you.`);
      window.location.hash = '';
      window.location.reload();
    });

    this.socket.on('ready', () => {
      console.log('Socket is ready');
      this.createPeerConnection(isInitiator, configuration);
    });

    this.socket.on('log', array => {
      console.log(...array);
    });

    this.socket.on('message', message => {
      console.log('Client received message:', message);
      this.signalingMessageCallback(message);
    });
    this.socket.on('disconnect', reason => {
      console.log(`Disconnected: ${reason}.`);
      // sendBtn.disabled = true;
      // snapAndSendBtn.disabled = true;
    });

    this.socket.on('bye', room => {
      console.log(`Peer leaving room ${room}.`);
      // sendBtn.disabled = true;
      // snapAndSendBtn.disabled = true;
      // If peer did not create the room, re-enter to be creator.
      if (!isInitiator) {
        window.location.reload();
      }
    });
  }

  sendMessage(message) {
    console.log('Client sending message: ', message);
    this.socket.emit('message', message);
  }
  handleOnClick(message) {
    console.log(message);
    console.log('handelingClick: ', this.dataChannel);
    this.dataChannel.send('fuck this piss');
  }

  signalingMessageCallback(message) {
    if (message.type === 'offer') {
      console.log('Got offer. Sending answer to peer.');
      this.peerConn.setRemoteDescription(
        new RTCSessionDescription(message),
        () => {},
        this.logError,
      );
      this.peerConn.createAnswer(this.onLocalSessionCreated, this.logError);
    } else if (message.type === 'answer') {
      console.log('Got answer.');
      this.peerConn.setRemoteDescription(
        new RTCSessionDescription(message),
        () => {},
        this.logError,
      );
    } else if (message.type === 'candidate') {
      this.peerConn.addIceCandidate(
        new RTCIceCandidate({
          candidate: message.candidate,
        }),
      );
    }
  }

  createPeerConnection(Initiator, config) {
    console.log(
      'Creating Peer connection as initiator?',
      isInitiator,
      'config:',
      config,
    );
    this.peerConn = new RTCPeerConnection(config);

    // send any ice candidates to the other peer
    this.peerConn.onicecandidate = function(event) {
      console.log('icecandidate event:', event);
      if (event.candidate) {
        this.sendMessage({
          type: 'candidate',
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate,
        });
      } else {
        console.log('End of candidates.');
      }
    }.bind(this);

    if (Initiator) {
      console.log('Creating Data Channel');
      this.dataChannel = this.peerConn.createDataChannel('photos');
      console.log(this.dataChannel);
      this.onDataChannelCreated(this.dataChannel);

      console.log('Creating an offer');
      this.peerConn.createOffer(this.onLocalSessionCreated, this.logError);
    } else {
      this.peerConn.ondatachannel = function(event) {
        console.log('ondatachannel:', event.channel);
        this.dataChannel = event.channel;
        this.onDataChannelCreated(this.dataChannel);
      }.bind(this);
    }
  }

  onLocalSessionCreated(desc) {
    console.log('local session created:', desc);
    this.peerConn.setLocalDescription(
      desc,
      () => {
        console.log('sending local desc:', this.peerConn.localDescription);
        this.sendMessage(this.peerConn.localDescription);
      },
      this.logError,
    );
  }

  onDataChannelCreated(channel) {
    console.log('onDataChannelCreated:', channel);

    channel.onopen = function() {
      console.log('CHANNEL opened!!!');
    };

    channel.onclose = function() {
      console.log('Channel closed.');
    };

    channel.onmessage = this.receiveDataChromeFactory();
    //     adapter.browserDetails.browser === 'firefox'
    //       ? receiveDataFirefoxFactory()
    //       : receiveDataChromeFactory();
  }

  randomToken() {
    return Math.floor((1 + Math.random()) * 1e16)
      .toString(16)
      .substring(1);
  }

  logError(err) {
    if (!err) return;
    if (typeof err === 'string') {
      console.warn(err);
    } else {
      console.warn(err.toString(), err);
    }
  }
  receiveDataChromeFactory() {
    console.log('receiveDataChromeFactory');
    let len, totCount, type, name;
    const buf = [];
    const chunkSize = 16384;
    let count = 0;

    return function onmessage(event) {
      // console.log(event.data);
      if (typeof event.data === 'string') {
        const recivedData = JSON.parse(event.data);
        console.log('dataChannel message: ', event.data);
        len = parseInt(recivedData.size, 10);
        type = recivedData.type;
        name = recivedData.name;
        // buf = new Uint8ClampedArray(parseInt(event.data));

        totCount = Math.ceil(len / chunkSize);
        console.log(
          `Expecting a total of ${len} bytes, which is ${totCount} sendings.`,
        );
        return;
      }

      buf.push(new Uint8Array(event.data));
      console.log(`${Math.ceil((count / totCount) * 100)}% done!`);
      count += 1;
      if (count === totCount) {
        const received = new Blob(buf, { type });
        saveAs(received, name);
        console.log(received);

        // const data = new Uint8ClampedArray(event.data);
        // buf.set(data, count);
        //
        // count += data.byteLength;
        // console.log(`count: ${count}`);
        //
        // if (count === buf.byteLength) {
        //   // we're done: all data chunks have been received
        //   console.log('Done. Rendering photo.');
        //   // renderPhoto(buf);
        // }
      }
    };
  }

  uploadFile(event) {
    const file = event.target.files[0];
    console.log(file);

    if (file) {
      const data = new FormData();
      data.append('file', file);
      this.sendData(file);
      // axios.post('/files', data)...
    }
  }
  sendData(file) {
    console.log(
      `File is ${[file.name, file.size, file.type, file.lastModified].join(
        ' ',
      )}`,
    );

    // Handle 0 size files.
    if (file.size === 0) {
      alert('File is empty, please select a non-empty file');
      return;
    }
    const chunkSize = 16384;
    const fileReader = new FileReader();
    let offset = 0;
    this.dataChannel.send(
      JSON.stringify({ size: file.size, type: file.type, name: file.name }),
    );
    fileReader.addEventListener('error', error =>
      console.error('Error reading file:', error),
    );
    fileReader.addEventListener('abort', event =>
      console.log('File reading aborted:', event),
    );
    fileReader.addEventListener('load', e => {
      console.log('FileRead.onload ', e);
      this.dataChannel.send(e.target.result);
      offset += e.target.result.byteLength;
      // sendProgress.value = offset;
      if (offset < file.size) {
        readSlice(offset);
      }
    });
    const readSlice = o => {
      console.log('readSlice ', o);
      const slice = file.slice(offset, o + chunkSize);
      fileReader.readAsArrayBuffer(slice);
      // fileReader.readAsDataURL(slice);
    };
    readSlice(0);
  }

  render() {
    return (
      <Container>
        <Header>
          <FormattedMessage {...messages.header} />
        </Header>
        <QR />
        <Description>
          To use FlipFyle to magically teleport your files from your phone to
          this computer,
          <br />
          simply download FlipFyle from{' '}
          <a href="http://www.google.com"> app store</a> or{' '}
          <a href="http://www.google.com"> play store </a>!
        </Description>
        <button onClick={this.handleOnClick}>Click me</button>
        <input type="file" name="myFile" onChange={this.uploadFile} />
      </Container>
    );
  }
}
