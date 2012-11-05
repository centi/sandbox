var GitGubUpload = require("./github-upload.js").GitHubUpload;

/*
githubUpload.upload({
	token    : "476f3d5138009fdbd603f182e480b26c77a9a7da",
	user     : "centi",
	repo     : "sandbox",
	filepath : "./dist/bundle-1.0.js",
	onUpload : function(data) {
		console.log(data.Location[0]);
	}
});
*/

var gu = new GitGubUpload({token:"token", user:"user", repo:"repo"});
gu.upload();
gu.upload("file1.txt");
gu.upload(["file2.txt", "file3.txt"]);