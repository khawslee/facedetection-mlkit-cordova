var app = {
  startCamera: function(){
    const cameraDiv = document.getElementById('originalPicture');
    const cDivRect = cameraDiv.getBoundingClientRect();
    const x = cDivRect.left;
    const y = cDivRect.top;
    const height = cDivRect.height;
    const width = cDivRect.width;
    
    var smiling = 0;
    var eyeBlinking = 0;
    var eulerYLeft = 0;
    var eulerYRight = 0;
    var eulerZUp = 0;
    var eulerZDown = 0;

    const options = {
      x: x,
      y: y,
      width: width,
      height: height,
      front: true,
      cameraPixel:'640x480',
      minFaceSize: 0.5,
      landmark: false,
      classification: true,
      contour: false,
      faceTrack: false,
      performance: false
    };

    const me = this;
    document.getElementById('startCameraButton').innerText = 'TAKE PICTURE';

    window.faceDetection.start(options, function(result){
      const data = result.data;
      let htmlText = '';
      if(result.type == 'image'){
        document.getElementById('imageFrameTitle').innerHTML = 'Live frame information';
        
        htmlText += '<li>smiling: ' + smiling + ' </li>';
        htmlText += '<li>eyeBlinking: ' + eyeBlinking + ' </li>';
        htmlText += '<li>eulerYLeft: ' + eulerYLeft + ' </li>';
        htmlText += '<li>eulerYRight: ' + eulerYRight + ' </li>';
        htmlText += '<li>eulerZUp: ' + eulerZUp + ' </li>';
        htmlText += '<li>eulerZDown: ' + eulerZDown + ' </li>';
        document.getElementById('imageFrame').innerHTML = htmlText;
        return;
      }

      for(let i= 0; i < data.length; i++) {
        // const smiling = Number.parseFloat(data[i].smiling).toFixed(2);
        // const leftEyeOpen = Number.parseFloat(data[i].leftEyeOpen).toFixed(2);
        // const rightEyeOpen = Number.parseFloat(data[i].rightEyeOpen).toFixed(2);

        // const eulerX = Number.parseFloat(data[i].eulerX).toFixed(2);
        // const eulerY = Number.parseFloat(data[i].eulerY).toFixed(2);
        // const eulerZ = Number.parseFloat(data[i].eulerZ).toFixed(2);

        if(data[i].smiling > 0.75)
        {
          smiling++;
        }
        if(data[i].leftEyeOpen <= 0.3 && data[i].rightEyeOpen <= 0.3)
        {
          eyeBlinking++;
        }

        if(data[i].eulerY <= -35)
        {
          eulerYRight++;
        } 
        else if(data[i].eulerY > 35)
        {
          eulerYLeft++;
        }

        if(data[i].eulerZ >= 5)
        {
          eulerZUp++;
        }
        else if(data[i].eulerZ <= -3)
        {
          eulerZDown++;
        }

        // htmlText += '<li>Id: '+ data[i].id + ' </li>';
        // htmlText += '<li>Smiling: ' + smiling +' </li>';
        // htmlText += '<li>[EyeOpen]left/right: ' + leftEyeOpen +' / ' + rightEyeOpen +'</li>';
        // htmlText += '<li>[Euler]X/Y/Z: ' + eulerX + ' / ' + eulerY + ' / ' + eulerZ +'</li>';
        // htmlText += '<br>';
      }
      document.getElementById('faceFrame').innerHTML = htmlText;

    }, function(result){
      console.log('start camera error:' +result);
    });
    app.changeTakePicture(true);
  },

  changeTakePicture: function(change = true){
    if(change){
      document.getElementById('startCameraButton').removeEventListener('click', this.startCamera, false);
      document.getElementById('startCameraButton').addEventListener('click', this.takePicture, false);
    }else{
      document.getElementById('startCameraButton').removeEventListener('click', this.takePicture, false);
      document.getElementById('startCameraButton').addEventListener('click', this.startCamera, false);
    }
  },

  takePicture: function(){
    const options = {
      width: 360,
      height: 480,
      quality: 85,
    };

    window.faceDetection.takePicture(options, function(imageData){
      console.log('takePicture callback' +JSON.stringify(imageData));
      document.getElementById('originalPicture').style.backgroundColor = 'white';
      document.getElementById('originalPicture').style.backgroundImage = 'url(data:image/jpeg;base64,' + imageData + ')';
      app.stopCamera(true);
    });
  },

  stopCamera: function(flag=null){
    console.log('stopCamera:' + typeof flag);
    if('boolean' != typeof flag){
      document.getElementById('originalPicture').style.backgroundColor = 'gray';
      document.getElementById('originalPicture').style.backgroundImage = '';
    }

    window.faceDetection.stop();
    setTimeout(function(){
      document.getElementById('imageFrameTitle').innerHTML = '';
      document.getElementById('faceFrameTitle').innerHTML = '';

      document.getElementById('imageFrame').innerHTML = '';
      document.getElementById('faceFrame').innerHTML = '';

      document.getElementById('startCameraButton').innerText = 'START';
    }, 500);

    app.changeTakePicture(false);
  },

  init: function(){
    document.getElementById('startCameraButton').addEventListener('click', this.startCamera, false);
    document.getElementById('stopCameraButton').addEventListener('click', this.stopCamera, false);
  }
};

document.addEventListener('deviceready', function(){
  app.init();
}, false);
