/*
 *	Filename: account.js
 *	Date: 1/7/13
 *	
 *	Description: Module to interact with Kazoo accounts
 *	Author: Evan Lucas
 *	
 */
var kazoo = require('./core.js')

var Account = exports.Account = function(account_id, client) {
	if (!account_id) throw new Error('Account must be constructed with account id');
	if (!client) throw new Error('Account must be constructed with client');
	
	this.client = client;
	this.account_id = account_id;
}

Account.prototype = {
	
	//
	//	Name: getAccount
	//	Description: Gets the main account for which the user authenticated or, if passed an account_id as the first arg, for the provided account id
	//	
	//	Args: 
	//		callback: function(err, data)
	//		account_id (string), callback: function(err, data)
	//
	//
	getAccount: function() {
		var args = Array.prototype.slice.call(arguments),
			cb = (typeof(args[args.length - 1]) === 'function') && args.pop();
		var account_id;
		if (args.length == 1) {
			account_id = args[0];
		}
		if (!account_id) {
			account_id = self.account_id;
		}
		// todo check for a string as first arg, incase the caller wants to fetch an account id other than the current account (masquerading)
		var self = this;
		this.client.get('accounts', account_id, function(err, data) {
			if (err) return cb(err);
			cb(null, data);
		});
	},
	
	//
	//	Name: getUsers
	//	Description: Fetches the users for a particular account
	//	
	//	Args: 
	//		getUsers(function(err, data){})
	//		getUsers('<account_id>', function(err, data){})
	//
	//
	
	
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
			cb(null, data);
		});
	},

	//
	//	Name: getUserByID
	//	Description: Fetches a user's details with the provided user_id
	//	
	//	Args: account_id, user_id, callback
	//	
	//	If account_id is not passed, then the authenticated user's account id will be used
	//	Same goes for the user id (the owner_id will be used)
	//
	//
	
	getUserByID: function() {
		var args = Array.prototype.slice.call(arguments),
			cb = (typeof(args[args.length - 1]) === 'function') && args.pop(),
			user_id = (typeof(args[args.length - 1]) === 'string') && args.pop(),
			self = this;
		if (!user_id) return cb({status: 'error', message: 'No user_id given'});
		this.client.get('accounts', self.account_id, 'users', user_id, cb);
	},

	//
	//	Name: getMedia
	//	Description: Fetches the media for a particular account
	//	
	//	Args: account_id, callback
	//	If account_id is not present, the authed user's account_id will be used
	//
	// Gets ALL media
	getMedia: function() {
		var args = Array.prototype.slice.call(arguments),
			cb = (typeof(args[args.length - 1]) === 'function') && args.pop(),
			account_id = (typeof(args[args.length - 1]) === 'string') && args.pop();
		
		if (!account_id) account_id = self.account_id;
		var self = this;
		this.client.get('accounts', account_id, 'media', function(err, data) {
			if (err) return cb(err);
			cb(null, data);
		});
	},
	
	//
	//	Name: getMediaByID
	//	Description: Fetches details of a single media item
	//	
	//	Args: account_id, media_id, callback
	//
	//
	// Gets a single media
	getMediaByID: function() {
		var args = Array.prototype.slice.call(arguments),
			cd = (typeof(args[args.length - 1]) === 'function') && args.pop();
		// since we popped the callback, our args should only be 1 (the media id)
		// that is unless the account id is passed (it would have to be passed as the first argument)

		var media_id;
	
		if (args.length == 1) {
			media_id = (typeof(args[args.length - 1]) === 'string') && args.pop();
		} else if (args.length == 2) {
			media_id = (typeof(args[args.length - 1]) === 'string') && args.pop();
			account_id = (typeof(args[args.length - 1]) === 'string') && args.pop();
		}
		if (!media_id) {
			return cb({status: 'error', message: 'No media id was given'});
		}
		if (!account_id) account_id = self.account_id;
		var self = this;
		this.client.get('accounts', account_id, 'media', media_id, function(err, data) {
			if (err) return cb(err);
			if (data) {
				cb(null, data);
			}
		});
	},
	
	//
	//	Name: getDevices
	//	Description: gets all devices for an account
	//	
	//	Args: account_id, callback
	//
	//
	getDevices: function() {
		// todo
		// add option to filter
		// ex. /devices?filter_owner_id=<owner_id>
		var args = Array.prototype.slice.call(arguments),
			cb = (typeof(args[args.length - 1]) === 'function') && args.pop(),
			account_id = (typeof(args[args.length - 1]) === 'string') && args.pop();

		if (!account_id) account_id = self.account_id;
		var self = this;
		this.client.get('accounts', account_id, 'devices', function(err, data) {
			if (err) return cb(err);
			if (data) {
				cb(null, data);
			}
		});
	},
	
	//
	//	Name: getDeviceByID
	//	Description: gets details of a single device
	//	
	//	Args: account_id, device_id (required), callback
	//
	//
	getDeviceByID: function() {
		var args = Array.prototype.slice.call(arguments),
			cb = typeof(args[args.length - 1]) === 'function') && args.pop(),
			device_id = typeof(args[args.length - 1]) === 'string') && args.pop(),
			account_id = typeof(args[args.length - 1]) === 'string') && args.pop();
			
		if (!account_id) account_id = self.account_id;
		if (!device_id) {
			return cb({status: 'error', message: 'Device id must be passed'});
		}
		var self = this;
		
		self.client.get('accounts', account_id, 'devices', device_id, function(err, data) {
				if (err) return cb(err);
				cb(null, data);
		});
	},

	//
	//	Name: getDevicesForOwnerID
	//	Description: Fetches all devices for a particular owner/user id
	//	
	//	Args: account_id, owner_id
	//
	//
	getDevicesForOwnerID: function() {
		var args = Array.prototype.slice.call(arguments),
			cb = (typeof(args[args.length - 1]) === 'function') && args.pop(),
			owner_id = (typeof(args[args.length - 1]) === 'string') && args.pop(),
			account_id = (typeof(args[args.length - 1]) === 'string') && args.pop();
		if (!owner_id) owner_id = self.owner_id;
		if (!account_id) account_id = self.account_id;
		var self = this;
		self.client.get('accounts', account_id, 'devices?filter_owner_id='+owner_id, function(err, data) {
			if (err) return cb(err);
			cb(null, data);
		});
	}
}
