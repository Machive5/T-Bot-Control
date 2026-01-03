import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import UdpSockets from 'react-native-udp';

class UDPCommunicator {
  private socket: any;
  private buffer = Buffer.alloc(8, 0);
  private clientPort = 4445;
  private serverPort = 4444;
  private serverAddress = '192.168.0.1';
  private handshakeInterval: any = null;
  private sendInterval: any = null;

  speed = 0;
  rotation = 0;
  grab = false;
  lift = false;

  status = 'not connected';
  private onConnectCallback: () => void = () => {};
  private onTimeOutCallback: () => void = () => {};
  private onErrorCallback: () => void = () => {};

  constructor() {}

  private initSocket() {
    this.socket = dgram.createSocket({ type: 'udp4' }) as any;
    this.socket.bind(this.clientPort);

    this.socket.on('error', (err: Error) => {
      console.log(`Socket error:\n${err.stack}`);

      if (this.handshakeInterval) {
        clearInterval(this.handshakeInterval);
        this.handshakeInterval = null;
      }

      if (this.sendInterval) {
        clearInterval(this.sendInterval);
        this.sendInterval = null;
      }

      this.resetSocket();
      this.onErrorCallback();
      this.status = 'network error';
    });

    this.socket.on('message', (msg: Buffer) => {
      console.log('Message received from server');
      console.log(msg.toString(), msg.length);
      if (msg.length >= 7 && msg.toString() == 'itsrgrn') {
        this.status = 'connected';
        console.log('Connected to server');

        if (this.handshakeInterval) {
          clearInterval(this.handshakeInterval);
          this.handshakeInterval = null;
        }

        this.send();
        this.onConnectCallback();
      }
    });
  }

  private resetSocket() {
    this.socket.removeAllListeners('error');
    this.socket.removeAllListeners('message');
    this.socket.close();
    this.socket = null;
  }

  private send() {
    this.sendInterval = setInterval(() => {
      console.log('Sending data to server');
      console.log(this.speed, this.rotation, this.grab, this.lift);
      console.log('===============================');

      this.buffer.write('its', 0, 3);
      this.buffer.writeInt8(this.speed, 3);
      this.buffer.writeInt8(this.rotation, 4);
      this.buffer.writeInt8(this.grab ? 1 : 0, 5);
      this.buffer.writeInt8(this.lift ? 1 : 0, 6);

      this.socket.send(
        this.buffer,
        0,
        this.buffer.length,
        this.serverPort,
        this.serverAddress,
      );
    }, 33);
  }

  onConnect(onConnectCallback: () => void) {
    this.onConnectCallback = onConnectCallback;
  }

  onTimeOut(onTimeOutCallback: () => void) {
    this.onTimeOutCallback = onTimeOutCallback;
  }

  onError(onErrorCallback: () => void) {
    this.onErrorCallback = onErrorCallback;
  }

  connect() {
    if (this.status === 'connected') return;
    this.status = 'connecting';

    if (this.socket != null) {
      this.resetSocket();
    }

    this.initSocket();

    if (this.handshakeInterval) {
      clearInterval(this.handshakeInterval);
      this.handshakeInterval = null;
    }

    let timeOut = 0;
    this.handshakeInterval = setInterval(() => {
      const msg = Buffer.alloc(8, 0);
      msg.write('itsrcnt');
      console.log('send message', msg.toString());

      this.socket.send(msg, 0, msg.length, this.serverPort, this.serverAddress);

      timeOut += 0.5;

      // timeout after 5 seconds
      if (timeOut >= 5) {
        if (this.handshakeInterval) {
          clearInterval(this.handshakeInterval);
          this.handshakeInterval = null;
        }
        this.onTimeOutCallback();
        this.resetSocket();

        console.log('Connection timed out');
        this.status = 'time out';
      }
    }, 500);
  }

  disconnect(callBack?: () => void) {
    if (this.status !== 'connected' && this.status !== 'connecting') {
      return;
    }

    this.speed = 0;
    this.rotation = 0;
    this.grab = false;
    this.lift = false;

    if (this.handshakeInterval) {
      clearInterval(this.handshakeInterval);
      this.handshakeInterval = null;
    }

    if (this.sendInterval) {
      clearInterval(this.sendInterval);
      this.sendInterval = null;
    }

    this.resetSocket();

    if (callBack) {
      callBack();
    }

    this.status = 'not connected';
  }
}

const UDPCom = new UDPCommunicator();
export default UDPCom;
