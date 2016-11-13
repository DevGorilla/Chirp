// 140 check on front

var pingInterval = 20000

$(document).ready(function() {
    console.log("Developed on AWS. https://github.com/devgorilla");
    updateChirps()
    setTimeout(updateChirps, pingInterval); // Start the update pump
    $("#chirpText").keyup(function(ev) {
        // 13 is ENTER
        if (ev.which === 13) {
            postChirp();
        }
    });

});



function postChirp() {

    var message = $("#chirpText").val()
    console.log("postChirp " + message)

    if (message){
        var characterCount = message.split("").length - 1
        console.log("Character Count: "+characterCount);

        if (message && characterCount < 141) {
            console.log("Post chirp");
            httpPostAsync("https://ft2nhcyz7g.execute-api.us-east-1.amazonaws.com/prod/chirp", message)

        } else if (characterCount > 140) {
            $("#error").html("<p>Chirps must be 140 characters or less!</p>")
        }
    }else {
      console.log("No Message");
    }
}

function updateChirps() {
    console.log("Update Chirps")
    httpGetAsync("https://ft2nhcyz7g.execute-api.us-east-1.amazonaws.com/prod/chirp", function(results) {

        var newHtml = ""

        var xx = JSON.parse(results)
        var items = xx.Items


        items.sort(function(a, b) {
            return b.created_at.N - a.created_at.N;
        })


        $.each(items, function(idx, chirp) {
            newHtml += '<li class="list-group-item">';
            newHtml += '<p class="user-name">Anonymous   </p><p id="chirp-text">' + chirp.message.S + "</p>";
            newHtml += '<p class="date">' + chirp.readable_date.S + '</p>'
            newHtml += '</li>';
        });

        $("#chirpList").html(newHtml);
        setTimeout(updateChirps, pingInterval);

    })

}

function httpPostAsync(url, message) {

    var http = new XMLHttpRequest()
    var chirp = {
        "message": message
    }

    var params = JSON.stringify(chirp)

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json")

    http.onreadystatechange = function() {
      console.log(http.status);
        if (http.readyState == 4 && http.status == 200) {
            //TODO Make #chirpText value clear after Post

            updateChirps()
        }
    }

    http.send(params)

}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}
