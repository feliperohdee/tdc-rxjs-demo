import {Server} from 'restify';
import {Socket} from './Socket';
import {Http} from './Http';

export default (server: Server) => {
	let socket: Socket = new Socket(server);
	let http: Http = new Http(server);
};
