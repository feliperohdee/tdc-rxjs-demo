import {
	Server,
	serveStatic
} from 'restify';
import {resolve} from 'path';

export class Http {
	constructor(server: Server) {
		server.get('/', serveStatic({
			directory: resolve('./public'),
			file: 'index.html'
		}));

		server.get(/\/__client__\/?.*/, serveStatic({
			directory: resolve('./')
		}));
	}
}
