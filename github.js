var githubUpload = require("./github-upload.js");

githubUpload.upload({
	token    : "476f3d5138009fdbd603f182e480b26c77a9a7da",
	user     : "centi",
	repo     : "sandbox",
	filepath : "./dist/bundle-1.0.js",
	onUpload : function(data) {
		console.log(data.Location[0]);
	}
});
