/** router/activities
*
* Last to modify: Amadeu Cavalcante
*/

var express = require('express');
var router = express.Router();
var responses = require('../mechanisms/responses.js');
var activitiesBO = require('../business/activities.js');

var numberValidate = function(req, res, next, id) {
	if (!isNaN(id)) {
		next();
	} else {
		res.status(400).end(responses.invalidParameters("path_isNaN"));
	}
};

/**
* @description Create activity to school
* Parameters:
* School
* Description
* Name
* Token
* Return:
* {activity: id}
*/
router.post('/:description', function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var missingParameters = [];
		if (req.token === undefined) missingParameters.push("token");
		if (req.rawToken === undefined) missingParameters.push("rawToken");
		if (req.body.school === undefined) missingParameters.push('school');
		if (req.body.name === undefined) missingParameters.push('name');
		if (req.params.description === undefined ) missingParameters.push('description');
		if (missingParameters.length > 0) reject(responses.missingParameters(missingParameters));
		else {
			return activitiesBO.createActivityToSchool(req.body.school, req.params.description, req.device, req.rawToken, req.token)
			.then(function(response){
				res.status(response.code).json(response.json);
			}).catch(function(err) {
				res.status(err.code).json(err.json);
			});
		}
	});
});

/**
* @description Add activity to class
*/
router.post("/:activity/classes/:class_id", function(req, res) {
	//TODO: To adotando o seguinte padrao: quando um parametro de modelo é obrigatório eu boto ele na rota :)
	//TODO: ve no server antigo, eu usava o numberValidate pra validar se é número, ve como eu usava :)
	return new Promise(function(){
		if (req.body.school === undefined) reject(responses.missingParameters('school_id'));
		else if (req.params.activity === undefined) reject(responses.missingParameters('activity_id'));
		else if (req.token === undefined) reject(responses.missingParameters('token'));
		else if (req.params.class_id === undefined ) reject(responses.missingParameters('class_id'));
		else {
			var device = req.useragent.Platform + " " + req.useragent.OS;
			return activitiesBO.addActivityToClass(req.body.school, req.params.class_id, req.params.activity, device, req.rawToken, req.token)
			.then(function(response){
				res.status(response.code).json(response.json);
				resolve(response);
			}).catch(function(err) {
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
});
/**
* @description get activities for School
*/
router.get("/schools/:school", function(req, res) {
	return new Promise(function(){
		if (req.params.school === undefined) reject(responses.missingParameters('School'));
		else if (req.token === undefined) reject(responses.missingParameters('token'));
		else if (req.rawToken === undefined) reject(responses.missingParameters('rawToken'));
		else {
			return activitiesBO.getActivities("forSchool", req.body.school, req.rawToken, req.token)
			.then(function(response){
				res.status(response.code).json(response.json);
				resolve(response);
			}).catch(function(err) {
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
});

/**
* @description get activities for Class
*/
router.get("/classes/:class", function(req, res) {
	return new Promise(function(){
		if (req.params.class === undefined) reject(responses.missingParameters('Class'));
		else if (req.token === undefined) reject(responses.missingParameters('token'));
		else if (req.token === undefined) reject(responses.missingParameters('rawToken'));
		else {
			return activitiesBO.getActivities("forClass", req.body.class, req.rawToken, req.token)
			.then(function(response){
				res.status(response.code).json(response.json);
				resolve(response);
			}).catch(function(err) {
				res.status(err.code).json(err.json);
				reject(err);
			});
		}
	});
});


module.exports = router;
