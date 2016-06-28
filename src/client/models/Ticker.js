"use strict";
var _ = require('lodash');
var rxjs_1 = require('rxjs');
var Ticker = (function () {
    function Ticker() {
    }
    Object.defineProperty(Ticker.prototype, "ws", {
        get: function () {
            if (!(this.isOpen() || this.isConnecting())) {
                this._ws = rxjs_1.Observable.webSocket('ws://localhost:3000/ws');
                this._source = this._ws.share();
            }
            return {
                client: this._ws,
                source: this._source
            };
        },
        enumerable: true,
        configurable: true
    });
    Ticker.prototype.get = function (code) {
        var _this = this;
        return rxjs_1.Observable.create(function (subscriber) {
            var sub = _this.ws.source
                .filter(function (_a) {
                var c = _a.c, e = _a.e;
                return e === 'update' && c === code;
            })
                .subscribe(subscriber);
            _this.send({
                e: 'subscribe',
                p: code
            });
            return function () {
                _this.send({
                    e: 'unsubscribe',
                    p: code
                });
                sub.unsubscribe();
            };
        })
            .retryWhen(function (err) { return err.delay(1000); });
    };
    Ticker.prototype.isOpen = function () {
        if (!_.get(this, '_ws.socket')) {
            return false;
        }
        return !!(this._ws.socket.readyState === this._ws.socket.OPEN);
    };
    Ticker.prototype.isConnecting = function () {
        if (!_.get(this, '_ws.socket')) {
            return false;
        }
        return !!(this._ws.socket.readyState === this._ws.socket.CONNECTING);
    };
    Ticker.prototype.send = function (data) {
        if (_.isObjectLike(data)) {
            data = JSON.stringify(data);
        }
        this.ws.client.next(data);
    };
    return Ticker;
}());
exports.Ticker = Ticker;
//# sourceMappingURL=Ticker.js.map