/// <reference path="assertion-error/assertion-error.d.ts" />
/// <reference path="chai/chai.d.ts" />
/// <reference path="es6-shim/es6-shim.d.ts" />
/// <reference path="lodash/lodash.d.ts" />
/// <reference path="mocha/mocha.d.ts" />
/// <reference path="node/node.d.ts" />
/// <reference path="react/react-dom.d.ts" />
/// <reference path="react/react.d.ts" />
/// <reference path="sinon-chai/sinon-chai.d.ts" />
/// <reference path="sinon/sinon.d.ts" />
/// <reference path="superagent/superagent.d.ts" />
/// <reference path="supertest/supertest.d.ts" />
/// <reference path="ws/ws.d.ts" />
/// <reference path="bunyan/bunyan.d.ts" />
/// <reference path="restify/restify.d.ts" />

interface IReactCharts {
	Line: any;
}

declare module 'react-chartjs' {
	var ReactCharts: IReactCharts;

	export = ReactCharts;
}

declare module 'restify' {
	import {Socket} from 'net';

	interface IUpgrade {
		socket: Socket;
		head: Buffer;
	}

	interface Response {
		claimUpgrade(): IUpgrade;
	}
}
