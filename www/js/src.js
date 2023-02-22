// FUNCTIONS
// Triggered when search bar or checkboxes are triggered
function search_update(search_bar, checkbox, page){
    let status = [];
    const name = search_bar.value;

    // Update status array with checked boxes
    checkbox.forEach(element => {
        if (element.checked == true){
            status.push(element.value);
        }
        console.log(element.checked);
    })

    // Call update_results with name and status parameters
    update_results(name, status, page);
}

// Updates search results based on name and status
const update_results = async(name, status, page) => {
    // In case there is nothing on the search bar, display all characters
    var url;
    if (name == "" && (status.length == 3 || status.length == 0)){
        url = "https://rickandmortyapi.com/api/character/?page="+page;
    }

    else if (name != "" && (status.length == 3 || status.length == 0)){
        url = "https://rickandmortyapi.com/api/character/?name="+name+"?page="+page;
    }

    else{
        if (status.length == 1){
            url = "https://rickandmortyapi.com/api/character/?name="+name+"&status="+status[0];
        }
        else if (status.length == 2){ // TODO no funciona
            url = "https://rickandmortyapi.com/api/character/?name="+name+"&status=["+status[0]+", "+status[1]+"]";
        }
    }

    console.log(url);

    // Wait for api response
    const api = await fetch(url);
    var data = await api.json();
    console.log(data);

    // Remove previous results
    if (page == 1){
        var target_div = document.querySelector(".search_results");
        target_div.innerHTML = "";
    }
    
    // Insert results as article into search_results div
    data.results.forEach(element => {
        const newArticle = document.createElement("article");
        newArticle.setAttribute("class", "article_result");
        newArticle.innerHTML = "<img src="+element.image+"> <div class=result_footer><h4>"+element.name+"</h4> <p class="+element.status.toLowerCase()+">"+element.status+"</p>";
        target_div.append(newArticle);
    })
}

// MAIN FLOW OF THE PROGRAM
// Set initial results
update_results("", ["alive", "dead", "unknown"], 1);

// Get checkboxes
const checkbox = document.getElementsByName("checkbox");

// Get search bar
const search_bar = document.querySelector(".search_bar");

// Event listeners for search bar and checkboxes
search_bar.addEventListener("keyup", function(){search_update(search_bar, checkbox, 1);});
checkbox.forEach(element=>{
    element.addEventListener("click", function(){search_update(search_bar, checkbox, 1);});
})

document.addEventListener('DOMContentLoaded', function(e) {
    document.addEventListener('scroll', function(e) {
        let documentHeight = document.body.scrollHeight;
        let currentScroll = window.scrollY + window.innerHeight;
        // When the user is [modifier]px from the bottom, fire the event.
        let modifier = 200; 
        if(currentScroll + modifier > documentHeight) {
            update_results(search_bar, checkbox, 2);
        }
    })
})


