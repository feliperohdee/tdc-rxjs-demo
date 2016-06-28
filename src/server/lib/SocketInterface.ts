import {Socket} from './';

export class SocketInterface extends Socket {
	private static _instance: SocketInterface;
	static get instance(): SocketInterface {
		if (!SocketInterface._instance) {
			SocketInterface._instance = new SocketInterface();
		}

		return SocketInterface._instance;
	}

	constructor() {
		super();

		// handle (un)?subscriptions
		this.eventStream
			.filter(({event}) => event === 'subscribe' || event === 'unsubscribe')
			.subscribe(({ event, client, payload }) => {
				if(!payload){
					return;
				}

				this[event](client, payload);
			});
	}
}
