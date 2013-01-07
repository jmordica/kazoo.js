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
		// can be run one of two ways
		// 1 argument (callback) uses the authenticated user's account id to fetch the users
		// 2 arguments (account_id, callback) uses the given account id (will fail if not authorized to view that particular account information though
		var args = Array.prototype.slice.call(arguments),
			cb = (typeof(args[args.length - 1]) === 'function') && args.pop();
		var account_id;
		if (args.length == 1) {
			account_id = (typeof(args[args.length - 1]) === 'string') && args.pop();
		} else {
			account_id = self.account_id;
		}
		
		var self = this;
		this.client.get('accounts', account_id, 'users', function(err, data) {
			if (err) return cb(err);
			if (data) {
				cb(null, data);
			}
		});
	},

	// Gets a single user by id	
	getUserByID: function() {
		var args = Array.prototype.slice.call(arguments),
			cb = (typeof(args[args.length - 1]) === 'function') && args.pop(),
			user_id = (typeof(args[args.length - 1]) === 'string') && args.pop(),
			self = this;
		if (!user_id) return cb({status: 'error', message: 'No user_id given'});
		this.client.get('accounts', self.account_id, 'users', user_id, cb);
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
		var args = Array.prototype.slice.call(arguments),
			cd = (typeof(args[args.length - 1]) === 'function') && args.pop();
		// since we popped the callback, our args should only be 1 (the media id)
		
		var media_id;
	
		if (args.length == 1) {
			media_id = (typeof(args[args.length - 1]) === 'string') && args.pop();
		}
		if (!media_id) {
			return cb({status: 'error', message: 'No media id was given'});
		}
		var self = this;
		this.client.get('accounts', self.account_id, 'media', media_id, function(err, data) {
			if (err) return cb(err);
			if (data) {
				cb(null, data);
			}
		});
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
