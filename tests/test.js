
var kazoo = require('../lib/kazoo.js'),
	fs = require('fs'),
	clc = require('cli-color'),
	pkg = require('../package.json');

var error = clc.red.bold,
	warn = clc.yellow.bold,
	notice = clc.cyan.bold;

function printError(err) {
	console.log(error('[ERROR] :: '+err));
}
function printWarning(warn) {
	console.log(warn('[WARNING] :: '+warn));
}
function printNotice(note) {
	console.log(notice('[NOTICE] :: '+note));
}

var config;
if (!fs.existsSync('./config.js')) {
	printError('config.js does not exist');
	printError('Please copy config-sample.js to config.js and fill in the correct values');
	process.exit();
} else {
	config = require('./config');
}

var client = kazoo.createClient(config);
client.attemptLogin(function(err, data){
	printNotice('Attempting Login');
	if (err) {
		printError('Error logging in');
		console.log(err);
		process.exit();
	}
	
	if (data) {
		printNotice('Successfully logged in');
		var account_id = data.account_id;
		var account = new kazoo.Account(account_id, client);
		account.getUsers(function(err, data){
			printNotice('Fetching Users');
			if (err) {
				printError('Error fetching users');
				console.log(err);
			}
			if (data) {
				console.log(data);
			}
		});
		
		account.getAccount(function(err, data){
			printNotice('Fetching account');
			if (err) {
				printError('Error fetching account');
				console.log(err);
			}
			if (data) {
				console.log(data);
			}
		});
		
		account.getMedia(function(err, data){
			printNotice('Fetching media');
			if (err) {
				printError('Error fetching media');
				console.log(err);
			}
			if (data) {
				console.log(data);
			}
		});
		
		account.getDevices(function(err, data){
			printNotice('Fetching devices');
			if (err) {
				printError('Error fetching devices');
				console.log(err);
			}
			if (data) {
				console.log(data);
			}
		});
	}
});