import * as _ from 'lodash';
import {Observable} from 'rxjs';
import {SocketInterface} from '../lib';

let configs = require('../../config.json');

export class Ticker {
	private socket: SocketInterface = SocketInterface.instance;
	private stocks: Array<string> = _.keys(configs.tickers);

	constructor(){
		Observable.interval(900)
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
