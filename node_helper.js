var NodeHelper = require("node_helper");
const { spawn , exec } = require('child_process');
const fs=require('fs')
const path = require('path')
// add require of other javascripot components here
// var xxx = require('yyy') here

module.exports = NodeHelper.create({
	//regExp : /[a-zA-Z]/g,
	first:true,
	qrname:'12345.png',

	init(){
		console.log("init module helper " +this.name+ JSON.stringify(this.data));
	},

	start() {
		console.log('Starting module helper:' +this.name+ JSON.stringify(this.data));
	},

	stop(){
		console.log('Stopping module helper: ' +this.name);
	},

	startServer(){
		// get the absolute path to the image storage folder
		const p = path.resolve( '.', 'modules',  this.config.dest)
		console.log("p="+p)
		const qrcp = spawn('qrcp', ['-k', '--interface', 'any',  '--output', p, 'receive']);

		console.log

		qrcp.stdout.on('data', (data) => {
			if(this.first) {
				this.first=false;
				//console.log("d="+JSON.stringify(data))
				let v = data.toString().split('\n')[1]
				console.log('data='+data.toString())
				console.log('v='+v)
				//v=v.split('\n').slice(1,-2).join('\n')
				console.log("new line")
		  		console.log(`stdout: ${v}`);
		  		//fs.writeFileSync('modules/'+this.name+'/'+this.qrname,v)
		  		this.sendSocketNotification("qr",v)
			}
			else{		
					console.log(data.toString())
					if(data.toString().includes('File transfer completed')){
						exec('exiftran -ai '+p+'/*.jpg')
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
		console.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		// if config message from module
		if (notification === "CONFIG") {
			// save payload config info
			this.config=payload
			this.startServer()
			// wait 15 seconds, send a message back to module
			setTimeout(()=> { this.sendSocketNotification("message_from_helper"," this is a test_message")}, 15000)
		}
		else if(notification === "????2") {
		}

	},

});
