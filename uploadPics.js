/*

sample module structure


 */


Module.register("uploadPics", {
	// define variables used by module, but not in config data
	some_variable:  true,
	some_other_variable: "a string",

	// holder for config info from module_name.js
	config:null,

	// anything here in defaults will be added to the config data
	// and replaced if the same thing is provided in config
	defaults: {
		message: "default message if none supplied in config.js",
		dest:'../modules/MMM-ImagesPhotos/uploads'
	},

	init: function(){
		Log.log(this.name + " is in init! ");
	},

	start: function(){
		Log.log(this.name + " is starting!" + this.file('node_helper.js'));
	},

	loaded: function(callback) {
		Log.log(this.name + " is loaded!");
		callback();
	},

	// return list of other functional scripts to use, if any (like require in node_helper)
	getScripts: function() {
	return	[ 'qrcode.min.js'
			// sample of list of files to specify here, if no files,do not use this routine, or return empty list

			//'script.js', // will try to load it from the vendor folder, otherwise it will load is from the module folder.
			//'moment.js', // this file is available in the vendor folder, so it doesn't need to be available in the module folder.
			//this.file('anotherfile.js'), // this file will be loaded straight from the module folder.
			//'https://code.jquery.com/jquery-2.2.3.min.js',  // this file will be loaded from the jquery servers.
		]
	}, 

	// return list of stylesheet files to use if any
	getStyles: function() {
		return 	[
			// sample of list of files to specify here, if no files, do not use this routine, , or return empty list

			//'script.css', // will try to load it from the vendor folder, otherwise it will load is from the module folder.
			//'font-awesome.css', // this file is available in the vendor folder, so it doesn't need to be avialable in the module folder.
			//this.file('anotherfile.css'), // this file will be loaded straight from the module folder.
			//'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css',  // this file will be loaded from the bootstrapcdn servers.
		]
	},

	// return list of translation files to use, if any
	/*getTranslations: function() {
		return {
			// sample of list of files to specify here, if no files, do not use this routine, , or return empty list

			// en: "translations/en.json",  (folders and filenames in your module folder)
			// de: "translations/de.json"
		}
	}, */ 



	// only called if the module header was configured in module config in config.js
	/*getHeader: function() {
		return this.data.header + " Foo Bar";
	},*/

	// messages received from other modules and the system (NOT from your node helper)
	// payload is a notification dependent data structure
	notificationReceived: function(notification, payload, sender) {
		// once everybody is loaded up
		if(notification==="ALL_MODULES_STARTED"){
			this.sendSocketNotification("CONFIG",this.config)
		}
		if (sender) {
			Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
		} else {
			Log.log(this.name + " received a system notification: " + notification);
		}
	},

	// messages received from from your node helper (NOT other modules or the system)
	// payload is a notification dependent data structure, up to you to design between module and node_helper
	socketNotificationReceived: function(notification, payload) {
		Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		if(notification === "qr"){
			this.config.message = payload;
			// tell mirror runtime that our data has changed,
			// we will be called back at GetDom() to provide the updated content
			this.updateDom(1000)
		}

	},

	// system notification your module is being hidden
	// typically you would stop doing UI updates (getDom/updateDom) if the module is hidden
	suspend: function(){

	},

	// system notification your module is being unhidden/shown
	// typically you would resume doing UI updates (getDom/updateDom) if the module is shown
	resume: function(){

	},

	// this is the major worker of the module, it provides the displayable content for this module
	getDom: function() {
		var wrapper = document.createElement("div");

		// if user supplied message text in its module config, use it
		if(this.config.hasOwnProperty("message")){
			// using text from module config block in config.js
			//wrapper.innerText = this.config.message;
			var canvas=document.createElement('canvas')
			canvas.className='qr';
			QRCode.toCanvas(canvas, this.config.message, function (error) {
			    if (error) Log.error(error)
			    Log.log('success!');
			  })
			wrapper.appendChild(canvas)
		}

		return wrapper;
	},

})
