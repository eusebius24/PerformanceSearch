'use strict';
var youtubeAPIKey = "AIzaSyCnMqbxOJ-VSoYFLFJNu3Wf_jAxNQXfszA";
var discogsKey = "oNASBTCCcfjmebWyGlCQ";
var discogsSecret = "HmuMYvJaeMDCZgRgZKtiultyUClxXtCH"
var pageNumber = 1;

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        $('.youtube-results').empty();
        $('.discogs-results').empty();
        console.log('you clicked the search button!');
        var searchTerm = $('#searchTerm').val();
        console.log(searchTerm);
        // var searchWords = [];
        // searchWords = searchTerm.split(' ');
        // var regexFromSearchWords = new RegExp(searchWords.join("|", "gi"));
        // console.log(regexFromSearchWords);
        getYouTubeSearchResults(searchTerm);
        getDiscogSearchResults(searchTerm);   
        $('#clearSearch').on('click', function() {
            event.preventDefault();
            $('#searchTerm').val('');
    });
});
}

function getYouTubeSearchResults(term) {
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
        .then(responseJson => displayYouTubeResults(responseJson))
       
   
        .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
        })

    $('.YouTube').removeClass('hidden');
    $('.discogs').removeClass('hidden');
}

function displayYouTubeResults(responseJson) {
    for (var i in responseJson.items) {
    console.log(responseJson.items[i].snippet.title);
    $('.youtube-results').append(`<li><img class=
    "results-img" src='${responseJson.items[i].snippet.thumbnails.medium.url}'><br><a href='http://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}' target="_blank">${responseJson.items[i].snippet.title}</a></li>`);
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
    var moreResultsUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${newTerm}&key=${youtubeAPIKey}&maxResults=50&pageToken=${responseJson.nextPageToken}`;
    
    fetch(moreResultsUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
        })
        // .then(responseJson => console.log(responseJson))
        
        .then(responseJson => displayYouTubeResults(responseJson))
        .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function getDiscogSearchResults(term) {
    var termArray = term.split(' ');
    var newTerm = termArray.join('%20');
    var url = "https://cors-anywhere.herokuapp.com/https://api.discogs.com/database/search?q='" + newTerm + "'&key=" + discogsKey + "&secret=" + discogsSecret + "&perpage=100";
    console.log(url);
    fetch(url)
        .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
        })
        // .then(responseJson => console.log(responseJson))
        .then(responseJson => displayDiscogsResults(responseJson))  
        .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
        })

    $('.results').removeClass('hidden');
   
}

function displayDiscogsResults(responseJson) {
    for (var i in responseJson.results) {
        console.log(responseJson.results[i].title);
        $('.discogs-results').append(`<li><img src='${responseJson.results[i].thumb}'><br><a href='https://www.discogs.com/${responseJson.results[i].uri}' target='_blank'>${responseJson.results[i].title}</a></li>`);
    }
    $("#more-discogs-results").click(event => {
        getMoreDiscogsResults(responseJson);
    });
}

function getMoreDiscogsResults(responseJson) {
    pageNumber++;
    
    var searchTerm = $('#searchTerm').val();
    var termArray = searchTerm.split(' ');
    var newTerm = termArray.join('%20');
    var moreResultsUrl = "https://cors-anywhere.herokuapp.com/https://api.discogs.com/database/search?q='" + newTerm + "'&key=" + discogsKey + "&secret=" + discogsSecret + "&perpage=100&page=" + pageNumber;
    
    fetch(moreResultsUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
        })
        // .then(responseJson => console.log(responseJson))
        
        .then(responseJson => displayDiscogsResults(responseJson))
        .catch(err => {
        $('#js-error-message').text(`Something went wrong: no more results for this search`);
        })

}

$( function() {
    $( "#tabs" ).tabs();
  } );

$(function() {
    console.log('App loaded! Waiting for submit!');
    watchForm();
    });
