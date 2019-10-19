'use strict';
const youtubeAPIKey = "AIzaSyCnMqbxOJ-VSoYFLFJNu3Wf_jAxNQXfszA";
const discogsKey = "oNASBTCCcfjmebWyGlCQ";
const discogsSecret = "HmuMYvJaeMDCZgRgZKtiultyUClxXtCH"
const pageNumber = 1;

function watchForm() {
    //Event listener for the main search box.  Obtains search term and calls the YouTube and Discogs search functions on it
    $("form").submit(event => {
        event.preventDefault();
        $('.youtube-results').empty();
        $('.discogs-results').empty();
        console.log('you clicked the search button!');
        const searchTerm = $('#searchTerm').val();
        console.log(searchTerm);
        getYouTubeSearchResults(searchTerm);
        getDiscogSearchResults(searchTerm);   
        $('#clearSearch').on('click', function() {
            event.preventDefault();
            $('#searchTerm').val('');
         });

        });
}

function getYouTubeSearchResults(term) {
//Searches YouTube and calls the display function to format the results
    const termArray = term.split(' ');
    const newTerm = termArray.join('%20');
    const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q='" + newTerm + "'&key=" + youtubeAPIKey;
    console.log(url);
    fetch(url)
        .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
        })
        .then(responseJson => displayYouTubeResults(responseJson))
        .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
        })

    $('.YouTube').removeClass('hidden');
    $('.discogs').removeClass('hidden');
}

function displayYouTubeResults(responseJson) {
    //Formats and displays search results
    for (let i in responseJson.items) {
    console.log(responseJson.items[i].snippet.title);
    $('.youtube-results').append(`<li><img class=
    "results-img" src='${responseJson.items[i].snippet.thumbnails.medium.url}'><br><a href='http://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}' target="_blank">${responseJson.items[i].snippet.title}</a></li>`);
    }
    $("#more-youtube-results").click(event => {
        getMoreYouTubeResults(responseJson);
    });
}

function getMoreYouTubeResults(responseJson) {
    //Adds new results to the bottom of the results list
    console.log(responseJson.nextPageToken);
    const searchTerm = $('#searchTerm').val();
    const termArray = searchTerm.split(' ');
    const newTerm = termArray.join('%20');
    const moreResultsUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${newTerm}&key=${youtubeAPIKey}&maxResults=50&pageToken=${responseJson.nextPageToken}`;
    
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
//Searches Discogs and calls the display function to format the results
    const termArray = term.split(' ');
    const newTerm = termArray.join('%20');
    const url = "https://cors-anywhere.herokuapp.com/https://api.discogs.com/database/search?q='" + newTerm + "'&key=" + discogsKey + "&secret=" + discogsSecret + "&perpage=100";
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
     //Formats and displays search results
    for (let i in responseJson.results) {
        console.log(responseJson.results[i].title);
        $('.discogs-results').append(`<li><img src='${responseJson.results[i].thumb}'><br><a href='https://www.discogs.com/${responseJson.results[i].uri}' target='_blank'>${responseJson.results[i].title}</a></li>`);
    }
    $("#more-discogs-results").click(event => {
        getMoreDiscogsResults(responseJson);
    });
}

function getMoreDiscogsResults(responseJson) {
    //Adds new results to the bottom of the results list
    pageNumber++;
    
    const searchTerm = $('#searchTerm').val();
    const termArray = searchTerm.split(' ');
    const newTerm = termArray.join('%20');
    const moreResultsUrl = "https://cors-anywhere.herokuapp.com/https://api.discogs.com/database/search?q='" + newTerm + "'&key=" + discogsKey + "&secret=" + discogsSecret + "&perpage=100&page=" + pageNumber;
    
    fetch(moreResultsUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
        })
        .then(responseJson => displayDiscogsResults(responseJson))
        .catch(err => {
        $('#js-error-message').text(`Something went wrong: no more results for this search`);
        })

}
//jQuery UI function to invoke the tabs widget
$( function() {
    $( "#tabs" ).tabs();
  } );

$(function() {
    console.log('App loaded! Waiting for submit!');
    watchForm();
    });
