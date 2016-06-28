"use strict";
var _ = require('lodash');
var rxjs_1 = require('rxjs');
var lib_1 = require('../lib');
var configs = require('../../config.json');
var Ticker = (function () {
    function Ticker() {
        var _this = this;
        this.socket = lib_1.SocketInterface.instance;
        this.stocks = _.keys(configs.tickers);
        rxjs_1.Observable.interval(900)
            .mergeMapTo(rxjs_1.Observable.from(this.stocks))
            .map(function (stock) { return ({
            stock: stock,
            value: _.random(100, 150)
        }); })
            .subscribe(function (_a) {
            var stock = _a.stock, value = _a.value;
            _this.socket.broadcastToChannel(stock, 'update', value);
        });
    }
    return Ticker;
}());
exports.Ticker = Ticker;
//# sourceMappingURL=Ticker.js.map