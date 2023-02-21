function search_update(){
    //event_fired = true;
    const search_value = search_bar.value;

    get_results(search_value, "alive");
}

const get_results = async(name, status) => {
    // Get matching results from api
    const url = "https://rickandmortyapi.com/api/character/?name="+name+"&status="+status;
    const api = await fetch(url);
    const data = await api.json();
    console.log(data);

    const target_div = document.querySelector(".search_results");
    target_div.childNodes.forEach(element => target_div.removeChild(element))
    // Insert results as article into search_results div
    data.results.forEach(element => {
        const newArticle = document.createElement("article");
        newArticle.innerHTML = "<img src="+element.image+"> <div class=result_footer><h4>"+element.name+"</h4> <p>"+element.status+"</p>";
        //const target_div = document.querySelector(".search_results");
        target_div.append(newArticle);
        
    })
}


const search_bar = document.querySelector(".search_bar");
console.log(search_bar);
search_bar.addEventListener("keypress", search_update);
//get_results("rick", "alive");

