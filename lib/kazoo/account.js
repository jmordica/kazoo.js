var kazoo = require('./core.js')

var Account = exports.Account = function(account_id, client) {
	if (!account_id) throw new Error('Account must be constructed with account id');
	if (!client) throw new Error('Account must be constructed with client');
	
	this.client = client;
	this.account_id = account_id;
}

Account.prototype = {
	
	getAccount: function() {
		var args = Array.prototype.slice.call(arguments),
			cb = (typeof(args[args.length - 1]) === 'function') && args.pop();
		
		// todo check for a string as first arg, incase the caller wants to fetch an account id other than the current account (masquerading)
		var self = this;
		this.client.get('accounts', self.account_id, function(err, data) {
			if (err) return cb(err);
			if (data) {
				cb(null, data);
			}
		});
	},
	
	getUsers: function() {
		// last arg should be callback
		// first arg should be an object that can contain
		//		account_id
		var args = Array.prototype.slice.call(arguments),
			cb = (typeof(args[args.length - 1]) === 'function') && args.pop();
		var self = this;
		this.client.get('accounts', self.account_id, 'users', function(err, data) {
			if (err) return cb(err);
			if (data) {
				cb(null, data);
			}
		});
	},
	
	// Gets ALL media
	getMedia: function() {
		var args = Array.prototype.slice.call(arguments),
			cb = (typeof(args[args.length - 1]) === 'function') && args.pop();
		var self = this;
		this.client.get('accounts', self.account_id, 'media', function(err, data) {
			if (err) return cb(err);
			if (data) {
				cb(null, data);
			}
		});
	},
	
	// Gets a single media
	getMediaByID: function() {
		
	},
	
	getDevices: function() {
		// todo
		// add option to filter
		// ex. /devices?filter_owner_id=<owner_id>
		var args = Array.prototype.slice.call(arguments),
			cb = (typeof(args[args.length - 1]) === 'function') && args.pop();
		var self = this;
		this.client.get('accounts', self.account_id, 'devices', function(err, data) {
			if (err) return cb(err);
			if (data) {
				cb(null, data);
			}
		});
	}
}