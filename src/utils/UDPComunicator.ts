import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

class UDPCommunicator {
    private socket: any;
    private buffer = Buffer.alloc(8, 0);
    private clientPort = 4445;
    private serverPort = 4444;
    private serverAddress = '192.168.0.1';
    private handshakeInterval: any = null;
    private sendInterval: any = null;
    private isClosing = false;

    speed = 0;
    rotation = 0;
    grab = false;
    lift = false;

    status = 'not connected';
    private onConnectCallback: () => void = () => {};
    private onTimeOutCallback: () => void = () => {};
    private onErrorCallback: () => void = () => {};
    private onDisconnectCallback: () => void = () => {};

    constructor() {}

    private initSocket() {
        this.isClosing = false;
        this.socket = dgram.createSocket({ type: 'udp4' }) as any;
        this.socket.bind(this.clientPort);

        this.socket.on('error', (err: Error) => {
            console.log(`Socket error:\n${err.stack}`);

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

                this.socket.removeAllListeners('message');
                this.onConnectCallback();
                this.send();
            }
        });
    }

    private resetSocket() {
        this.isClosing = true;

        if (this.handshakeInterval) {
            clearInterval(this.handshakeInterval);
            this.handshakeInterval = null;
        }

        if (this.sendInterval) {
            clearInterval(this.sendInterval);
            this.sendInterval = null;
        }

        if (!this.socket) {
            return;
        }

        try {
            this.socket.removeAllListeners('error');
            this.socket.removeAllListeners('message');
            this.socket.on('error', () => {});
        } catch (error) {}

        const socketToClose = this.socket;
        this.socket = null;

        setTimeout(() => {
            try {
                socketToClose.close();
                console.log('Native ThreadPool safely terminated.');
            } catch (error) {}
            this.status = 'not connected';
        }, 150);
    }

    private send() {
        this.sendInterval = setInterval(() => {
            if (this.isClosing || !this.socket) {
                return;
            }

            console.log('Sending data to server');
            console.log(this.speed, this.rotation, this.grab, this.lift);
            console.log('===============================');

            this.buffer.write('its', 0, 3);
            this.buffer.writeInt8(this.speed, 3);
            this.buffer.writeInt8(this.rotation, 4);
            this.buffer.writeInt8(this.grab ? 1 : 0, 5);
            this.buffer.writeInt8(this.lift ? 1 : 0, 6);

            try {
                this.socket.address();
                this.socket.send(
                    this.buffer,
                    0,
                    this.buffer.length,
                    this.serverPort,
                    this.serverAddress,
                    (err: any) => {
                        if (err) {
                            this.resetSocket();
                            this.onErrorCallback();
                            console.log('Error in handshake send:', err);
                        }
                    },
                );
            } catch (err) {
                if (err) {
                    this.resetSocket();
                    this.onErrorCallback();
                    console.log('Error in handshake send:', err);
                }
            }
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

    onDisconnect(onDisconnectCallback: () => void) {
        this.onDisconnectCallback = onDisconnectCallback;
    }

    connect() {
        console.log('oncon', this.status);
        if (this.status === 'connected') return;
        this.status = 'connecting';

        if (this.handshakeInterval) {
            clearInterval(this.handshakeInterval);
            this.handshakeInterval = null;
        }

        if (this.socket != null) {
            this.resetSocket();
        }

        this.initSocket();

        let timeOut = 0;
        this.handshakeInterval = setInterval(() => {
            if (this.isClosing || !this.socket || this.status === 'connected') {
                return;
            }

            const msg = Buffer.alloc(8, 0);
            msg.write('itsrcnt');
            console.log('send message', msg.toString());

            try {
                this.socket.address();
                this.socket.send(
                    msg,
                    0,
                    msg.length,
                    this.serverPort,
                    this.serverAddress,
                    (err: any) => {
                        if (err) {
                            this.resetSocket();
                            this.onErrorCallback();
                            console.log('Error in handshake send:', err);
                        }
                    },
                );
            } catch (error) {
                if (error) {
                    this.resetSocket();
                    this.onErrorCallback();
                    console.log('Error sending handshake:', error);
                }
            }

            timeOut += 0.5;

            // timeout after 5 seconds
            if (timeOut >= 5) {
                if (this.handshakeInterval) {
                    clearInterval(this.handshakeInterval);
                    this.handshakeInterval = null;
                }
                this.resetSocket();
                this.onTimeOutCallback();

                console.log('Connection timed out');
                this.status = 'time out';
            }
        }, 500);
    }

    disconnect() {
        console.log('ondis', this.status);
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
        this.onDisconnectCallback();
        this.status = 'not connected';
    }
}

const UDPCom = new UDPCommunicator();
export default UDPCom;
