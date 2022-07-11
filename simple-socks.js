import socks5 from "simple-socks";

const server = socks5.createServer({
	authenticate: function (username, password, socket, callback) {
		// verify username/password
		if (username !== "admin" || password !== "123456") {
			// respond with auth failure (can be any error)
			return setImmediate(callback, new Error("invalid credentials"));
		}

		// return successful authentication
		return setImmediate(callback);
	},
});

// start listening!
server.listen(9000);
console.log("socks5 server on 9000!");

server.on("handshake", function () {
	console.log();
	console.log("------------------------------------------------------------");
	console.log("new client connection");
});

// When authentication succeeds
server.on("authenticate", function (username) {
	console.log("user %s successfully authenticated!", username);
});

// When authentication fails
server.on("authenticateError", function (username, err) {
	console.log("user %s failed to authenticate...", username);
	console.log(err);
});

// When a reqest arrives for a remote destination
server.on("proxyConnect", function (info, destination) {
	console.log("connected to remote server at %s:%d", info.address, info.port);

	destination.on("data", function (data) {
		console.log("destination data:", data.length);
	});
});

server.on("proxyData", function (data) {
	console.log("proxy data:", data.length);
});

// When an error occurs connecting to remote destination
server.on("proxyError", function (err) {
	console.error("unable to connect to remote server");
	console.error(err);
});

// When a proxy connection ends
server.on("proxyEnd", function (response, args) {
	console.log("socket closed with code %d", response);
	console.log(args);
	console.log();
});
