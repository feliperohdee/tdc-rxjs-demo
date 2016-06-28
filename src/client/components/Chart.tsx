import * as _ from 'lodash';
import * as React from  'react';
import {Observable, Subscription} from 'rxjs';
import {Line} from  'react-chartjs';
import {ITickerData} from '../';

interface IChartProps {
	code: string;
	ticker: Observable<ITickerData>
}

interface IChartState {
	data: any;
}

export class Chart extends React.Component<IChartProps, IChartState>{
	private subscription: Subscription;
	private options: any;
	private defaultData: any = {
		labels: [0, 5, 10, 15, 20, 25, 30],
        datasets: [{
            fillColor: 'rgba(151,187,205,0.2)',
            strokeColor: 'rgba(151,187,205,1)',
            pointColor: 'rgba(151,187,205,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(151,187,205,1)',
            data: _.range(0, 7, 0)
	       }]
		}

	constructor(props) {
		super(props);

		this.options = {
				title: {
				display: true,
				text: props.code
			}
		};

		this.state = {
			data: this.defaultData
		}
	}

	updateData(data: Array<number>): any {
		this.state.data.datasets[0].data = data;

		return this.state.data;
	}

	componentWillMount(): void {
		this.subscription = this.props.ticker
			.map(tick => tick.p)
			.scan((reduction: Array<number>, value: number) => {
				return _(reduction)
					.push(value)
					.takeRight(7)
					.value();
			}, _.range(0, 7, 0))
			.map(data => this.updateData(data))
			.subscribe(data => this.setState({ data }));
	}

	componentWillUnmount(): void {
		this.subscription.unsubscribe();
	}

	render(): JSX.Element {
		console.log(this.options);
		
		return (
			<section>
				<Line data={this.state.data} options={this.options} width="600" height="250"/>
			</section>
		);
	}
}
