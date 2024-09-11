// 设置图片切换
let myImage = document.querySelector('img');

myImage.onclick = function() {
  let mySrc = myImage.getAttribute('src');
  if (mySrc =='images/1.jpg') {
    myImage.setAttribute ('src','images/2.jpg');
  } else if(mySrc =='images/2.jpg'){
    myImage.setAttribute ('src','images/3.jpg');
  }
else if(mySrc =='images/3.jpg')
    {
            myImage.setAttribute ('src','images/1.jpg');
          }
};


