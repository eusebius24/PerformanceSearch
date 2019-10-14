'use strict';


function watchForm() {
    $('form').submit(event =>{
        event.preventDefault();
        console.log('you clicked the search button!');
        var searchTerm = $('#searchTerm').val();
        console.log(searchTerm);
        var searchWords = [];
        searchWords = searchTerm.split(' ');
       
        
        getSearchResults(searchWords);
    });
}

function getSearchResults(array) {
        for (var j=0; j<150000; j+=1000) {
            var imslpURL = "http://imslp.org/imslpscripts/API.ISCR.php?account=worklist/disclaimer=accepted/sort=id/type=2/start="+ [j] + "/retformat=json";
            var queryURL = "https://cors-anywhere.herokuapp.com/" + imslpURL;
            fetch(queryURL).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
                })
                .then(function(responseJson) {
                    for(let i in responseJson) {
                        var composer = responseJson[i].intvals.composer;
                        var work = responseJson[i].intvals.worktitle;
                        var permalink = responseJson[i].permlink;
                        var composerLowerCase = composer.toLowerCase();
                        var workLowerCase = work.toLowerCase();
                        
                        var searchResults = [];
                        for (var k=0; k < array.length; k++) {
                            
                            var term = array[k];
                            
                            var termLowerCase = term.toLowerCase();
                        if (composerLowerCase.includes(termLowerCase) || workLowerCase.includes(termLowerCase)) {
                            var workInfo = {"composer": composer,
                                            "work": work
                        };
                            searchResults.push(workInfo);
                            
                            console.log(composer, work);
                            var resultString = `<li>Composer: ${composer}<br>Work: ${work}<br><a href='${permalink}'>Permalink to score page</a></li>`;
                            console.log(resultString);
                            $('.imslp-results').append(resultString);
                        }
                    
                        
                    }
                }

                })
    
        }
    
    $('.results').removeClass('hidden');
}

$(function() {
    console.log('App loaded! Waiting for submit!');
    watchForm();
    });
