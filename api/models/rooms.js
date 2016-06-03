/**
* Amadeu Cavalcante
* Module for Roles
*/
var Waterline = require('waterline');

module.exports =  Waterline.Collection.extend({
  identity : 'room',
  connection: 'default',
		attributes: {
			id: {
				type: 'integer',
				primaryKey: true,
				autoIncrement: true
			},
      name: {
        type: 'string',
        required: true
      },
      students: {
        collection: 'student',
        index: true
      },
      educators: {
        collection: 'educator',
				via: 'rooms'
      },
			type: {
				model: 'class',
				required: true
			},
			active: {
				type: 'boolean',
				defaultsTo: true
			}
    }
  });
