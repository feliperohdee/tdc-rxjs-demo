import * as _ from 'lodash';
import * as ws from 'ws';
import routes from './routes';
import {SocketInterface} from './lib';
import {
	createServer,
	queryParser,
	bodyParser,
	Server as RestifyServer
} from 'restify';

export class Boot {
	public socketServer: ws.Server;
	public server: RestifyServer;

	constructor() {
		this.socketServer = SocketInterface.instance.server();
		this.server = createServer({
			handleUpgrades: true
		});

		// server config
		this.server.opts(/.*/, (req, res, next) => res.send(200));

		// routes
		routes(this.server);

		this.server.listen(process.env.PORT || 3000, () => console.log(`server running on ${process.env.PORT || 3000} and pid ${process.pid}`));
	}
}
