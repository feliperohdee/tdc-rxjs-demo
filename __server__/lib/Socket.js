"use strict";
var _ = require('lodash');
var ws = require('ws');
var rxjs_1 = require('rxjs');
var Socket = (function () {
    function Socket() {
        this.channels = new Map();
        this.eventStream = new rxjs_1.Subject();
    }
    Socket.prototype.server = function () {
        if (this.wss) {
            return this.wss;
        }
        this.wss = new ws.Server({
            noServer: true
        });
        return this.wss;
    };
    Socket.prototype.handleUpgrade = function (req, socket, upgradeHead) {
        var _this = this;
        this.wss.handleUpgrade(req, socket, upgradeHead, function (client) {
            _this.setClient(client, 'channels', new Set());
            _this.handleConnection(client);
        });
    };
    Socket.prototype.subscribe = function (client, id) {
        var channelsIn = _.get(client, 'channels', null);
        var channel = this.channels.get(id);
        channelsIn.add(id);
        if (_.isSet(channel)) {
            channel.add(client);
        }
        else {
            this.channels.set(id, new Set([client]));
        }
    };
    Socket.prototype.unsubscribe = function (client, id) {
        var channelsIn = _.get(client, 'channels', null);
        var channel = this.channels.get(id);
        if (_.isSet(channel)) {
            channelsIn.delete(id);
            channel.delete(client);
            if (!channel.size) {
                this.channels.delete(id);
            }
        }
    };
    Socket.prototype.setClient = function (client, key, value) {
        _.set(client, key, value);
    };
    Socket.prototype.sendToClient = function (client, event, payload) {
        if (payload === void 0) { payload = null; }
        this.send(client, {
            e: event,
            p: payload
        });
    };
    Socket.prototype.broadcast = function (event, payload) {
        var _this = this;
        if (payload === void 0) { payload = null; }
        var data = {
            e: event,
            p: payload
        };
        _.each(this.wss.clients, function (client) { return _this.send(client, data); });
    };
    Socket.prototype.broadcastToChannel = function (id, event, payload) {
        var _this = this;
        if (payload === void 0) { payload = null; }
        var channel = this.channels.get(id);
        var data = {
            e: event,
            p: payload,
            c: id
        };
        if (_.isSet(channel)) {
            channel.forEach(function (client) { return _this.send(client, data); });
        }
    };
    Socket.prototype.handleConnection = function (client) {
        var _this = this;
        rxjs_1.Observable.fromEvent(client, 'close')
            .subscribe(function (data) {
            var channelsIn = _.get(client, 'channels');
            channelsIn.forEach(function (id) { return _this.unsubscribe(client, id); });
        });
        rxjs_1.Observable.fromEvent(client, 'message', function (response) { return response; })
            .subscribe(function (response) {
            var parsed = _this.parseIncomingMessage(response);
            if (!parsed) {
                return;
            }
            var event = parsed.e;
            var payload = parsed.p;
            if (event === 'ping') {
                _this.sendToClient(client, 'pong');
            }
            else {
                _this.eventStream.next({ client: client, event: event, payload: payload });
            }
        });
    };
    Socket.prototype.parseIncomingMessage = function (data) {
        try {
            return JSON.parse(data);
        }
        catch (err) {
            console.error(err);
        }
    };
    Socket.prototype.send = function (client, data) {
        if (data === void 0) { data = null; }
        if (_.isObject(data)) {
            data = JSON.stringify(data);
        }
        try {
            client.send(data);
        }
        catch (err) {
            console.error(err);
        }
    };
    return Socket;
}());
exports.Socket = Socket;
//# sourceMappingURL=Socket.js.map