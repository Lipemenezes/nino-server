/** @module persistence/rooms */

var transaction = require('../mechanisms/transaction');
var pool = require('../mechanisms/database.js').pool;


var roomServices = {
	/** @method create
	 * @param room {JSON}
	 * @param class_id {id}
	 * @return Promise {Promise} resolves Room with ID
	 */
	create: function(room, class_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Error, reject to BO
					return;
				}
				transaction.start(client)
				.then(function() {
					return new Promise(function(res,rej) {
						client.query('INSERT INTO rooms (name, class, notificationGroup) VALUES ($1, $2, $3) RETURNING id',[room.name, class_id, room.notificationGroup], function(err, result) {
							if (err) rej(err); //Error, reject to BO
							else if (result.name == "error") rej(result); //Some error occured : rejects
							else res(result);	//Proceed to commit transaction
						});
					});
				}).then(function(result) {
					return transaction.commit(client)
					.then(function() {
						done();
						resolve({room:result.rows[0]}); //Returns to BO
					}).catch(function(err) {
						done(err);
						reject(err); //Rejects to BO
					});
				}).catch(function(err) {
					return transaction.abort(client)
					.then(function() {
						done();
						reject(err); //Rejects the error
					}).catch( function(err2) {
						done(err2);
						reject(err2); //Rejects other error
					});
				});
			});
		});
	},
 /** @method findWithClassId
  * @description Find all rooms for a class
  * @param class_id {id}
  * @return class array {Array<Class>}
  */
	findWithClassId: function(class_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Connection error, aborts already
					return;
				}
				client.query('SELECT id, name FROM rooms WHERE class = $1', [class_id], function(err, result) {
					if (err) reject(err); //Error: rejects to BO
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows); //Executed correctly
					done();
				});
			});
		});
	},
	
	findWithSchoolId: function(school_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Connection error, aborts already
					return;
				}
				client.query('SELECT r.class, r.id, r.name FROM rooms r, schools s, classes c WHERE r.class = c.id AND c.school = s.id AND s.id = $1', [school_id], function(err, result) {
					if (err) reject(err); //Error: rejects to BO
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows); //Executed correctly
					done();
				});
			});
		});
	},
	
	findWithSchoolAndName: function(school_id, name) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Connection error, aborts already
					return;
				}
				client.query('SELECT r.id FROM rooms r, classes c, schools s WHERE s.id = $1 AND r.name = $2 AND r.class = c.id AND c.school = s.id', [school_id], function(err, result) {
					if (err) reject(err); //Error: rejects to BO
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows); //Executed correctly
					done();
				});
			});
		});
	},
	
	findWithId: function(room_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Connection error, aborts already
					return;
				}
				client.query('SELECT class, id, name FROM rooms WHERE id = $1', [room_id], function(err, result) {
					if (err) reject(err); //Error: rejects to BO
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows[0]); //Executed correctly
					done();
				});
			});
		});
	},
	
	addEducator: function(educator_profile_id, room_id) {

	},
	removeEducatorFromRoom: function(educator_profile_id, room_id) {

	},
	update: function(roomInfo) {

	},

	delete: function(room_id) {

	},
	
	findWithEmployeeProfileAndRoomId: function(employee_profile_id, room_id) {
		return new Promise(function (resolve, reject) {
			pool.connect(function(err, client, done) {
				if (err) {
					reject(err); //Connection error, aborts already
					return;
				}
				client.query('SELECT r.id FROM rooms r, classes c, schools s, employees e, profiles p WHERE r.id = $2 AND p.id = $1 AND e.school = s.id AND e.profile = p.id AND c.school = s.id AND r.class = c.id', [employee_profile_id, room_id], function(err, result) {
					if (err) reject(err); //Error: rejects to BO
					else if (result.rowCount === 0) reject(result); //Nothing found, sends error
					else if (result.name == "error") reject(result); //Some error occured : rejects
					else resolve(result.rows); //Executed correctly
					done();
				});
			});
		});
	}

};

module.exports = roomServices;
