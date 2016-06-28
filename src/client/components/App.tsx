import * as _ from 'lodash';
import * as React from  'react';
import {Observable, Subscription} from 'rxjs';
import {Line} from  'react-chartjs';
import {Ticker as TickerModel} from '../models';
import {ITicker, ITickerData} from '../';
import {Chart, Search} from './';

let configs = require('../../../config.json');

interface IAppProps {}
interface IAppState {
	tickers: ITicker;
	activeTickers: ITicker;
}

export class App extends React.Component<IAppProps, IAppState>{
	private tickerModel: TickerModel;
	private tickers: any = _.transform(configs.tickers, (reduction: any, name: string, ticker: string) => {
		reduction[ticker] = null;
	}, {});

	constructor(){
		super();

		this.tickerModel = new TickerModel();
		this.state = {
			tickers: this.tickers,
			activeTickers: {}
		}
	}

	toggle(code: string, add: boolean = true): void {
		let ticker: ITicker = _.get(this.tickers, code);

		if(_.isUndefined(ticker)){
			return;
		}

		this.tickers[code] = add ? this.tickerModel.get(code) : null;

		this.setState({
			tickers: this.tickers,
			activeTickers: _.omitBy(this.tickers, _.isNull)
		});
	}

	render(): JSX.Element {		
		let charts: Array<JSX.Element> = _.map(this.state.activeTickers as any, (ticker: Observable<ITickerData>, code: string) => {
			return <Chart key={code} code={code} name={_.get(configs.tickers, code, '')} ticker={ticker}/>;
		});

		return (
			<section className="ui container">
				<Search toggle={(code, add) => this.toggle(code, add)}/>

				{charts}
			</section>
		);
	}
}
