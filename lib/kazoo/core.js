/*
 *	Filename: helper.php
 *	Author: Evan Lucas
 *	Copyright: 2012-2013 5060
 *	Description: Core library file for kazoo.js
 *
 *  This file is part of kazoo.js.
 *
 *  kazoo.js is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  kazoo.js is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with kazoo.js.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
var http = require('http'),
	crypto = require('crypto'),
	request = require('request');

exports.createClient = function(options) {
	return new Client(options);
}

var Client = exports.Client = function(options) {
	// options should have the following keys
	//	username
	//	password
	//	baserealm
	//	apiurl
	//	port
	if (!options) throw new Error('options is required');
	
	this.config = options;
	this.authorized = false;
};

Client.prototype.validateConfig = function() {
	return (this.config.username.length && this.config.password.length && this.config.apiurl.length && this.config.baserealm.length);
}

Client.prototype.buildURI = function(args) {
	var self = this;
	return 'http://' + self.config.apiurl + ':' + self.config.port + '/v1/' + args.join('/');
}

Client.prototype.attemptLogin = function(cb) {
	var self = this;
	
	var creds = crypto.createHash('md5').update(self.config.username+':'+self.config.password).digest('hex');
	
	var realm = self.config.username + '.' + self.config.baserealm;
	
	var body = {
		data: {
			credentials: creds,
			realm: realm
		}
	};
	var jsonbody = JSON.stringify(body);
	var opts = {
		uri: 'http://' + self.config.apiurl + ':' + self.config.port + '/v1/user_auth',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Content-Length': Buffer.byteLength(jsonbody)
		},
		body: jsonbody,
		method: "PUT"
	};
	
	request(opts, function(err, res, body){
		console.log('Performing request');
		if (err) return cb(err);
		var output = JSON.parse(body);
		if (output.status == 'success') {
			self.auth_token = output.auth_token;
			self.account_id = output.data.account_id;
			self.owner_id = output.data.owner_id;
			self.authorized = true;
		} else {
			cb(output);
		}
		cb(null, {account_id: self.account_id, owner_id: self.owner_id});
	});
	
}
Client.prototype.generateHeaders = function(method) {
	var self = this;
	if (method.toLowerCase() == 'put' || method.toLowerCase() == 'post') {
		return {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		};
	} else {
		return {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'X-Auth-Token': self.auth_token
		};
	}
}
Client.prototype.get = function() {
	// args should be the path in order follow by the callback
	// ex. 'accounts', ':account_id', function(err, data)
	var self = this;
	var args = Array.prototype.slice.call(arguments),
		cb = (typeof(args[args.length - 1]) === 'function') && args.pop();
	
	if (!self.authorized) {
		cb({status: 'error', message: 'Unauthorized. Please login.'});
	}
	
	var uri = self.buildURI(args);
	var opts = {
		uri: uri,
		headers: self.generateHeaders('get')
	};
	request(opts, function(err, res, body){
		if (err) return cb(err);
		var output = JSON.parse(body);
		if (output.status == 'success') {
			cb(null, output.data);
		} else {
			cb(output);
		}
	});
}

Client.prototype.put = function() {
	// args should be the path in order followed by the putdata, followed by the callback
	// ex. 'accounts', ':account_id', { name: 'New name' }, function(err, data)
	var self = this;
	var args = Array.prototype.slice.call(arguments),
		cb = (typeof(args[args.length - 1]) === 'function') && args.pop(),
		putData = (typeof(args[args.length - 1]) === 'object') && args.pop();
	
	if (!self.authorized) {
		cb({status: 'error', message: 'Unauthorized. Please login.'});
	}
	putData.auth_token = self.auth_token;
	
	var uri = self.buildURI(args);
	var opts = {
		uri: uri,
		headers: self.generateHeaders('put'),
		body: JSON.stringify(putData),
		method: "PUT"
	};
	
	request(opts, function(err, res, body){
		if (err) return cb(err);
		try {
			var output = JSON.parse(body);
			if (output.status == 'success') {
				cb(null, output.data);
			} else {
				cb(output);
			}
		}
		catch (e) {
			return cb(e);
//			console.log('Caught exception: '+e);
		}
	});
}

Client.prototype.post = function() {
	// args should be the path in order followed by the postdata, followed by the callback
	// ex. 'accounts', ':account_id', { name: 'New name' }, function(err, data)
	var self = this;
	var args = Array.prototype.slice.call(arguments),
		cb = (typeof(args[args.length - 1]) === 'function') && args.pop(),
		postdata = (typeof(args[args.length - 1]) === 'object') && args.pop();
	
	if (!self.authorized) {
		cb({status: 'error', message: 'Unauthorized. Please login.'});
	}
	
	postData.auth_token = self.auth_token;
	
	var uri = self.buildURI(args);
	var opts = {
		uri: uri,
		headers: self.generateHeaders('post'),
		body: JSON.stringify(putData),
		method: "POST"
	};
	
	request(opts, function(err, res, body){
		if (err) return cb(err);
		try {
			var output = JSON.parse(body);
			if (output.status == 'success') {
				cb(null, output.data);
			} else {
				cb(output);
			}
		}
		catch (e) {
			return cb(e);
		}
	});
}

Client.prototype.delete = function() {
	// args should be the path in order follow by the callback
	// ex. 'accounts', ':account_id', function(err, data)
	var self = this;
	var args = Array.prototype.slice.call(arguments),
		cb = (typeof(args[args.length - 1]) === 'function') && args.pop();
	
	if (!self.authorized) {
		cb({status: 'error', message: 'Unauthorized. Please login.'});
	}
	
	var uri = self.buildURI(args);
	var opts = {
		uri: uri,
		headers: self.generateHeaders('delete'),
		method: 'delete'
	};
	request(opts, function(err, res, body){
		if (err) return cb(err);
		var output = JSON.parse(body);
		if (output.status == 'success') {
			cb(null, output.data);
		} else {
			cb(output);
		}
	});
}