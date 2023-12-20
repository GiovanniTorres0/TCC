// ./config/dropboxConfig.js
const Dropbox = require('dropbox').Dropbox;
const dbx = new Dropbox({ accessToken: process.env.DP_ACESS_TOKEN });

module.exports = dbx;
