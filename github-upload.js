var GitHubUpload = function(files, conf) {
	
};

GitHubUpload.prototype = {
	
};

var fs = require("fs");
var http = require("https");
var post = require("http-post");
var path = require("path");
var xml2js = require("xml2js");

var githubHost = "api.github.com";
var githubS3Host = "github.s3.amazonaws.com";
var conf = {};

exports.upload = function(_conf) {
	checkArgs(_conf);
	
	conf = _conf;
	
	createDownload(uploadDownload);
};

function createDownload(callback) {
	var filename = path.basename(conf.filepath);
	var filesize = fs.statSync(conf.filepath).size;
	var data = JSON.stringify({
		"name"         : filename,
		"size"         : filesize,
		"description"  : conf.filedesc,
		"content_type" : "text/javascript"
	});
	
	var req = http.request({
		host    : githubHost,
		path    : "/repos/" + conf.user + "/" + conf.repo + "/downloads?access_token=" + conf.token,
		method  : "POST",
		headers : { "Content-length" : data.length }
	}, function(response) {
		response.on("data", callback || function(responseData) {});
	});
	
	req.write(data + "\n");
	req.end();
}

function uploadDownload(responseData) {
	var data = JSON.parse(responseData.toString());
	
	post({
		host                    : githubS3Host
	}, {
		"key"                   : data.path,
		"acl"                   : data.acl,
		"success_action_status" : 201,
		"Filename"              : data.name,
		"AWSAccessKeyId"        : data.accesskeyid,
		"Policy"                : data.policy,
		"Signature"             : data.signature,
		"Content-Type"          : data.mime_type
	}, [
		{
			"param"             : "file",
			"path"              : conf.filepath
		}
	], function(response) {
		response.on("data", uploadFinished);
	});
};

function uploadFinished(responseData) {
	var parser = new xml2js.Parser();
	parser.parseString(responseData.toString(), function(error, data) {
		conf.onUpload && conf.onUpload(data.PostResponse);
	});
}

function checkArgs(conf) {
	conf = conf || {};
	
	if (!conf.token) {
		console.log("GitHub token is missing!");
		process.exit();
	}
	if (!conf.user) {
		console.log("GitHub user is missing!");
		process.exit();
	}
	if (!conf.repo) {
		console.log("GitHub repo is missing!");
		process.exit();
	}
	if (!conf.filepath) {
		console.log("File to upload is missing!");
		process.exit();
	}
	else {
		if (!fs.existsSync(conf.filepath)) {
			console.log("File to upload does not exist!");
			process.exit();
		}
	}
}