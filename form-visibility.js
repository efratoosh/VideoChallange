var formVisibility = (function(){
    var initialize = function() {
        var allInputs = document.querySelectorAll("input");
        allInputs.forEach(item => {
            item.addEventListener("focus", function(e) {
                e.target.parentElement.classList.add('active');
            });

            item.addEventListener("blur", function(e) {
                if(this.value === ""){
                    e.target.parentElement.classList.remove('active');
                }
            });

            if (item.value === "") {
                item.parentElement.classList.remove('active');
            } else{
                item.parentElement.classList.add('active');
            }
        });
    }

    return {
        initialize: initialize
    }

}());

formVisibility.initialize();