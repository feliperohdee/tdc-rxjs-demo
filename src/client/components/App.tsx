import * as _ from 'lodash';
import * as React from  'react';
import {Observable, Subscription} from 'rxjs';
import {Line} from  'react-chartjs';
import {Ticker as TickerModel} from '../models';
import {Chart} from './';
import {ITicker, ITickerData} from '../';

interface IAppProps {}
interface IAppState {
	tickers: ITicker;
	activeTickers: ITicker;
}

export class App extends React.Component<IAppProps, IAppState>{
	private tickerModel: TickerModel;
	private tickers: any = {
		nflx: null,
		msft: null,
		adbe: null
	}

	constructor(){
		super();

		this.tickerModel = new TickerModel();
		this.state = {
			tickers: this.tickers,
			activeTickers: {}
		}
	}

	toggle(code: string): void {
		let ticker: ITicker = _.get(this.tickers, code);

		if(_.isUndefined(ticker)){
			return;
		}

		this.tickers[code] = this.tickers[code] ? null : this.tickerModel.get(code);

		this.setState({
			tickers: this.tickers,
			activeTickers: _.omitBy(this.tickers, _.isNull)
		});
	}

	render(): JSX.Element {
		let buttons: Array<JSX.Element> = _.map(this.state.tickers as any, (ticker: Observable<ITickerData>, code: string) => {
			return <button key={code} onClick={() => this.toggle(code)}>{ code.toUpperCase() }</button>;
		});
		
		let charts: Array<JSX.Element> = _.map(this.state.activeTickers as any, (ticker: Observable<ITickerData>, code: string) => {
			return <Chart key={code} code={code} ticker={ticker}/>;
		});

		return (
			<section>
				{buttons}
				{charts}
			</section>
		);
	}
}
