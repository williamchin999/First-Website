//console.log("In Flash FadeOut File");

function setFlashMessageFadeOut(flashMessageElement) {
    setTimeout(() => {
        let currentOpacity = 1.0;
        let timer = setInterval(()=> {
            if(currentOpacity <= 0) {
                clearInterval(timer);
                flashMessageElement.remove();
            }
            currentOpacity = currentOpacity-0.1;
            flashMessageElement.style.opacity = currentOpacity;
            //console.log("Through Opacity");
        },50);
    }, 4000);
}

function addFlashFromFrontEnd(message) {
    //flashmsgdiv is parent of innerflashdiv
    //innertextnode is child of innerflashdiv
    console.log(message);
    let flashMessageDiv = document.createElement('div');
    let innerFlashDiv = document.createElement('div');
    let innerTextNode = document.createTextNode(message);
    
    innerFlashDiv.appendChild(innerTextNode);
    flashMessageDiv.appendChild(innerFlashDiv);

    //set styling
    flashMessageDiv.setAttribute('id', 'flash-message');
    innerFlashDiv.setAttribute('class', 'alert-danger');
    //document.appendChild doesnt work, only 1 child to document(body)
    //returns a list of elements
    document.getElementsByTagName('body')[0].appendChild(flashMessageDiv);
    setFlashMessageFadeOut(flashMessageDiv);


}

function createCard(postData) {
    return `<div id ="post-${postData.id}" class="card">
    <img class ="card-image" src="${postData.thumbnail}" alt ="">
    <div class="card-body">
        <p class="card-title"> ${postData.title}</p>
        <p class="card-text"> ${postData.description}</p>
        <a href="/post/${postData.id}" class="anchor-buttons">Post Details</a>
    </div>
</div>`;
}
function executeSearch() {
    //console.log("im in execute");
    let searchTerm = document.getElementById('search-text').value;
    if(!searchTerm) {
        //reloads page to new io removing session data not login details
        location.replace('/');
        return;
    }
    let mainContent = document.getElementById('main-content');
    let searchURL = `/posts/search?search=${searchTerm}`;
    fetch(searchURL)
    .then((data) => {
        return data.json();
    })
    .then((data_json) => {
        let newMainContentHTML= '';
        //get data of array results
        data_json.results.forEach((row) => {
            newMainContentHTML += createCard(row);
        });
        //see data
        //console.log(newMainContentHTML);    
        mainContent.innerHTML = newMainContentHTML;
        if(data_json.message) {
            addFlashFromFrontEnd(data_json.message);
        }
    })
    .catch((err) => console.log(err));
}

let flashElement = document.getElementById('flash-message');
//console.log(flashElement);
if(flashElement) {
    setFlashMessageFadeOut(flashElement);
}

let searchButton = document.getElementById('search-button');
if(searchButton){
    searchButton.onclick = executeSearch;
}