const fs = require('fs');
var key = fs.readFileSync('C:/Users/Profesor/Downloads/project12/certs/key.pem');
var pubkey = fs.readFileSync('C:/Users/Profesor/Downloads/project12/certs/pubkey.pem');
var cert = fs.readFileSync('C:/Users/Profesor/Downloads/project12/certs/cert.pem');

module.exports = {
	secret: key,
	pubkey: pubkey,
	cert: cert
}