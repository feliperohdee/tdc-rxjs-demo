import * as _ from 'lodash';
import {Observable} from 'rxjs';
import {SocketInterface} from '../lib';

export class Ticker {
	private socket: SocketInterface = SocketInterface.instance;
	private stocks: Array<string> = ['msft', 'nflx', 'adbe'];

	constructor(){
		Observable.interval(500)
			.mergeMapTo(Observable.from(this.stocks))
			.map(stock => ({
				stock,
				value: _.random(100, 150)
			}))
			.subscribe(({stock, value}) => {
				this.socket.broadcastToChannel(stock, 'update', value);
			});
	}
}
