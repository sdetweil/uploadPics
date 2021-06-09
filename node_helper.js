var NodeHelper = require("node_helper");
const { spawn , exec } = require('child_process');
const fs=require('fs')
const path = require('path')
const os = require("os");
const QRCode = require("qrcode");
// add require of other javascripot components here
// var xxx = require('yyy') here

module.exports = NodeHelper.create({
	//regExp : /[a-zA-Z]/g,
	first:true,
	config:{debug:false},
	files:[],

	init(){
		if(this.config.debug) console.log("init module helper " +this.name+ JSON.stringify(this.data));
	},

	start() {
		if(this.config.debug) console.log('Starting module helper:' +this.name+ JSON.stringify(this.data));
	},

	stop(){
		if(this.config.debug) console.log('Stopping module helper: ' +this.name);
	},

	startServer(){
		var self = this
		// get the absolute path to the image storage folder
		const p = path.resolve( __dirname, "..",  this.config.dest)
		const qrcp_config = path.resolve( __dirname, "./qrcp.json")
		if(self.config.debug) console.log("p="+p)
		//		const qrcp = spawn('qrcp', ['-k', '--output', p, 'receive']);
		const qrcp = spawn('qrcp', ['-k', "-c",  qrcp_config ,  '--output', p, 'receive']);

    this.hostname = os.hostname();

    this.config.url =
      "http://" +
      (this.config.address == "0.0.0.0"
        ? this.hostname
        : this.config.address) +
      ":" +
      this.config.port;

		qrcp.stdout.on('data', (data) => {
			if(self.first) {
				self.first=false;
				//if(self.config.debug) console.log("d="+JSON.stringify(data))
				let v = data.toString().split('\n')[1]
				if(self.config.debug) console.log('data='+data.toString())
				if(self.config.debug) console.log('v='+v)
				//v=v.split('\n').slice(1,-2).join('\n')
				if(self.config.debug) console.log("new line")
		  		if(self.config.debug) console.log(`stdout: ${v}`);
	        let imageurl =
	          this.config.url + "/modules/" + this.name + "/qrfile.png";
	        QRCode.toFile(this.path + "/qrfile.png", v, (err) => {
	          if (!err) {
	            if (this.config.debug) console.log("QRCode build done");
	            this.sendSocketNotification(
	              "qr_url",
	              imageurl
	            );
	          } else {
	            console.log("QR image crate failed =" + JSON.stringif(err));
	          }
	        });
		  		//self.sendSocketNotification("qr",v)
			}
			else{
					if(self.config.debug) console.log(data.toString())

					if(data.toString().includes('File transfer completed')){
						if(self.config.debug)
							console.log("process list of files =  "+ JSON.stringify(self.files))
						self.files.forEach(fn =>{
							if(self.config.debug)
								console.log("processing for "+fn)
							exec((self.config.needSudo?'sudo ':'')+'exiftran -ai '+"'"+fn+"'")
						})
						self.files=[]
						//exec('exiftran -ai '+p+'/*.jpg')
					}
					if(data.toString().includes('Transferring file:')){
						let x =  data.toString().split(':')[1].split('\n')
						if(self.config.debug)
							console.log(" fn list ="+ JSON.stringify(x,' ',2)+" fn="+x[0].toString().trim())
						self.files.push(x[0].toString().trim())
					}
				}
		});
		qrcp.stderr.on('data', (data)=>{
			console.log("error="+data)
		})
	},
	// handle messages from our module// each notification indicates a different messages
	// payload is a data structure that is different per message.. up to you to design this
	socketNotificationReceived(notification, payload) {
		// if config message from module
		if (notification === "CONFIG") {
			// save payload config info
			this.config=payload
			if(this.config.debug) console.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
			this.startServer()
		} else{
			if(this.config.debug) console.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		}
	},
});
