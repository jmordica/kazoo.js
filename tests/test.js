var kazoo = require('../lib/kazoo.js');

var config = {
	username: 'evan',
	password: 'olemiss',
	apiurl: 'api.comtelconnect.com',
	baserealm: 'voip.comtelconnect.com',
	port: 8000
};

var client = kazoo.createClient(config);
console.log(typeof(config));
client.attemptLogin(function(err, data){
	console.log(err);
	console.log(data);
	client.get('accounts', data.account_id, function(err, data) {
		console.log(err);
		console.log(data);
	});
});