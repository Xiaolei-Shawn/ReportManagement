var config = require('config.json');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.connectionString);
var userCollection = db.get('users');
var templateCollection = db.get('template');
var reportCollection = db.get('report');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var dataService = {
	getOneTemplate: function(id){
		var deferred = Q.defer();

    	templateCollection.findOne({templateid: id}, function (err, template) {
	        if (err) deferred.reject(err);

	        if (template) {
	            deferred.resolve(_.omit(template, ['_id', 'hash']));
	        } else {
	            // template not found
	            deferred.resolve();
	        }
    	});

    	return deferred.promise;
	},

	getOneReport: function(id){
		var deferred = Q.defer();
    	reportCollection.findOne({reportid: id}, function (err, report) {
	        if (err) deferred.reject(err);
	        if (report) {
	            deferred.resolve(_.omit(report, ['_id', 'hash']));
	        } else {
	            // report not found
	            deferred.resolve();
	        }
    	});

    	return deferred.promise;
	},
	getAllTemplates: function(){
		var deferred = Q.defer();

    	templateCollection.find({}, function (err, templates) {
	        if (err) deferred.reject(err);

	        if (templates) {
	            deferred.resolve(templates);
	        } else {
	            // template not found
	            deferred.resolve();
	        }
    	});

    	return deferred.promise;
	},

	getAllReports: function(){
		var deferred = Q.defer();

    	reportCollection.find({}, function (err, reports) {
	        if (err) deferred.reject(err);

	        if (reports) {
	            deferred.resolve(reports);
	        } else {
	            // report not found
	            deferred.resolve();
	        }
    	});

    	return deferred.promise;
	},

	createReport : function(report){
		var deferred = Q.defer();

    	reportCollection.insert(report, function (err, report) {
	        if (err) deferred.reject(err);

	        if (report) {
	            deferred.resolve(report);
	        } else {
	            // report insert failed
	            deferred.resolve();
	        }
    	});
		console.log("create template!");
    	return deferred.promise;
	},

	createTemplate: function(template) {
		var deferred = Q.defer();

    	templateCollection.insert(template, function (err, template) {
	        if (err) deferred.reject(err);

	        if (template) {
	            deferred.resolve(template);
	        } else {
	            // template insert failed
	            deferred.resolve();
	        }
    	});

    	return deferred.promise;
	},
	 
	updateTemplate: function(template, templateid) {
	    var deferred = Q.defer();
	    templateCollection.findOne({templateid: templateid}, function (err, targetTemplate) {
	        if (err) deferred.reject(err);

	        if (targetTemplate) {
	            templateCollection.findAndModify(
	            	{ templateid : targetTemplate.templateid }, 
	            	{ $set : template }, 
	            	function (updateErr, updatedTemplate) {
			        if (err) deferred.reject(updateErr);

			        if (updatedTemplate) {
			            deferred.resolve(updatedTemplate);
			        } else {
			            deferred.resolve();
			        }
		    	});
	        } else {
	            // template not found
	            deferred.resolve();
	        }
    	});
    	

    	return deferred.promise;
	},
	 
	deleteTemplate: function(id) {
	    var deferred = Q.defer();

    	templateCollection.remove({templateid: id}, function (err) {
	        if (err) deferred.reject(err);

	        deferred.resolve(true);
    	});

    	return deferred.promise;
	},

	updateReport: function(targetReport, reportid) {
	    var deferred = Q.defer();
	    reporteCollection.findOne({reportid: reportid}, function (err, targetReport) {
	        if (err) deferred.reject(err);

	        if (targetReport) {
	            targetReportCollection.findAndModify(
	            	{ targetReportid : targetReport.targetReportid }, 
	            	{ $set : targetReport }, 
	            	function (updateErr, targetReport) {
			        if (err) deferred.reject(updateErr);

			        if (targetReport) {
			            deferred.resolve(targetReport);
			        } else {
			            deferred.resolve();
			        }
		    	});
	        } else {
	            // template not found
	            deferred.resolve();
	        }
    	});
    	

    	return deferred.promise;
	},
	 
	deleteReport: function(id) {
	    var deferred = Q.defer();

    	targetReportCollection.remove({targetReportid: id}, function (err) {
	        if (err) deferred.reject(err);

	        deferred.resolve(true);
    	});

    	return deferred.promise;
	},

	findUser: function(email, telephone){
		var deferred = Q.defer();

		if(telephone){
			userCollection.findOne({telephoneNumber: telephone}, function (err, user) {
		        if (err) deferred.reject(err);

		        if (user) {
		            deferred.resolve(_.omit(user, 'hash'));
		        } else {
		            deferred.resolve();
		        }
		     })  
		} else if(email){
			userCollection.findOne({email: email}, function (err, user) {
		        if (err) deferred.reject(err);

		        if (user) {
		            deferred.resolve(_.omit(user, 'hash'));
		        } else {
		            deferred.resolve();
		        }
		    })
		}
		return deferred.promise;
		//For testing
		/*var dbUserObj = {  
	      name: 'arvind',
	      role: 'admin',
	      username: 'arvind@myapp.com'
	    };
	 
	    return dbUserObj;*/
	},
	validateUser: function(email, telephone, password){
		if(password){
			var deferred = Q.defer();

			if(telephone){
				userCollection.findOne({phoneNumber: telephone}, function (err, user) {
			        if (err) deferred.reject(err);

			        if (user && bcrypt.compareSync(password, user.hash)) {
			            deferred.resolve(_.omit(user, 'hash'));
			        } else {
			            deferred.resolve();
			        }
			    })
			} else if(email){
				userCollection.findOne({email: email}, function (err, user) {
			        if (err) deferred.reject(err);

			        if (user && bcrypt.compareSync(password, user.hash)) {
			            deferred.resolve(_.omit(user, 'hash'));
			        } else {
			            deferred.resolve();
			        }
			    })
			}
			
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	}
}

module.exports = dataService;