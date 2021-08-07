var searchHandler = (function(){
    var initialize = function(){
        let form = document.getElementById("searchForm");
        form.addEventListener("submit", function(e){
            e.preventDefault();
            let movieName = this.elements['videoSearchName'];
            let movieYear = this.elements['videoSearchYear'];

            let movieNameVal = movieName.value;
            let movieYearVal = movieYear.value;

            let isNameValid = movieNameVal === "" ? false : true;
            handleErrorDisplay(movieName, isNameValid, "Movie Name is required");

            let isYearValid = true;
            if (movieYearVal !== "") {
                isYearValid = /^(19|20)\d{2}$/.test(movieYear.value);
                handleErrorDisplay(movieYear, isYearValid, "please enter a valid year");
            }   
            
            if(isNameValid && isYearValid){
                retrievMovieData.init(movieNameVal, movieYearVal);
            }
        });
    }

    function handleErrorDisplay(input, isValid, errorText){
        var myError = input.nextElementSibling;
        if (isValid) {
            input.classList.remove('is-error');
            myError.innerText = "";
        }
        else {
            input.classList.add('is-error');
            myError.innerText = errorText;
        }
    }

    return{
        initialize: initialize
    }

}());

searchHandler.initialize();

var retrievMovieData = (function(){

    var init = function(movieName, movieYear, page = 1){
        var loader = document.querySelector('.loader');
        loader.classList.add('active');
        let params = [movieName, movieYear, page];

        var dataRetrieved = sessionStorage.getItem(`${movieName}_${movieYear}_${page}`);
        if (dataRetrieved) {
            dataHandler(JSON.parse(dataRetrieved), ...params);
            loader.classList.remove('active');
            return;
        }

        let url =`http://www.omdbapi.com/?s=${movieName}&page=${page}&y=${movieYear}&type=movie&apikey=157f34ed`;

        fetch(url)
        .then(response => response.json())
        .then(data => dataHandler(data, ...params))
        .catch((error) => {
            console.error('Error:', error);
            htmlDataDisplay("Sorry, something went wrong, please try again");
        })
        .finally(() => loader.classList.remove('active'));
    }

    function dataHandler(data, ...params){
        console.log("data: ", data);
        let [movieName, movieYear, page] = params;

        if (data && data.Response == "True") {
            sessionStorage.setItem(`${movieName}_${movieYear}_${page}`, JSON.stringify(data));

            pagerHandler(data.totalResults, ...params);

            var result = [];

            data.Search.forEach(item => {
                result.push(
                `
                <li class="card-item col-5">
                    <figure class="card-item-img">
                        <img src=${item.Poster} loading="lazy" alt="" />
                    </figure>
                    <div class="card-item-content">
                        <h3>${item.Title}</h3>
                        <div>${item.Year}</div>
                    </div>
                </li>
                `);
            });

            let message = `${data.totalResults} results were found for <b>"${movieName}"</b>`;
            htmlDataDisplay(message, result.join(""));

        } else if (data && data.Response == "False") {
            console.log(data.Error)
            htmlDataDisplay(data.Error);
            pagerHandler(null);
        } else {
            htmlDataDisplay("Sorry, something went wrong, please try again");
            pagerHandler(null);
        }
    }

    function htmlDataDisplay(messageText, resultsText = "") {
        document.querySelector(".js-result-message").innerHTML = messageText;
        document.querySelector(".js-results").innerHTML = resultsText;
    }

    function pagerHandler(totalResults, ...params) {
        if( totalResults > 10 ) {
            let [movieName, movieYear, page] = params;

            let numOfBtn = Math.ceil(+totalResults/10);

            let pagerBtns = [],
                startNum,
                endNum;

            if(numOfBtn > 3) {
                startNum = page == 1 ? page : page == numOfBtn ? page - 2 : page - 1;
                endNum = page == 1 ? page + 2 : page == numOfBtn ? page : page + 1;

            } else if (numOfBtn > 1 )  {
                startNum = 1;
                endNum = numOfBtn;
            }

            if (startNum && endNum) {
                var fragment = document.createDocumentFragment();
                for (let i = startNum; i <= endNum; i++ ){
                    let current = i == page? "class='active' disabled" : ""; 
                    pagerBtns.push(
                        `<button ${current} onclick='retrievMovieData.init("${movieName}", "${movieYear}", ${i})'>${i}</button>`
                    )
                }
            }

            document.querySelector(".js-pager").innerHTML= pagerBtns.join("");

        } else {
            document.querySelector(".js-pager").innerHTML= "";
        }

    }

    return{
        init:init
    }

}());


