var kazoo = require('./core.js')

var Account = exports.Account = function(account_id, client) {
	if (!account_id) throw new Error('Account must be constructed with account id');
	if (!client) throw new Error('Account must be constructed with client');
	
	this.client = client;
	this.account_id = account_id;
}

Account.prototype = {
	
	getAccount: function() {
		var self = this;
		
	}
	
	users: function() {
		// last arg should be callback
		// first arg should be an object that can contain
		//		account_id
		
		var self = this;
		this.client.get('accounts', self.account_id, 'users', function(err, data) {
			if (err) return cb(err);
			if (data) {
				
			}
		});
	}
}