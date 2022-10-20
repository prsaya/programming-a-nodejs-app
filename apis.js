const express = require("express");
const router = express.Router();

const dbFunctions = require("./dbFunctions");
const connection = require("./database");


// Middleware, sends a response using the provided message.
// This is used with POST, PATCH and DELETE requests when the 
// input data is not valid and sends a status 404 response.
router.use((req, res, next) => {
	// The reponse object in set with this method which is
	// available for all requests.
	res.invalidInput = (message) => {
		console.log('message:', message);
		res.status(404).send(message);
	}
	next();
});


// Route definitions for GET, POST, PATCH and DELETE

router.get("/items", (req, res, next) => {

	dbFunctions.getItems(connection, (err, result) => {
		if (err) {
			next(err);
		}
		else {
			result = result.map(row => JSON.parse(JSON.stringify(row)));
			res.send(result);
		}
	});
});

router.post("/items", (req, res, next) => {

	const data = req.body;

	if (!data.name || !data.quantity || isNaN(new Number(data.quantity))) {
		res.invalidInput("Name and quantity (a number) are required fields.");
		return;
	}

	dbFunctions.addItem(connection, data, (err, result) => {
		if (err) {
			next(err);
		}
		else {
			res.send({ message: result.affectedRows + " row added." });
		}
	});
});

router.delete("/items/:name", (req, res, next) => {
	
	if (!req.params.name) {
		res.invalidInput("The name to delete is not valid!");
		return;
	}

	dbFunctions.deleteItems(connection, req.params.name, (err, result) => {
		if (err) {
			next(err);
		}
		else {
			res.send({ message: result.affectedRows + " row(s) deleted." });
		}
	});
});

router.patch("/items/:name", (req, res, next) => {

	const data = { 
		quantity: req.body.quantity, 
		name: req.params.name 
	};

	if (!data.name || !data.quantity || isNaN(new Number(data.quantity))) {
		res.invalidInput("Name and/or quantity (a number) are not valid.");
		return;
	}

	dbFunctions.updateItems(connection, data, (err, result) => {
		if (err) {
			next(err);
		}
		else {
			res.send({ message: result.affectedRows + " row(s) updated." });
		}
	});
});


// Error handling middleware.
// Logs database error and sends a status 500 or 409 response.
// This is common for all requests accessing database.
router.use((err, req, res, next) => {
	console.error(err);
	let msg = "Internal server error.";
	let code = 500;
	if (err.code === "ER_DUP_ENTRY" && err.errno === 1062) {
		// Message for the duplicate key error
		msg = "Duplicate data entered - try again.";
		code = 409;
	}
	res.status(code).send(msg);
});


module.exports = router;
