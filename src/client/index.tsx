import * as React from  'react';
import * as ReactDom from  'react-dom';
import {Observable} from 'rxjs';
import {App} from './components';

export interface ITickerData {
	c: string;
	e: string;
	p: number;
}

export interface ITicker{
	code?: string;
	ticker?: Observable<any>
}

ReactDom.render(<App/>, document.getElementById('app'));
