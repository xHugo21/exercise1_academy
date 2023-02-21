// Triggered when search bar is updated
function search_update(){
    //event_fired = true;
    const search_value = search_bar.value;
    console.log(search_bar.value);
    update_results(search_value, "alive");
}

// Updates search results based on name and status
const update_results = async(name, status) => {
    // In case there is nothing on the search bar, display all characters
    if (name === ""){
        var url = "https://rickandmortyapi.com/api/character";
    }
    // Get matching results from api
    else{
        var url = "https://rickandmortyapi.com/api/character/?name="+name+"&status="+status;
    }
    // Wait for api response
    const api = await fetch(url);
    const data = await api.json();
    console.log(data);

    // Remove previous results
    const target_div = document.querySelector(".search_results");
    target_div.innerHTML = "";
    
    // Insert results as article into search_results div
    data.results.forEach(element => {
        const newArticle = document.createElement("article");
        newArticle.setAttribute("class", "article_result");
        newArticle.innerHTML = "<img src="+element.image+"> <div class=result_footer><h4>"+element.name+"</h4> <p class="+element.status.toLowerCase()+">"+element.status+"</p>";
        //const target_div = document.querySelector(".search_results");
        target_div.append(newArticle);
        
    })
}

// Main flow of the program
// Set default search
update_results("", "alive")

// Identify search bar and add EventListener
const search_bar = document.querySelector(".search_bar");
search_bar.addEventListener("keyup", search_update);

// Identify checkboxes and add EventListener
const checkbox = document.getElementsByName("checkbox");

//get_results("rick", "alive");

