



# INSTRUCTIONS
   
# cd ~/MagicMirror/modules
 git clone https://github.com/sdetweil/uploadPics
  
# cd ~/MagicMirror/modules/uploadPics
 npm install
  


# CONFIG

    {
            module: 'uploadPics',
            position: 'bottom_left',  //module position
            config: {
            	dest:  "..", // relative path to module showing images, place to put new images
                // MMM-IamgesPhotos is 
                //  ../module/MMMM-ImagesPhotos/uploads
            }
        },



   #CUSTOM CSS OPTIONS
   
Don't like the qr colors? or size Change them!!  Here are some things you can change by putting them in your custom.css file!


      .uploadPics qr {
	    color: #c9e4f5;
        height: 200px;
       }
      

