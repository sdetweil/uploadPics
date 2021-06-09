/*

sample module structure


 */

Module.register("uploadPics", {

	// anything here in defaults will be added to the config data
	// and replaced if the same thing is provided in config
	defaults: {
		dest:'../modules/MMM-ImagesPhotos/uploads',
		debug: false,
		needSudo: false,
	},
	config:{ debug: false},

	init: function(){
		if(this.config.debug) Log.log(this.name + " is in init! ");
	},

	start: function(){
		if(this.config.debug) Log.log(this.name + " is starting!" + this.file('node_helper.js'));
	},

	loaded: function(callback) {
		if(this.config.debug) Log.log(this.name + " is loaded!");
		callback();
	},

	// return list of other functional scripts to use, if any (like require in node_helper)
/*	getScripts: function() {
	return	[ this.file('qrcode.min.js')

		]
	}, */

	// return list of stylesheet files to use if any
	getStyles: function() {
		return 	[
		]
	},

	// messages received from other modules and the system (NOT from your node helper)
	// payload is a notification dependent data structure
	notificationReceived: function(notification, payload, sender) {
		// once everybody is loaded up
		if(notification==="ALL_MODULES_STARTED"){
			this.config.address=config.address
			this.config.ipWhitelist=config.ipWhitelist
			this.config.port=config.port
			this.sendSocketNotification("CONFIG",this.config)
		}
	},

	// messages received from from your node helper (NOT other modules or the system)
	// payload is a notification dependent data structure, up to you to design between module and node_helper
	socketNotificationReceived: function(notification, payload) {
		if(this.config.debug) Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		if(notification === "qr_url"){
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
        let image = document.createElement("img");
        image.src = this.config.message;
        image.className = "qr";
        wrapper.appendChild(image);
		}

		return wrapper;
	},

})
