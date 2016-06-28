import * as _ from 'lodash';
import * as ws from 'ws';
import {Observable, Subject} from 'rxjs';
import {Request} from 'restify';
import {Socket as NetSocket} from 'net';

export class Socket {
	public channels: Map<string, Set<ws>> = new Map<string, Set<ws>>();
	public wss: ws.Server;
	public eventStream: Subject<any> = new Subject<any>();

	constructor() { }

	/**
	 * create socket server instance
	 * @return {ws.Server}
	 */
	server(): ws.Server {
		if (this.wss) {
			return this.wss;
		}

		this.wss = new ws.Server({
			noServer: true
		});

		return this.wss;
	}

	/**
	 * handle HTTP upgrade request
	 * @param {Request}   req        
	 * @param {Socket as NetSocket} socket     
	 * @param {Buffer}    upgradeHead
	 */
	handleUpgrade(req: Request, socket: NetSocket, upgradeHead: Buffer): void {
		this.wss.handleUpgrade(req, socket, upgradeHead, client => {
			this.setClient(client, 'channels', new Set());
			this.handleConnection(client);
		});
	}

	/**
	 * subscribe client to a channel
	 * @param {ws} client
	 * @param {string} id
	 */
	subscribe(client: ws, id: string): void {
		let channelsIn: Set<string> = _.get(client, 'channels', null);
		let channel: Set<ws> = this.channels.get(id);

		// add channel to client channels hash
		channelsIn.add(id);

		if (_.isSet(channel)) {
			// add channel
			channel.add(client);
		} else {
			// create new channel
			this.channels.set(id, new Set<ws>([client]));
		}
	}

	/**
	 * unsubscribe client from channel
	 * @param {ws} client
	 * @param {string} id
	 */
	unsubscribe(client: ws, id: string): void {
		let channelsIn: Set<string> = _.get(client, 'channels', null);
		let channel: Set<ws> = this.channels.get(id);

		if (_.isSet(channel)) {
			// remove channel from client channels hash
			channelsIn.delete(id);

			// remove channel
			channel.delete(client);

			if (!channel.size) {
				this.channels.delete(id);
			}
		}
	}

	/**
	 * set key / value to a client
	 * @param {ws}     client
	 * @param {string} key   
	 * @param {any}    value 
	 */
	setClient(client: ws, key: string, value: any): void {
		_.set(client, key, value);
	}

	/**
	 * send an event to a client
	 * @param {ws}     client 
	 * @param {string} event  
	 * @param {any}    payload
	 */
	sendToClient(client: ws, event: string, payload: any = null): void {
		this.send(client, {
			e: event,
			p: payload
		});
	}

	/**
	 * broadcast to all
	 * @param {string} event
	 * @param {any =  null}  payload
	 */
	broadcast(event: string, payload: any = null): void {
		let data: any = {
			e: event,
			p: payload
		};

		_.each(this.wss.clients, client => this.send(client, data));
	}

	/**
	 * broadcast to channel
	 * @param {string} id
	 * @param {string} event
	 * @param {any = null} payload
	 */
	broadcastToChannel(id: string, event: string, payload: any = null): void {
		let channel: Set<ws> = this.channels.get(id);
		let data: any = {
			e: event,
			p: payload,
			c: id
		};

		if (_.isSet(channel)) {
			channel.forEach(client => this.send(client, data));
		}
	}

	/**
	 * handle client connection
	 * @param {ws} client
	 */
	handleConnection(client: ws): void {
		// handle close
		Observable.fromEvent(client, 'close')
			.subscribe(data => {
				let channelsIn: Set<string> = _.get(client, 'channels') as Set<string>;

				// remove client from all channels
				channelsIn.forEach(id => this.unsubscribe(client, id));
			});

		// handle message
		Observable.fromEvent(client, 'message', response => response)
			.subscribe(response => {
				let parsed: any = this.parseIncomingMessage(response);

				if (!parsed){
					return;
				}

				let event: string = parsed.e;
				let payload: any = parsed.p;

				if (event === 'ping') {
					this.sendToClient(client, 'pong');
				} else {
					this.eventStream.next({ client, event, payload });
				}
			});
	}

	/**
	 * handle incoming message
	 * @param  {any} response
	 * @return {any}
	 */
	parseIncomingMessage(data: string): any {
		try {
			return JSON.parse(data);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * send message
	 * @param {ws | string}  client
	 * @param {any} data
	 */
	send(client: ws, data: any = null): void {
		if (_.isObject(data)) {
			data = JSON.stringify(data);
		}

		try {
			client.send(data);
		} catch (err) {
			console.error(err);
		}
	}
}
