const getItems = function(conn, callback) {

	const sql = 'SELECT * FROM items';

	conn.query(sql, function (error, results) {
		callback(error, results);
	});
}

const addItem = function(conn, data, callback) {

	const sql = 'INSERT INTO items SET ?';

	conn.query(sql, data, function (error, results) {
		callback(error, results);
	});
}

const deleteItems = function(conn, name, callback) {

	const sql = 'DELETE FROM items WHERE name = ?';

	conn.query(sql, [ name ], function (error, results) {
		callback(error, results);
	});
}

const updateItems = function(conn, data, callback) {

	const updateData = [ data.quantity, data.name ];
	const sql = 'UPDATE items SET quantity = ? WHERE name = ?';

	conn.query(sql, updateData, function(error, results) {
		callback(error, results);
	});
}

module.exports = {
	getItems,
	addItem,
	deleteItems,
	updateItems
};
