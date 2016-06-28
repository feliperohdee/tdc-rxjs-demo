import * as _ from 'lodash';
import {
	Observable,
	Subscriber,
	Subscription,
	Subject
} from 'rxjs';
import {
	WebSocketSubject,
	WebSocketSubjectConfig
} from 'rxjs/observable/dom/WebSocketSubject';
import {ITickerData} from '../';

export class Ticker {
	private _ws: WebSocketSubject<ITickerData>;
	private _source: Observable<ITickerData>;
	public connectionState: Subject<Event> = new Subject<Event>();

	get ws(): {client: WebSocketSubject<ITickerData>, source: Observable<ITickerData>} {
		if (!(this.isOpen() || this.isConnecting())) {
			this._ws = Observable.webSocket<ITickerData>({
				url: 'ws://localhost:3000/ws',
				openObserver: this.connectionState,
				closeObserver: this.connectionState
			});
			this._source = this._ws.share();
		}

		return {
			client: this._ws,
			source: this._source
		};
	}

	get(code: string): Observable<ITickerData> {
		return Observable.create((subscriber: Subscriber<ITickerData>) => {
			let sub: Subscription = this.ws.source
				.filter(({c, e}) => e === 'update' && c === code)
				.subscribe(subscriber);

			this.send({
				e: 'subscribe',
				p: code
			});

			return () => {
				this.send({
					e: 'unsubscribe',
					p: code
				});

				sub.unsubscribe();
			}
		})
		.retryWhen(err => err.delay(1000));
	}

	private isOpen(): boolean {
		if (!_.get(this, '_ws.socket')) {
			return false;
		}

		return !!(this._ws.socket.readyState === this._ws.socket.OPEN);
	}

	private isConnecting(): boolean {
		if (!_.get(this, '_ws.socket')) {
			return false;
		}

		return !!(this._ws.socket.readyState === this._ws.socket.CONNECTING);
	}

	private send(data: any): void {
		if (_.isObjectLike(data)) {
			data = JSON.stringify(data);
		}

		this.ws.client.next(data);
	}
}
