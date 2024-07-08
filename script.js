/*
//This code creates a ball that moves across the screen as the user scrolls down
//To use uncomment this and the div with id="showScroll" from index.html

const myShape = document.getElementById('myShape');
const showScroll = document.getElementById('showScroll');
const RightSideStayPositionOffset = 20;

showScroll.style.height = window.innerWidth + 500 + "px";
  console.log(myShape.style.height);
  console.log(showScroll.style.height);

  window.addEventListener('scroll', function() {
    let scrollPosition = window.scrollY;
    let circle = document.getElementById('circle');
    
    console.log(window.innerWidth)
    //document.getElementById('showScroll').innerHTML = scrollPosition + 'px';
    if (scrollPosition < 450){
      circle.style.cx = 0;
    } else if( scrollPosition > this.window.innerWidth + 430){
      //Where the circle will rest once it reaches the right side
      circle.style.cx = window.innerWidth - RightSideStayPositionOffset;
    } else {
      circle.style.cx = String((scrollPosition - 450));
      myShape.style.position = 'fixed';
      myShape.style.top = 200;
    }
  });
  */



function ProgressBarFunction(){
  const progressBar = document.getElementById("progressBar");
  let scrollPosition = window.scrollY;
  let viewHeight = window.innerHeight;
  let htmlHeight = document.documentElement.offsetHeight;
  let barWidth = ((scrollPosition + viewHeight) / htmlHeight) * 100;
  barWidth = ((scrollPosition + (viewHeight * barWidth / 100)) / htmlHeight) * 100;

  progressBar.style.width = barWidth + '%';
  progressBar.innerHTML = Math.trunc(barWidth) + "%";
}


function RainbowText() {
  const rainbowColors = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'INDIGO', 'VIOLET'];
  let currColor = rainbowColors[0];
  let colorIndex = 0;
  const phrase = document.querySelector('p').innerHTML;
  let currLetterIndex = 0;

  setInterval(changeColor, 150);

  function changeColor() {
    let newString = '';
    let currLetter = phrase.substring(currLetterIndex, currLetterIndex + 1);

    //Skip spaces
    while (currLetter == ' '){
      currLetterIndex++;
      if (currLetterIndex >= phrase.length){
        currLetterIndex = 0;
      }
      currLetter = phrase.substring(currLetterIndex, currLetterIndex + 1);
    }

    let substring1 = phrase.substring(0, currLetterIndex);
    let substring2 = phrase.substring(currLetterIndex + 1)

    newString = `${substring1}<span style="color: ${currColor}">${currLetter}</span>${substring2}`;
    document.querySelector('p').innerHTML = newString;

    currLetterIndex++;
    if (currLetterIndex >= phrase.length){
      currLetterIndex = 0;
    }
    colorIndex++;
    if (colorIndex >= rainbowColors.length){
      colorIndex = 0;
    };
    currColor = rainbowColors[colorIndex];
  }

}


function TransitionImage(scrollDistanceToImage, currImage, nextImage) {
  
}




window.addEventListener("DOMContentLoaded", loadedHandler);

function loadedHandler() {  

  window.addEventListener('scroll', ProgressBarFunction);

  RainbowText();

  const scrollDistanceToImage = '?';
  const currImage = 'Images/3to14.png';
  const nextImage = 'Images/ppp.png';
  TransitionImage(scrollDistanceToImage, currImage, nextImage);

}


