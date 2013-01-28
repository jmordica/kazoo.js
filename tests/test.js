/*
 *	Filename: helper.php
 *	Author: Evan Lucas
 *	Copyright: 2012-2013 5060
 *	Description: Simple test file for kazoo.js
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
var kazoo = require('../lib/kazoo.js'),
	fs = require('fs'),
	pkg = require('../package.json');

var config;
if (!fs.existsSync('./config.js')) {
	console.log('config.js does not exist');
	console.log('Please copy config-sample.js to config.js and fill in the correct values');
	process.exit();
} else {
	config = require('./config');
}

var client = kazoo.createClient(config);
client.attemptLogin(function(err, data){
	console.log('Attempting login');
	if (err) {
		console.log('Error logging in');
		console.log(err);
		process.exit();
	}
	
	if (data) {
		console.log('Successfully logged in');
		var account_id = data.account_id;
		var account = new kazoo.Account(account_id, client);
		account.getUsers(function(err, data){
			console.log('Fetching users');
			if (err) {
				console.log('Error fetching users');
				console.log(err);
			}
			if (data) {
				console.log(data);
			}
		});
		
		account.getAccount(function(err, data){
			console.log('Fetching account');
			if (err) {
					console.log('Error fetching account');
				console.log(err);
			}
			if (data) {
				console.log(data);
			}
		});
		
		account.getMedia(function(err, data){
			console.log('Fetching media');
			if (err) {
				console.log('Error fetching media');
				console.log(err);
			}
			if (data) {
				console.log(data);
			}
		});
		
		account.getDevices(function(err, data){
			console.log('Fetching devices');
			if (err) {
				console.log('Error fetching devices');
				console.log(err);
			}
			if (data) {
				console.log(data);
			}
		});
	}
});