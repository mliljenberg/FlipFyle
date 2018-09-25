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

/* eslint-disable react/prefer-stateless-function one-var func-names no-param-reassign */

import React from 'react';
import { saveAs } from 'file-saver/FileSaver';
import styled from 'styled-components';
import SocketIOClient from 'socket.io-client';
import TransferingFileView from '../../components/TransferingFileView';
import MainScreen from '../../components/MainScreen';
import ConnectedScreen from '../../components/ConnectedScreen';

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
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
};
// configuration.iceServers = twilioIceServers;
let isInitiator = false;
const Background = styled.div`
height: 100vh;
`;

function get_browser() {
  let ua = navigator.userAgent,
    tem,
    M =
      ua.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i,
      ) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return { name: 'IE', version: tem[1] || '' };
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR|Edge\/(\d+)/);
    if (tem != null) {
      return { name: 'Opera', version: tem[1] };
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }
  return {
    name: M[0],
    version: M[1],
  };
}

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.serverLocation = 'http://85.228.39.114:3001';
    this.socket = SocketIOClient(this.serverLocation, {
      transports: ['websocket'],
    });
    this.roomId = props.location.pathname.slice(1);
    this.state = {
      sending: false,
      reciving: false,
      progress: 0,
      connected: false,
      roomId: this.roomId,
      roomCodeInput: '',
    };
    this.peerConn;
    this.dataChannel;
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
    this.handleChange = this.handleChange.bind(this);
    this.connectButtonClicked = this.connectButtonClicked.bind(this);
    const browser = get_browser();
    console.log(browser.name);
    if (browser.name !== 'Chrome') {
      alert(
        'Sadly this application only works with chrome right now! Please download latest version of chrome to transfer your files. \n \n Well either that or save the file to usb and post it... up to you!',
      );
    }
    // this.join('1');
  }

  componentDidMount() {
    console.log(this.state.roomId);
    if (this.state.roomId === '') {
      this.socket.emit('create or join', -1, 'BROWSER');
    } else {
      this.socket.emit('create or join', this.roomId, 'BROWSER');
    }
    this.socket.on('ipaddr', ipaddr => {
      console.log(`Server IP address is: ${ipaddr}`);
      // updateRoomURL(ipaddr);
    });

    this.socket.on('created', (room, clientId) => {
      console.log('Created room', room, '- my client ID is', clientId);
      isInitiator = true;
      this.setState({ roomId: room });
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
      this.setState({ roomId: room });
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
      this.setState({ connected: false });
      // sendBtn.disabled = true;
      // snapAndSendBtn.disabled = true;
    });

    this.socket.on('bye', room => {
      console.log(`Peer leaving room ${room}.`);
      this.setState({ connected: false });
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
        // alternative just use event.candidate
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
    this.setState({ connected: true });
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
      this.setState({ reciving: true });
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
      this.setState({ progress: Math.ceil((count / totCount) * 100) });
      count += 1;
      this.setState({});
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
    }.bind(this);
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
    this.setState({
      sending: true,
    });
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
      console.log('buffered amount:', this.dataChannel.bufferedAmount);
      if (this.dataChannel.bufferedAmount < 16000000) {
        this.dataChannel.send(e.target.result);
        offset += e.target.result.byteLength;
        // sendProgress.value = offset;
        this.setState({
          progress: Math.ceil(
            ((offset - this.dataChannel.bufferedAmount) / file.size) * 100,
          ),
        });
        if (offset < file.size) {
          readSlice(offset);
        }
      } else {
        // TODO: Adjust the sleep to the transfer speed to get optimal speed. (might not be necessicary)
        sleep(200).then(() => {
          this.dataChannel.send(e.target.result);
          offset += e.target.result.byteLength;
          // sendProgress.value = offset;
          this.setState({ progress: Math.ceil((offset / file.size) * 100) });
          if (offset - this.dataChannel.bufferedAmount < file.size) {
            readSlice(offset);
          }
        });
      }
    });
    const readSlice = o => {
      console.log('readSlice ', o);
      const slice = file.slice(offset, offset + chunkSize);
      fileReader.readAsArrayBuffer(slice);
      // fileReader.readAsBinaryString(slice);
    };
    readSlice(0);
    const sleep = milliseconds =>
      new Promise(resolve => setTimeout(resolve, milliseconds));
  }
  handleChange(event) {
    this.setState({ roomCodeInput: event.target.value });
  }
  connectButtonClicked() {
    window.open(`${this.serverLocation}/${this.state.roomCodeInput}`,'_self');
  }
  render() {
    let view;
    if (this.state.sending) {
      view = <TransferingFileView up progress={this.state.progress} />;
    } else if (this.state.reciving) {
      view = <TransferingFileView up={false} progress={this.state.progress} />;
    } else if (this.state.connected) {
      view = <ConnectedScreen uploadFile={this.uploadFile} />;
    } else {
      view = (
        <MainScreen
          roomId={this.state.roomId}
          url={`${this.serverLocation}/${this.state.roomId}`}
          roomCodeInput={this.state.roomCodeInput}
          handleChange={this.handleChange}
          connectButtonClicked={this.connectButtonClicked}
        />
      );
    }

    return <Background>{view}</Background>;
  }
}
