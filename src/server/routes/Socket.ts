import {Server} from 'restify';
import {SocketInterface} from '../lib';

export class Socket {
	private socket: SocketInterface = SocketInterface.instance;

	constructor(server: Server) {		
		server.get('/ws', (req, res, next) => {
			if (!res.claimUpgrade) {
				return next(new Error('Connection must upgrade for webSockets'));
			}

			let upgrade = res.claimUpgrade();

			try{
				this.socket.handleUpgrade(req, upgrade.socket, upgrade.head);
			}catch(err){
				next(err);
			}
		});
	}
}
