// FUNCTIONS
// Debounce function that executes the called function when the timeout ends
function debounce(func, timeout=300){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this); }, timeout);
    }; 
}

// Auxiliary debounce call functions
const debounce_change = debounce(() => update_results());
const debounce_load_more = debounce(() => load_more_results());

// Updates search results based on name and status
async function update_results(){
    // Variables
    var url;
    let status = [];
    let gender = [];
    const name = search_bar.value;

    // Update status checkboxes
    checkbox_status.forEach(element => {
        if (element.checked == true){
            console.log(element);
            status.push(element.value);
        }
    })

    // Update gender checkboxes
    checkbox_gender.forEach(element => {
        if (element.checked == true){
            console.log(element);
            gender.push(element.value);
        }
    })

    url = "https://rickandmortyapi.com/api/character/?name="+name+"&status="+status+"&gender="+gender;

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
const checkbox_status = document.getElementsByName("checkbox_status");
const checkbox_gender = document.getElementsByName("checkbox_gender");
const search_bar = document.querySelector(".search_bar");

// Set initial results
update_results("", ["alive", "dead", "unknown"]);

// Event listeners
search_bar.addEventListener("keyup", function(){debounce_change();}); // Search bar update
checkbox_status.forEach(element=>{ // Checkboxes status update
    element.addEventListener("click", function(){debounce_change();}); 
})
checkbox_gender.forEach(element=>{ // Checkboxes gender update
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


