'use strict';
var discogsKey = "oNASBTCCcfjmebWyGlCQ";
var discogsSecret = "HmuMYvJaeMDCZgRgZKtiultyUClxXtCH"
var pageNumber = 1;

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        $('.discogs-results').empty();
        console.log('you clicked the search button!');
        var searchTerm = $('#searchTerm').val();
        console.log(searchTerm);
        // var searchWords = [];
        // searchWords = searchTerm.split(' ');
        // var regexFromSearchWords = new RegExp(searchWords.join("|", "gi"));
        // console.log(regexFromSearchWords);
        getSearchResults(searchTerm);
    $('#clearSearch').on('click', function() {
        event.preventDefault();
        $('#searchTerm').val('');
    });
    
    });
}

function getSearchResults(term) {
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
        .then(responseJson => displayResults(responseJson))  
        .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
        })

    $('.results').removeClass('hidden');
   
}

function displayResults(responseJson) {
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
            
            .then(responseJson => displayResults(responseJson))
            .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
            })
    
    }

$(function() {
    console.log('App loaded! Waiting for submit!');
    watchForm();
    });