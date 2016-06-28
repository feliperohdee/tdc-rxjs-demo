import * as _ from 'lodash';
import * as React from  'react';
import {Observable, Subscription} from 'rxjs';
import {Line} from  'react-chartjs';
import {ITickerData} from '../';

interface IChartProps {
	code: string;
	name: string;
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
			responsive: true,
			scaleOverride: true,
    		scaleSteps: 10,
    		scaleStepWidth: 20,
    		scaleStartValue: 0
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
		return (
			<section className="chart">
				<h2>{this.props.name}</h2>
				<Line data={this.state.data} options={this.options}/>
			</section>
		);
	}
}
