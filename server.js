const express = require("express");
const cors = require("cors");
require("./database");
const apiRoutes = require("./apis");

const port = 3000;
const app = express();


// Middleware definitions

app.use(cors());
app.use(express.json());


// Route handling (mount the routes)

app.use("/api", apiRoutes);


// Not found middleware

app.use((req, res) => {
	console.log("Invalid path", req.path);
	res.status(404).send( { message: "Invalid path" } );
});


// Start the web server

app.listen(port, () => {
	console.log("Web server listening on port", port);
});


module.exports = app;