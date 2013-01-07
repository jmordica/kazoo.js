var Kazoo = exports;

//require('pkginfo')(module, 'version');

Kazoo.createClient = require('./kazoo/core').createClient;

Kazoo.Client = require('./kazoo/core').Client;
Kazoo.Account = require('./kazoo/account').Account;