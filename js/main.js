var movieId;
var imdbId;
var wrapper;
var total_results;
var title;
var imdb = 'https://www.imdb.com/title/';
var valid;

var onInputResults;
var topTen;
var rest;

var playingNow;

var monthName;
var dayName;
//var playingNowDate;

//var releaseDate;

var date;
var youtubeVideo = 'https://www.youtube.com/embed/';

var arr = [];

var movieImage;

var tmp;
var tmp2;
var page;

//var omdbKey = '59556c8e';

var omdbKey = 'a9da0769';

var tmdbKey = '0271448f9ff674b76c353775fa9e6a82';

var nowPlayingUrl = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + tmdbKey + "&language=en-US&page=1";
var searchMovieUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + tmdbKey + "&query=";
var searchMorePagesUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + tmdbKey + "&page=";
var movieInfoUrl = "https://api.themoviedb.org/3/movie/";
var movieActorsUrl = "https://api.themoviedb.org/3/person/";


$(document).ready(function () {

    //goToTop();

    page = 0;

    window.onscroll = function () {
        myFunction();
        scrollBtn();
    };

    function myFunction() {
        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrolled = (winScroll / height) * 100;
        document.getElementById("myBar").style.width = scrolled + "%";
    }

    $('#searchMovie').on("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            $('.results').css('display', 'none');

            searchMovie();
        }
    });

    $('#searchMovie').on('input', function () {
        $('.movieUl').css('display', 'block');
        
        $('.resultWrapper').remove();

        //$('.movieLi').remove();
        backColor(this);
        $('.inputError').fadeOut(200);
        $('.noMovieError').fadeOut(500);

        //console.log($(this).val());

        //if ($(this).val().length > 4 && $(this).val() !== '') {

        //    $('.results').css('display', 'block');

        //    var resultWrapper = $('<div>', {
        //        class: 'resultWrapper'
        //    }).appendTo($('.movieUl'));


        //    $.ajax({
        //        type: 'GET',
        //        crossDomain: true,
        //        url: 'http://www.omdbapi.com/?apikey=' + omdbKey + '&type=movie&s=' + $(this).val(),
        //        dataType: "jsonp",
        //        ifModified: true,
        //        success: function (data) {
        //            onInputResults = data.Search;
        //            //console.log(data);

                    

        //            try {
        //                for (var i = 0; i < onInputResults.length; i++) {

        //                    title = onInputResults[i].Title;

        //                    var year = title + ' (' + onInputResults[i].Year + ')';

        //                    var posterImg = onInputResults[i].Poster;

        //                    if (posterImg == 'N/A') {
        //                        posterImg = './images/stock.png'
        //                    }


        //                    var movieLI = $('<li>', {
        //                        class: 'movieLi',
        //                        html: '<span>' + year + '</span>',
  
        //                        click: function () {

        //                            var str = $(this)[0].textContent;
        //                            str = str.substring(0, str.indexOf('('));
       
        //                            $('#searchMovie').val(str);

        //                            $('.movieUl').css('display', 'none');
        //                            $('.results').css('display', 'none');

        //                            searchMovie();


        //                        },
        //                    }).appendTo(resultWrapper);

        //                    var movieResultImage = $('<img>', {
        //                        class: 'movieResultImage',
        //                        src: posterImg,
        //                    }).appendTo(movieLI);


        //                }
        //            } catch (e) {
        //                //console.log(e);
        //                return;
        //            }

        //        },
        //        error: function (err) {

        //            //console.log(err);
        //        }
        //    })

        //} else {
        //    $('.results').css('display', 'none');
        //}

    })

    getPlayingNow();

})

function goToTop() {
    $('html,body').animate({ scrollTop: 0 }, 'slow');
}

function scrollBtn() {

    if ($(this).scrollTop() > 550) {
        $('.goToTopBtn').fadeIn();
    }
    else {
        $('.goToTopBtn').fadeOut();
    }

}


function getPlayingNow() {

    var playingNowHeader = $('<h2>', {
        class: 'playingNowHeader',
        text: 'Playing Now'
    }).insertAfter($('.inputWrapper'));

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: nowPlayingUrl,
        dataType: "json",
        ifModified: true,
        success: function (data) {


            //console.log(data);

            playingNow = data.results;



            for (var i = 0; i < data.results.length; i++) {

                try {
                    var path = playingNow[i].poster_path;

                    title = playingNow[i].title;

                    movieImage = playingNow[i].backdrop_path;
                    

                    movieId = playingNow[i].id;
                    var tmdbPathPosterPath = 'https://image.tmdb.org/t/p/w500' + path;
                    var tmbdBackdropPath = 'https://image.tmdb.org/t/p/w500' + movieImage;

                    if (path == 'undefined' || path == null) {
                        tmdbPathPosterPath = './images/stock.png';
                    }


                    wrapper = $('<div>', {
                        class: 'playingNowWrapper',
                        value: movieId,
                        backdropSrc: tmbdBackdropPath,
                        click: function () {
                            movieClicked($(this)[0].attributes.value.textContent, $(this), $(this)[0].attributes.backdropSrc.textContent);

                        },

                    }).appendTo($('.container'));

                    var movieTitle = $('<p>', {
                        class: 'movieTitle',
                        text: title

                    }).appendTo(wrapper)

                    var img = $('<img>', {
                        class: 'movieImg',
                        src: tmdbPathPosterPath
                    }).appendTo(wrapper);


                } catch (e) {
                    //console.log(e);
                    //return;
                }



            }

        },
        error: function (err) {

            //console.log(err);
        }
    })
}


function searchMovie() {

    $('.inputError').fadeOut(200);
    $('.noMovieError').fadeOut(500);


    valid = true;

    var inputVal = $('#searchMovie').val();

    if ((inputVal == '' || inputVal == null || ($("#searchMovie").val().length) <= 2)) {
        $('.inputError').fadeIn(500);
        $('#searchMovie').focus().css(
        {
            'color': 'red'
            //'border-color': 'red',

        });
        valid = false;

    }

    if (valid) {

        page = 0;

        $('.container').removeClass('singleMovieContainer');
        $('.logo').css('cursor', 'unset');
        $(document.activeElement).filter(':input:focus').blur();
        
        $('.playingNowHeader').remove();
        $('.playingNowWrapper').remove();
     
        $('.spinner').fadeIn('fast');
        $('.spinnerWrapper').fadeIn('fast');

        var width = 1;
        var id = setInterval(frame, 30);
        function frame() {

            width++;

            if (width >= 100) {
                clearInterval(id);

                $('.spinnerWrapper').css('display', 'none');
                $('.spinner').css('display', 'none');
                $('.movieWrapper').css('display', 'block');
                $('.movieWrapper').css('display', 'flex');

                width = 1;
            }

        }


        $('.chosenMovie').remove();
        $('.movieWrapper').remove();
        var val = $('#searchMovie').val();
        //var page = 1;
        var total_pages;


        $.ajax({
            type: 'GET',
            crossDomain: true,
            url: searchMovieUrl + val,
            dataType: "json",
            ifModified: true,
            success: function (data) {
                topTen = data.results;
                total_pages = data.total_pages
                total_results = data.total_results;

                if (total_results == 0) {
                    getPlayingNow();
                    $('.noMovieError').fadeIn(500);
                    $('.playingNowHeader').fadeIn(500);
                    $('.spinnerWrapper').css('display', 'none');
                }

                for (var i = 0; i < total_results; i++) {

                    try {


                        var path = topTen[i].poster_path;
                        title = topTen[i].title;

                        movieId = topTen[i].id;

                        movieImage = topTen[i].backdrop_path;

                        var tmdbPathPosterPath = 'https://image.tmdb.org/t/p/w500' + path;
                        var tmbdBackdropPath = 'https://image.tmdb.org/t/p/w500' + movieImage;


                        if (path == 'undefined' || path == null) {
                            tmdbPathPosterPath = './images/stock.png';
                        }
                        wrapper = $('<div>', {
                            class: 'movieWrapper',
                            value: movieId,
                            backdropSrc: tmbdBackdropPath,
                            click: function () {
                                movieClicked($(this)[0].attributes.value.textContent, $(this), $(this)[0].attributes.backdropSrc.textContent);
                            },

                        }).appendTo($('.container'));


                        wrapper.css('display', 'none');

                        var movieTitle = $('<p>', {
                            class: 'movieTitle',
                            text: title

                        }).appendTo(wrapper)

                        var img = $('<img>', {
                            class: 'movieImg',
                            src: tmdbPathPosterPath
                        }).appendTo(wrapper);


                    } catch (e) {
                        return;
                    }

                }

            },
            error: function (err) {

                //console.log(err);
            }
        })



        setTimeout(function () {

            for (var i = 2; i <= total_pages; i++) {

                $.ajax({
                    type: 'GET',
                    crossDomain: true,
                    url: searchMorePagesUrl + i + '&query=' + val,
                    dataType: "json",
                    ifModified: true,
                    success: function (data) {
                        //console.log(data);

                        rest = data.results;

                        for (var j = 0; j < data.total_results; j++) {


                            try {
                                var path = rest[j].poster_path;
                                movieId = rest[j].id;

                                movieImage = rest[i].backdrop_path;

                                title = rest[j].title;

                                var tmdbPathPosterPath = 'https://image.tmdb.org/t/p/w500' + path;
                                var tmbdBackdropPath = 'https://image.tmdb.org/t/p/w500' + movieImage;


                                if (path == 'undefined' || path == null) {
                                    tmdbPathPosterPath = './images/stock.png';
                                }


                            } catch (e) {
                                return;
                            }


                            wrapper = $('<div>', {
                                class: 'movieWrapper',
                                value: movieId,
                                backdropSrc: tmbdBackdropPath,
                                click: function () {
                                    movieClicked($(this)[0].attributes.value.textContent, $(this), $(this)[0].attributes.backdropSrc.textContent);
                                },

                            }).appendTo($('.container'));


                            wrapper.css('display', 'none');

                            var movieTitle = $('<p>', {
                                class: 'movieTitle',
                                text: title

                            }).appendTo(wrapper)

                            var img = $('<img>', {
                                class: 'movieImg',
                                src: tmdbPathPosterPath
                            }).appendTo(wrapper);

                            movieId = rest[j].id;
                        }

                    },
                    error: function (err) {

                        //console.log(err);
                    }
                });
            }


        }, 500)

        $('#searchMovie').val('');

        setTimeout(function () {
            if ($('.movieWrapper').is(':visible')) {

                $('html,body').animate({ scrollTop: 400 }, 'slow');
            }
            
        }, 3500)
        

    }

}


function thanos() {
    $('.thanos').show();

    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', './sounds/thanos.mp3');
    //$('.thanosImg').hide();
    audioElement.play();
    $('.container').css('opacity', '.5');

    setTimeout(function () {
        $('.thanos').hide(500);
        //$('.thanosImg').show(500);
        $('.container').css('opacity', '1');
    }, 8000);

}

function goHome() {
    if (page !== 0) {
        location.reload();
    }
}

function movieClicked(movieId, div, path) {

    $('.container').addClass('singleMovieContainer');

    $('.inputError').fadeOut(200);
    $('.noMovieError').fadeOut(500);

    $('.container').css('margin-top', '3rem');

    //$('body').css('background', 'url(' + path + ') no-repeat center');

    $('.spinner').fadeIn('fast');
    $('.spinnerWrapper').fadeIn('fast');
    $('.bottomSection').css('display', 'none');

    div.css('display', 'none');
    div.removeClass('playingNowWrapper');
    div.removeClass('movieWrapper');

    $('.playingNowHeader').remove();
    $('.playingNowWrapper').remove();

    div.addClass('chosenMovie');

    $('.movieWrapper').remove();

    $('.movieImg').remove();


    var width = 1;
    var id2 = setInterval(frame, 30);
    function frame() {
  
        width++;

        if (width >= 100) {
            clearInterval(id2);

            $('.spinnerWrapper').css('display', 'none');
            $('.spinner').css('display', 'none');
            $('.bottomSection').css('display', 'block');
            //$('.movieWrapper').css('display', 'block');
            $('.movieWrapper').css('display', 'flex');

            div.fadeIn('slow');

            width = 1;
        }
    }

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieInfoUrl + movieId + "?api_key=" + tmdbKey + "",
        dataType: "json",
        ifModified: true,
        success: function (data) {
            page = 1;

            $('.logo').css('cursor', 'pointer');

            imdbId = data.imdb_id;

            if (imdbId == 'tt4154796') {
                thanos();

                //$('.thanosImg').click(function () {
                //    thanos();
                //});

            }

            movieImage = data.backdrop_path;

            var movieReleaseDate = data.release_date;

            date = new Date(movieReleaseDate);

            var month = date.getMonth();

            var year = date.getFullYear();

            var day = date.getDate();

            changeMonthName(month);
            
            changeDayName(day);

            var detailsWrapper = $('<div>', {
                class: 'detailsWrapper',
            }).appendTo($('.chosenMovie'));

            var imdbLink = $('<a>', {
                class: 'imdbLink',
                target: '_blank',
                href: imdb + imdbId
            }).appendTo(detailsWrapper);


            var imdbImage = $('<img>', {
                class: 'imdbImage',
                //src: '../images/imdb.png'
                src: 'https://image.tmdb.org/t/p/w500' + movieImage
            }).appendTo(imdbLink);


            var descriptionWrapper = $('<div>', {
                class: 'descriptionWrapper',

            }).appendTo(detailsWrapper);

            var description = $('<p>', {
                class: 'movieDescription',
                text: data.overview,
            }).appendTo(descriptionWrapper);

            var withCommas = numberWithCommas(data.revenue);

            var movieDetails = $('<div>', {
                class: 'movieDetails',

            }).appendTo(detailsWrapper);

            var revenue = $('<p>', {
                class: 'movieRevenue',
                text: 'Revenue: ' + ' $ ' + withCommas,
            }).appendTo(movieDetails);


            var hoursRuntime = convertMinsToHrsMins(data.runtime);

            var runtime = $('<p>', {
                class: 'movieRuntime',
                text: 'Runtime: ' + hoursRuntime,
            }).appendTo(movieDetails);

            var releaseDate = $('<p>', {
                class: 'releaseDate',
                text: 'Release Date: ' + monthName + ' ' + dayName + ' ' + year,
            }).appendTo(movieDetails);

            var movieGenreWrapper = $('<div>', {
                class: 'movieGenreWrapper',
            }).appendTo(movieDetails);


            var movieGenreHead = $('<span>', {
                class: 'movieGenreHead',
                text: 'Genres: ',
            }).appendTo(movieGenreWrapper);
 
            for (var i = 0; i < data.genres.length; i++) {

                arr.push(data.genres[i].name);
                arr.join(' , ');
        
                //arr.split(',').join(', ');
                

            }

            var movieGenre = $('<span>', {
                class: 'movieGenre',
                text: arr,
            }).appendTo(movieGenreWrapper);

            var castWrapper = $('<div>', {
                class: 'castWrapper',

            }).appendTo($('.chosenMovie'));

            var moveiGallery = $('<div>', {
                class: 'moveiGallery',

            }).appendTo($('.chosenMovie'));

            var moveiVideos = $('<div>', {
                class: 'moveiVideos',

            }).appendTo($('.chosenMovie'));

            $('.movieGenre').html($('.movieGenre').html().split(',').join(', '));

        },
        error: function (err) {
            //console.log(err);
        }
    })

    setTimeout(function () {

        $.ajax({
            type: 'GET',
            crossDomain: true,
            url: movieInfoUrl + movieId + "/credits?api_key=" + tmdbKey + "",
            dataType: "json",
            ifModified: true,
            success: function (data) {

                //console.log(data);

                for (var i = 0; i < 21; i++) {

                    try {
                        var actorImgPath = 'https://image.tmdb.org/t/p/w500' + data.cast[i].profile_path;

                        if (data.cast[i].profile_path == 'undefined' || data.cast[i].profile_path == null || data.cast[i].profile_path == '') {
                            actorImgPath = './images/actor.png';
                        }


                        var characterWrapper = $('<div>', {
                            class: 'castName',
                        }).appendTo($('.castWrapper'));

                        var imageLink = $('<a>', {
                            class: 'imageLink',

                        }).appendTo(characterWrapper);

                        var actorImg = $('<img>', {
                            class: 'actorImg',
                            src: actorImgPath,
                            id: data.cast[i].id,
                            //value: $(this)[0].attributes.id.textContent,
                            click: function () {
                                goToActorImdb($(this)[0].attributes.id.textContent, $($(this)[0].parentElement));
                            }
                        }).appendTo(imageLink);


                        var actorName = $('<span>', {
                            class: 'actorName',
                            text: data.cast[i].name + ': '
                        }).appendTo(characterWrapper);

                        var characterName = $('<span>', {
                            class: 'characterName',
                            text: data.cast[i].character
                        }).appendTo(characterWrapper);


                    } catch (e) {
                        return;
                    }

                }

                $('.actorImg').trigger("click");

                $('.actorImg').off();

            },
            error: function (err) {

                //console.log(err);
            }
        })
    }, 100)

    $('.chosenMovie').off();
    $('.actorImg').off();


    setTimeout(function () {
        $.ajax({
            type: 'GET',
            crossDomain: true,
            url: movieInfoUrl + movieId + "/images?api_key=" + tmdbKey + "",
            dataType: "json",
            ifModified: true,
            success: function (data) {

                for (var i = 0; i < data.backdrops.length; i++) {

                    var galleryImg = data.backdrops[i].file_path;

                    var galleryImgPath;

                    //console.log(test);

                    if (galleryImg == null || galleryImg == '') {
                        
                        galleryImgPath = './images/noImage.png';
                    } else {
                        galleryImgPath = 'https://image.tmdb.org/t/p/w500/' + galleryImg;
                    }

                    //console.log(galleryImgPath);

                    var movieGalleryImg = $('<img>', {
                        class: 'movieGalleryImg',
                        src: galleryImgPath,


                    }).appendTo($('.moveiGallery'));

                }

            },
            error: function (e) {
                //console.log(e);
            }
        })
    }, 500)


     setTimeout(function () {
        $.ajax({
            type: 'GET',
            crossDomain: true,
            url: movieInfoUrl + movieId + "/videos?api_key=" + tmdbKey + "",
            dataType: "json",
            ifModified: true,
            success: function (data) {
                
                
                //console.log(data);


                for (var i = 0; i < data.results.length; i++) {
   
                    var movieUrl = youtubeVideo + data.results[i].key;

                    var movieVideo = $('<iframe>', {
                        class: 'movieVideo',
                        src: movieUrl,
                        width: '420',
                        height: '315'


                    }).appendTo($('.moveiVideos'));
                    
                }

            },
            error: function (err) {

                //console.log(err);
            }
        })
     }, 600)
        setTimeout(function () {

        for (var j = 0; j < $('.movieGalleryImg').length ; j++) {
            //console.log(j);
            tmp = $($('.movieGalleryImg')[j].attributes.src)[0].textContent;

            $($('.movieGalleryImg')[j]).attr('src', 'asd');

            $($('.movieGalleryImg')[j]).attr('src', tmp);

        }

        for (var k = 0; k < $('.actorImg').length ; k++) {
            //console.log(k);
            tmp2 = $($('.actorImg')[k].attributes.src)[0].textContent;

            $($('.actorImg')[k]).attr('src', 'asd');

            $($('.actorImg')[k]).attr('src', tmp2);

        }

            //console.log($('.movieGalleryImg'));
            //console.log(tmp2);

    }, 4000)



}




function goToActorImdb(imdbActorId, that) {

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieActorsUrl + imdbActorId + "?api_key=" + tmdbKey + "&language=en-US",
        dataType: "json",
        ifModified: true,

        success: function (data) {

            //console.log(data);

            that.attr('href', 'https://www.imdb.com/name/' + data.imdb_id);
            that.attr('target', '_blank');

        },
        error: function (err) {

            //console.log(err);
        }

    })


}




function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function convertMinsToHrsMins(mins) {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    h = h < 10 ? '' + h : h;
    m = m < 10 ? '' + m : m;

    if (h > 1) {
    return h + ' Hours ' + ' And ' + m + ' Minutes';
    } else {
        return h + ' Hour ' + ' And ' + m + ' Minutes';
    }

    
    
}

function backColor(elem) {
    $(elem).css({
        'color': 'black'
        //'border': 'none'
    });
}

function changeMonthName(month) {
    switch (month) {
        case 0: {
            monthName = 'January';
            break;
        }
        case 1: {
            monthName = 'Februar';
            break;
        }
        case 2: {
            monthName = 'March';
            break;
        }
        case 3: {
            monthName = 'April';
            break;
        }
        case 4: {
            monthName = 'May';
            break;
        }
        case 5: {
            monthName = 'June';
            break;
        }
        case 6: {
            monthName = 'July';
            break;
        }
        case 7: {
            monthName = 'August';
            break;
        }
        case 8: {
            monthName = 'September';
            break;
        }
        case 9: {
            monthName = 'October';
            break;
        }
        case 10: {
            monthName = 'November';
            break;
        }
        case 11: {
            monthName = 'December';
            break;
        }

    }
}

function changeDayName(day) {
    switch (day) {
        case 1:
        case 21:
        case 31: {
            dayName = day + 'st';
            break;
        }
        case 2:
        case 22: {
            dayName = day + 'nd';
            break;
        }
        case 3:
        case 23: {
            dayName = day + 'rd';
            break;
        }

        default: {
            dayName = day + 'th';
        }


    }
}

