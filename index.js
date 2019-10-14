'use strict';
var imslpURL = "http://imslp.org/imslpscripts/API.ISCR.php?account=worklist/disclaimer=accepted/sort=id/type=2/start=0/retformat=json";

function watchForm() {
    $('form').submit(event =>{
        event.preventDefault();
        console.log('you clicked the search button!');
        var searchTerm = $('#searchTerm').val();
        console.log(searchTerm);
        getSearchResults(searchTerm);
    });
}

function getSearchResults(term) {
    var queryURL = "https://cors-anywhere.herokuapp.com/" + imslpURL;
    var data = [];
    fetch(queryURL).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
        })
        .then(function(responseJson) {
            console.log(responseJson);
            const data = JSON.stringify(responseJson);
            console.log(data[0]);
        })
  
    
    $('.results').removeClass('hidden');
}

$(function() {
    console.log('App loaded! Waiting for submit!');
    watchForm();
    });
