import * as _ from 'lodash';
import * as React from  'react';
import {ITickerData} from '../';

let configs = require('../../../config.json');

interface ISearchProps {
	toggle: (code: string, add?: boolean) => void
}
interface ISearchState {}

export class Search extends React.Component<ISearchProps, ISearchState>{
	private $dropdown: any;

	componentDidMount(): void {
		this.$dropdown = $('.ui.dropdown');

		this.$dropdown.dropdown({
			onAdd: code => this.props.toggle(code),
    		onRemove: code => this.props.toggle(code, false)
		});
	}

	componentWillUnmount(): void {
		this.$dropdown.dropdown('destroy');
	}

	render(): JSX.Element {
		let options: Array<JSX.Element> = _.map(configs.tickers, (name: string, code: string) => <option key={code} value={code}>{name}</option>)

		return (
			<section>
				<select className="ui fluid search dropdown" multiple>
					<option value="">Select Ticker</option>
					{options}
				</select>
			</section>
		);
	}
}
