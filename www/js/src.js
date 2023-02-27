// FUNCTIONS
// Debounce function that executes the called function when the timeout ends
function debounce(func, timeout=300){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this); }, timeout);
    }; 
}

// Triggered when search bar or checkboxes are triggered
function search_update(){
    let status = [];
    const name = search_bar.value;

    // Update status array with checked boxes
    checkbox.forEach(element => {
        if (element.checked == true){
            status.push(element.value);
        }
    })

    // Call update_results with name and status parameters
    update_results(name, status);
}

// Auxiliary debounce call functions
const debounce_change = debounce(() => search_update());
const debounce_load_more = debounce(() => load_more_results());

// Updates search results based on name and status
async function update_results(name, status){
    // In case there is nothing on the search bar, display all characters
    var url;

    if (status.length == 2){ //TODO
        url = "https://rickandmortyapi.com/api/character/?name="+name+"&status="+status[0]+"&status="+status[1];
    }

    else if (status.length == 1){
        url = "https://rickandmortyapi.com/api/character/?name="+name+"&status="+status[0];
    }

    else if (status.length == 3 || status.length == 0){
        url = "https://rickandmortyapi.com/api/character/?name="+name;
    }

    // Wait for api response
    const api = await fetch(url);
    data = await api.json();

    // Remove previous results
    var target_div = document.querySelector(".search_results");
    target_div.innerHTML = "";
    
    // Insert results as article into search_results div
    data.results.forEach(element => {
        const newArticle = document.createElement("article");
        newArticle.setAttribute("class", "article_result");
        newArticle.innerHTML = "<img src="+element.image+"> <div class=result_footer><h4>"+element.name+"</h4> <p class="+element.status.toLowerCase()+">"+element.status+"</p>";
        target_div.append(newArticle);
    })
}

// Loads more results to the page
async function load_more_results(){
    // If there isn´t more data -> display message and return
    if (data.info.next == null){
        console.log("THERE AREN'T MORE RESULTS TO DISPLAY");
        return;
    }

    // Save new url
    let url = data.info.next;

    // Fetch new data
    const api = await fetch(url);
    data = await api.json();

    var target_div = document.querySelector(".search_results");

    // Add new fetched data
    data.results.forEach(element => {
        const newArticle = document.createElement("article");
        newArticle.setAttribute("class", "article_result");
        newArticle.innerHTML = "<img src="+element.image+"> <div class=result_footer><h4>"+element.name+"</h4> <p class="+element.status.toLowerCase()+">"+element.status+"</p>";
        target_div.append(newArticle);
    })
}

// MAIN FLOW OF THE PROGRAM
//VARIABLES
let data;
const checkbox = document.getElementsByName("checkbox");
const search_bar = document.querySelector(".search_bar");

// Set initial results
update_results("", ["alive", "dead", "unknown"]);

// Event listeners
search_bar.addEventListener("keyup", function(){debounce_change();}); // Search bar update
checkbox.forEach(element=>{ // Checkboxes update
    element.addEventListener("click", function(){debounce_change();}); 
})

document.addEventListener('DOMContentLoaded', function(e) { // Load more results when reaching bottom of page
    document.addEventListener('scroll', function(e) {
        let documentHeight = document.body.scrollHeight;
        let currentScroll = window.scrollY + window.innerHeight;
        // When the user is [modifier]px from the bottom, fire the event.
        let modifier = 200; 
        if(currentScroll + modifier > documentHeight) {
            debounce_load_more();
        }
    })
})


