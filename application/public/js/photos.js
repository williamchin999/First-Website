function fadeOut(event) {
    //console.log('clicked');
    console.log(event);
    let clickedDiv = event.currentTarget; 
    let opacity = Number(window.getComputedStyle(clickedDiv).getPropertyValue("opacity"));
    let timer = setInterval(() => {
        //console.log(clickedDiv.style.opacity);
        console.log(opacity);
        clickedDiv.style.opacity = opacity;
        console.log(opacity);
        opacity -= 0.15;
        if(opacity <= 0) {
            clearInterval(timer);
            clickedDiv.remove();
            document.getElementById('item-count').innerHTML= `There are ${document.querySelectorAll('img').length} photo(s) being shown`;
        }
    },100);
}

function createPhoto() {
    function buildImageDiv(imgLink,title){
        let div = document.createElement('div');
        let img = document.createElement('img');
        let imgTitle = document.createElement('div');

        div.setAttribute('id','photos');
        imgTitle.setAttribute("class", "title")

        img.src = imgLink;
        img.width = "300";
        img.height = "250";

        imgTitle.innerText = title;
        title.width = "300";
        title.height = "50";
        
        div.appendChild(img);
        div.appendChild(imgTitle);

        div.addEventListener('click', fadeOut);
        return div;
    }
    let fetchURL = "https://jsonplaceholder.typicode.com/albums/2/photos"
    fetch(fetchURL)
    .then((response) => response.json())
    .then((photos)=> {
        var div = document.getElementById("container");
        [...photos].forEach( (photos) => {
            let imgURL = photos.url;
            let title = photos.title;
            //console.log(imgURL);
            //console.log(title);
            div.appendChild(buildImageDiv(imgURL,title));
        });
        document.getElementById('item-count').innerHTML= `There are ${photos.length} photo(s) being shown`;
    })
    
}
createPhoto();