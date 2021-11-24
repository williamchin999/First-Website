//console.log("In Flash FadeOut File");

function setFlashMessageFadeOut() {
    setTimeout(() => {
        let currentOpacity = 1.0;
        let timer = setInterval(()=> {
            if(currentOpacity <= 0) {
                clearInterval(timer);
                flashElement.remove();
            }
            currentOpacity = currentOpacity-0.1;
            flashElement.style.opacity = currentOpacity;
            //console.log("Through Opacity");
        },50);
    }, 4000);
}

let flashElement = document.getElementById('flash-message');
//console.log(flashElement);
if(flashElement) {
    setFlashMessageFadeOut();
}