"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _1 = require('./');
var SocketInterface = (function (_super) {
    __extends(SocketInterface, _super);
    function SocketInterface() {
        var _this = this;
        _super.call(this);
        this.eventStream
            .filter(function (_a) {
            var event = _a.event;
            return event === 'subscribe' || event === 'unsubscribe';
        })
            .subscribe(function (_a) {
            var event = _a.event, client = _a.client, payload = _a.payload;
            if (!payload) {
                return;
            }
            _this[event](client, payload);
        });
    }
    Object.defineProperty(SocketInterface, "instance", {
        get: function () {
            if (!SocketInterface._instance) {
                SocketInterface._instance = new SocketInterface();
            }
            return SocketInterface._instance;
        },
        enumerable: true,
        configurable: true
    });
    return SocketInterface;
}(_1.Socket));
exports.SocketInterface = SocketInterface;
//# sourceMappingURL=SocketInterface.js.map