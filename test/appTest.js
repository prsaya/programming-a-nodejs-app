const request = require('supertest');
const app = require('../server');
const conn = require('../database');


suite('Functional Tests', function() {


	suite('Tests for GET POST PATCH DELETE requests with success scenarios', function() {

		suiteSetup('Initialize data in database', function() {
			conn.query('DELETE from items', function(err, results) {
				if (err) throw err;
			});
			const sql = 'INSERT INTO items VALUES("Cookies", 8)';
			conn.query(sql, function(err, result) {
				if (err) throw err;
				console.log('Test data added to database.');
			});
		});

		test('Read all items: GET request to /api/items', function(done) {
			const expected = [ 
				{ 
					name: 'Cookies', 
					quantity: 8 
				} 
			];
			request(app)
				.get('/api/items')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect(function(res) {
					if (res.body.length !== expected.length) 
						throw new Error('Number of items in the response array do not match!');
				})
				.expect(expected)
				.end(function(err, res) {
					if (err) return done(err);
					return done();
				});
		});

		test('Add an item: POST request to /api/items', function(done) {
			const dataToAdd = { 
				name: 'Apples', 
				quantity: 5 
			};
			const expected = { 
				message: '1 row added.' 
			};
			request(app)
				.post('/api/items')
				.set('Accept', 'application/json')
				.send(dataToAdd)
				.expect(200)
				.expect('Content-Type', /json/)
				.expect(expected)
				.end(function(err, res) {
					if (err) return done(err);
					return done();
				});
		});

		test('Delete an item: DELETE request to /api/items/:name', function(done) {
			const itemNameToDelete = 'Apples';
			const expected = { 
				message: '1 row(s) deleted.' 
			};
			request(app)
				.delete('/api/items/' + itemNameToDelete)
				.expect(200)
				.expect('Content-Type', /json/)
				.expect(expected)
				.end(function(err, res) {
					if (err) return done(err);
					return done();
				});
		});

		test('Modify an item: PATCH request to /api/items/:name', function(done) {
			const itemNameToUpdate = 'Cookies';
			const dataToUpdate = { 
				quantity: 4 
			};
			const expected = { 
				message: '1 row(s) updated.' 
			};
			request(app)
				.patch('/api/items/' + itemNameToUpdate)
				.set('Accept', 'application/json')
				.send(dataToUpdate)
				.expect(200)
				.expect('Content-Type', /json/)
				.expect(expected)
				.end(function(err, res) {
					if (err) return done(err);
					return done();
				});
		});

	});


	suite('Tests for data validation failure', function() {

		suiteSetup('Initialize data in database', function() {
			conn.query('DELETE from items', function(err, results) {
				if (err) throw err;
			});
			const sql = 'INSERT INTO items VALUES("Cookies", 8)';
			conn.query(sql, function(err, result) {
				if (err) throw err;
				console.log('Test data added to database.');
			});
		});

		test('Modify an item with *invalid* quantity: PATCH request to /api/items/:name', function(done) {
			const itemNameToUpdate = 'Cookies';
			const invalidDataToUpdate = { 
				quantity: ''
			};
			const expected = 'Name and/or quantity (a number) are not valid.';
			request(app)
				.patch('/api/items/' + itemNameToUpdate)
				.set('Accept', 'application/json')
				.send(invalidDataToUpdate)
				.expect(404)
				.expect('Content-Type', /text/)
				.expect(expected)
				.end(function(err, res) {
					if (err) return done(err);
					return done();
				});
		});

	});


	suite('Tests for database server severe errors', function() {

		setup('Close database connection', function() {
			conn.end(function(err) {
				if (err) throw err;
				console.log('Closing database connection.');
			});
		});

		test('Read all items with *no database connection*: GET request to /api/items', function(done) {
			const expected = 'Internal server error.';
			request(app)
				.get('/api/items')
				.expect('Content-Type', /text/)
				.expect(500)
				.expect(expected)
				.end(function(err, res) {
					if (err) return done(err);
					return done();
				});
		});

	});

});

