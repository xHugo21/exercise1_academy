//VARIABLES
let data;

// FUNCTIONS
// Debounce
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
    console.log

    // Update status array with checked boxes
    checkbox.forEach(element => {
        if (element.checked == true){
            status.push(element.value);
        }
        console.log(element.checked);
    })

    // Call update_results with name and status parameters
    update_results(name, status);
}

const debounce_change = debounce(() => search_update());

// Updates search results based on name and status
async function update_results(name, status){
    // In case there is nothing on the search bar, display all characters
    var url;

    if (status.length == 2){ //TODO
        console.log("length 2");
        url = "https://rickandmortyapi.com/api/character/?name="+name+"&status="+status[0]+"&status="+status[1];
    }

    else if (status.length == 1){
        console.log("length 1");
        url = "https://rickandmortyapi.com/api/character/?name="+name+"&status="+status[0];
    }

    else if (status.length == 3 || status.length == 0){
        console.log("length 3");    
        url = "https://rickandmortyapi.com/api/character/?name="+name;
    }


    console.log(url);

    // Wait for api response
    const api = await fetch(url);
    data = await api.json();
    console.log(data);

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

async function load_more_results(){
    if (data.info.next == null){
        console.log("THERE AREN'T MORE RESULTS TO DISPLAY");
        return;
    }

    let url = data.info.next;

    const api = await fetch(url);
    data = await api.json();
    console.log(data);

    var target_div = document.querySelector(".search_results");

    data.results.forEach(element => {
        const newArticle = document.createElement("article");
        newArticle.setAttribute("class", "article_result");
        newArticle.innerHTML = "<img src="+element.image+"> <div class=result_footer><h4>"+element.name+"</h4> <p class="+element.status.toLowerCase()+">"+element.status+"</p>";
        target_div.append(newArticle);
    })
}

// MAIN FLOW OF THE PROGRAM
// Set initial results
update_results("", ["alive", "dead", "unknown"]);

// Get checkboxes
const checkbox = document.getElementsByName("checkbox");

// Get search bar
const search_bar = document.querySelector(".search_bar");

const loadmore = document.querySelector(".loadmore");

// Event listeners for search bar and checkboxes
search_bar.addEventListener("keyup", function(){debounce_change();});
checkbox.forEach(element=>{
    element.addEventListener("click", function(){debounce_change();});
})
loadmore.addEventListener("click", function(){load_more_results();});

//document.addEventListener('DOMContentLoaded', function(e) {
//    document.addEventListener('scroll', function(e) {
//        let documentHeight = document.body.scrollHeight;
//        let currentScroll = window.scrollY + window.innerHeight;
//        // When the user is [modifier]px from the bottom, fire the event.
//        let modifier = 200; 
//        if(currentScroll + modifier > documentHeight) {
//            update_results(search_bar, checkbox, 2);
//        }
//    })
//})


