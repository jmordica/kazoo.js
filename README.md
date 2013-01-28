## kazoo.js
### A node module for the Kazoo Platform

### To use

- Import the module

	var kazoo = require('kazoo');

- Setup config

		var config = {
			username: '<USERNAME>',
			pssword: '<PASSWORD>',
			apiurl: '<API_URL>',
			baserealm: '<BASE REALM>',
			port: '<BASE PORT>'
		};

- Create client

		var client = kazoo.createClient(config);


- Attempt Login

		client.attemptLogin(function(err, data){
			if (err) {
				console.log('Error logging in');
				console.log(err);
			}
			
			if (data) {
				console.log('Login successful');
				var account_id = data.account_id;
				var account = new kazoo.Account(account_id, client);
				
				account.getUsers(function(err, data){
					if (err) console.log(err);
					console.log(data);
				});
			}
		});

- The accounts submodule is set up in a way that the account id does not have to be specified.  If it is not specified, the account id must the supplied as the first argument in the call
ex.

			var account = new kazoo.Account('1231212312312', client);
			account.getAccount(function(err, data){
				// Your code here
			});
		
	Will yield the same results as

			var account = new kazoo.Account('1231212312312', client);
			account.getAccount('1231212312312', function(err, data){
				// Your code here
			});
		

- Quite a few of the Kazoo API Endpoints have been finished.  There are still a couple that have not.  Those will be updated in the very near future.


### License
GPL