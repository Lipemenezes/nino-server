/** @module business/activities */

var validator = require('validator');
var response = require('../mechanisms/response.js') ;
var activitiesDAO = require('../persistence/activities.js');
var jwt = require('../mechanisms/jwt.js')
var activities = {};

/**
* @description
* @param School {id}
* @param Description {string}
* @param token {string} token decoded
* @return activity {id}
*/
activities.createActivityToSchool = function(school, description, token ) {
  return new Promise(function(resolve, reject) {
		if (!validator.isEmail(account.email)) reject(new response(400),'email',1);
		return (jwt.validate(token, school))
		.then (function (decoded) {
			return activitiesDAO.createActivityToSchool(school, description)
			.then(function(response) {
				resolve(response);
			}).catch(function(err) {
				reject(err);
			});
		}); //TODO: faltou parenteses de novo hahaha lembra de testar cara :)
	});
}
//02-154-980
/**
* @description Add activity to the current class in process after validates the <tt>Token</tt>
* @param School {id}
* @param Class {id}
* @param activity {Activity} parameters filled with information about activity
*/
<<<<<<< HEAD
activities.addActivityToClass = function(school, class_id, activity) {
=======
activities.addActivityToClass = function(school, activity, _class, token) { //TODO: aqui o class é palavra reservada D: ele serve como campo de um objeto mas nao como variavel pelo que parece... assim vai rodar :)
>>>>>>> 5d2fe33378b6ba363382fd9a446e098c3e730805
  return new Promise(function(resolve, reject) {
    return activitiesDAO.addActivityToClass(school, class_id, activity);
  }).then(function(response){
    resolve(response);
  }).catch(function(err) {
    reject(err);
  });
}

/**
* @description get activities for a given <tt>School</tt> after validates the <tt>Token</tt>
* @param School {id}
* @return activity {Array} it returns an array of activities
*/
activities.getActivityForSchool = function(school) {
  return new Promise(function(resolve, reject) {
    return activitiesDAO.getActivityForSchool(school);
  }).then(function(activities){
    resolve(activities);
  }).catch(function(err) {
    reject(err);
  });
}

/**
* @description get activities for a given <tt>Class</tt> after validates the <tt>Token</tt>
* @param Class {id}
* @return activity {Array} it returns an array of activities
*/
activities.getActivityForClass = function(class_id) {
  return new Promise(function(resolve, reject) {
    return activitiesDAO.getActivityForClass(class_id);
  }).then(function(activities){
    resolve(activities);
  }).catch(function(err) {
    reject(err);
  });
}
