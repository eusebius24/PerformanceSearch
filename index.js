'use strict';
var youtubeAPIKey = "AIzaSyCnMqbxOJ-VSoYFLFJNu3Wf_jAxNQXfszA";

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        console.log('you clicked the search button!');
        var searchTerm = $('#searchTerm').val();
        console.log(searchTerm);
        // var searchWords = [];
        // searchWords = searchTerm.split(' ');
        // var regexFromSearchWords = new RegExp(searchWords.join("|", "gi"));
        // console.log(regexFromSearchWords);
        getSearchResults(searchTerm);
       
    
    });
}

function getSearchResults(term) {
    var termArray = term.split(' ');
    var newTerm = termArray.join('%20');
    var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q='" + newTerm + "'&key=" + youtubeAPIKey;
    console.log(url);
    fetch(url)
        .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
        })
        // .then(responseJson => console.log(responseJson))
        .then(responseJson => displayResults(responseJson))
       
   
        .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
        })

    $('.results').removeClass('hidden');
   
}

function displayResults(responseJson) {
    for (var i in responseJson.items) {
    console.log(responseJson.items[i].snippet.title);
    $('.youtube-results').append(`<li><img src='${responseJson.items[i].snippet.thumbnails.medium.url}'><br><a href='http://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}'>${responseJson.items[i].snippet.title}</a></li>`);
    }
    $("#more-youtube-results").click(event => {
        getMoreYouTubeResults(responseJson);
    });
}

function getMoreYouTubeResults(responseJson) {
        
        console.log(responseJson.nextPageToken);
        var searchTerm = $('#searchTerm').val();
        var termArray = searchTerm.split(' ');
        var newTerm = termArray.join('%20');
        var moreResultsUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${newTerm}&key=${youtubeAPIKey}&pageToken=${responseJson.nextPageToken}`;
        
        fetch(moreResultsUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
            })
            // .then(responseJson => console.log(responseJson))
            .then($('.youtube-results').empty())
            .then(responseJson => displayResults(responseJson))
            .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
            })
    
       
        
}
$(function() {
    console.log('App loaded! Waiting for submit!');
    watchForm();
    });
