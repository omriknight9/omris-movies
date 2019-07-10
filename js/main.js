var movieId;
var tvShowId;
var imdbId;
var wrapper;
var total_results;
var title;
var imdb = 'https://www.imdb.com/title/';
var baseUrl = "https://sg.media-imdb.com/suggests/";
var valid;

var onInputResults;
var topTen;
var rest;

var playingNow;

var monthName;
var dayName;

var date;
var youtubeVideo = 'https://www.youtube.com/embed/';

var arr = [];

var movieImage;
var tvShowImage;

var objectImage;

var tmp;
var tmp2;
var page;

var tmdbKey = '0271448f9ff674b76c353775fa9e6a82';

var nowPlayingUrl = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + tmdbKey + "&language=en-US&page=1";
var searchMovieUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + tmdbKey + "&query=";
var searchMorePagesUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + tmdbKey + "&page=";
var movieInfoUrl = "https://api.themoviedb.org/3/movie/";
var movieActorsUrl = "https://api.themoviedb.org/3/person/";

var searchTvShowUrl = "https://api.themoviedb.org/3/search/tv?api_key=" + tmdbKey + "&query=";
var searchMoreTvShowsUrl = "https://api.themoviedb.org/3/search/tv?api_key=" + tmdbKey + "&page=";
var tvShowInfoUrl = "https://api.themoviedb.org/3/tv/";

$(document).ready(function () {
    page = 0;

    var x = location.href;

    if (x.includes('?')) {
        location.href = x.split("?")[0];
    }

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

            var inputVal = $('#searchMovie').val();
            searchMovie();

            setTimeout(function () {
                searchTVShows(inputVal);
            }, 2000)
        }
    });

    showResults();

    getPlayingNow();

})

function showResults() {
    $(document).mouseup(function (e) {
        var container = $(".results");

        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
        }
    });

    $('#searchMovie').on('keyup', function () {
        var cleanInput = $('#searchMovie').val().replace(/\s/g, "");

        if (cleanInput.length === 0) {
            $('.results').html('');
            $('.results').css('display', 'none');

        }

        if (cleanInput.length > 0) {
            $('.inputError').fadeOut(200);
            $('#searchMovie').css('color', 'black');
            var queryUrl = baseUrl + cleanInput[0].toLowerCase() + "/"
                          + cleanInput.toLowerCase()
                          + ".json";

            var test2;

                var ajax = $.ajax({

                    url: queryUrl,
                    dataType: 'jsonp',
                    cache: true,
                    jsonp: false,
                    jsonpCallback: "imdb$" + cleanInput.toLowerCase(),

                    success: function (result) {
                        if (result.d == 'undefind' || result.d == null) {
                            return;
                        }

                        if (result.d.length > 0) {
                            $('.results').html('');
                            $('.results').css('display', 'none');
                        }

                        $('.results').css('display', 'block');
                        $('.results').animate({ scrollTop: 0 }, 'fast');

                        for (var i = 0; i < result.d.length; i++) {

                            var category = result.d[i].id.slice(0, 2);

                            if (category === "tt") {
                                //row for risplaying one result
                                var resultRow = document.createElement('div');
                                resultRow.setAttribute('class', 'resultRow');
                                var destinationUrl;

                                destinationUrl = "http://www.imdb.com/title/" + result.d[i].id;

                                resultRow.setAttribute('href', destinationUrl);
                                resultRow.setAttribute('target', '_blank');

                                var posterWrapper = document.createElement('div');
                                posterWrapper.setAttribute('class', 'posterWrapper');

                                var poster = document.createElement('img');
                                poster.setAttribute('class', 'poster');

                                if (result.d[i].i) {
                                    var imdbPoster = result.d[i].i[0];
                                    imdbPoster = imdbPoster.replace("._V1_.jpg", "._V1._SX100_CR0,0,100,148.jpg");
                                    var posterUrl =
                                        "http://i.embed.ly/1/display/resize?key=798c38fecaca11e0ba1a4040d3dc5c07&url="
                                        + imdbPoster
                                        + "&height=54&width=40&errorurl=http%3A%2F%2Flalwanivikas.github.io%2Fimdb-autocomplete%2Fimg%2Fnoimage.png&grow=true"
                                    poster.setAttribute('src', imdbPoster);
                                }

                                //creating and setting description
                                var description = document.createElement('div');
                                description.setAttribute('class', 'description');
                                var name = document.createElement('h4');
                                var snippet = document.createElement('h5');

                                if (category === "tt" && result.d[i].y) {
                                    name.innerHTML = result.d[i].l + " (" + result.d[i].y + ")";
                                } else {
                                    name.innerHTML = result.d[i].l;
                                }
                                snippet.innerHTML = result.d[i].s;

                                $(description).append(name);
                                $(description).append(snippet);
                                $(resultRow).append(posterWrapper);
                                $(posterWrapper).append(poster);
                                $(resultRow).append(description);
                                $('.results').append(resultRow);
                            }
                        }

                        $('.resultRow').click(function () {

                            $('.results').fadeOut('fast');
                            var movieName = $(this).find('.description h4').html();

                            $('#searchMovie').val(movieName);

                            var inputVal = $('#searchMovie').val();
                            searchMovie();
                            setTimeout(function () {
                                searchTVShows(inputVal);
                            }, 2000)
                        })
                    },

                })
        }

    })
}

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

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: nowPlayingUrl,
        dataType: "jsonp",
        ifModified: true,
        success: function (data) {

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

    window.history.pushState({ "html": location.href, "pageTitle": location.href.pageTitle }, "", location.href.split("?")[0]);

    $('.playingNowHeader').hide();
    $('.inputError').fadeOut(200);
    $('.noMovieError').fadeOut(500);
    var regex = /[^A-Za-z0-9]+/g;

    valid = true;

    var inputVal = $('#searchMovie').val();

    var noParentheses = inputVal.replace(/\([^()]*\)/g, "");

    var inputValClean = noParentheses.replace(regex, " ");

    if ((inputVal == '' || inputVal == null)) {
        $('.inputError').fadeIn(500);
        $('#searchMovie').focus().css(
        {
            'color': 'red'
        });
        valid = false;
    }

    if (valid) {

        page = 0;

        $('.container').removeClass('singleMovieContainer');
        $('.logo').css('cursor', 'unset');
        $(document.activeElement).filter(':input:focus').blur();
        $('.container').css('margin-top', '-5rem');
        $('.playingNowHeader').html('Movies');
        $('.tvShowsHeader').remove();
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
        $('.tvShowWrapper').remove();
        var val = inputValClean;
        var total_pages;

        $.ajax({
            type: 'GET',
            crossDomain: true,
            url: searchMovieUrl + val,
            dataType: "jsonp",
            ifModified: true,
            success: function (data) {
                topTen = data.results;
                total_pages = data.total_pages
                total_results = data.total_results;

                if (total_results == 0) {
                    getPlayingNow();
                    $('.noMovieError').fadeIn(500);
                    $('.playingNowHeader').html('Playing Now');
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
                    dataType: "jsonp",
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

function searchTVShows(value) {

    $('.inputError').fadeOut(200);
    $('.noMovieError').fadeOut(500);
    var regex = /[^A-Za-z0-9]+/g;

    valid = true;

    //var inputVal = $('#searchMovie').val();

    var inputVal = value;

    var noParentheses = inputVal.replace(/\([^()]*\)/g, "");

    var inputValClean = noParentheses.replace(regex, " ");

    if ((inputVal == '' || inputVal == null)) {
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

        //$('.playingNowHeader').remove();
        $('.playingNowHeader').html('Movies');
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
                $('.tvShowWrapper').css('display', 'block');
                $('.tvShowWrapper').css('display', 'flex');

                width = 1;
            }
        }

        $('.chosenMovie').remove();
        $('.tvShowWrapper').remove();
        $('.tvShowsHeader').remove();
        //var val = $('#searchMovie').val();
        var val = inputValClean;
        //var page = 1;
        var total_pages;

        var tvShowsHeader = $('<h2>', {
            class: 'tvShowsHeader',
            text: 'TV Shows'

        }).appendTo($('.container'));

        $.ajax({
            type: 'GET',
            crossDomain: true,
            url: searchTvShowUrl + val,
            dataType: "jsonp",
            ifModified: true,
            success: function (data) {
                topTen = data.results;
                total_pages = data.total_pages
                total_results = data.total_results;
                if (total_results == 0) {
                    $('.tvShowsHeader').hide();
                    //getPlayingNow();
                    //$('.noMovieError').fadeIn(500);
                    //$('.playingNowHeader').fadeIn(500);
                    //$('.spinnerWrapper').css('display', 'none');
                }

                for (var i = 0; i < total_results; i++) {

                    try {
                        var path = topTen[i].poster_path;
                        title = topTen[i].original_name;

                        tvShowId = topTen[i].id;

                        tvShowImage = topTen[i].backdrop_path;

                        var tmdbPathPosterPath = 'https://image.tmdb.org/t/p/w500' + path;
                        var tmbdBackdropPath = 'https://image.tmdb.org/t/p/w500' + tvShowImage;


                        if (path == 'undefined' || path == null) {
                            tmdbPathPosterPath = './images/stock.png';
                        }

                        wrapper = $('<div>', {
                            class: 'tvShowWrapper',
                            value: tvShowId,
                            backdropSrc: tmbdBackdropPath,
                            click: function () {
                                tvShowClicked($(this)[0].attributes.value.textContent, $(this), $(this)[0].attributes.backdropSrc.textContent);
                            },

                        }).appendTo($('.container'));


                        wrapper.css('display', 'none');

                        var tvShowTitle = $('<p>', {
                            class: 'tvShowTitle',
                            text: title

                        }).appendTo(wrapper)

                        var img = $('<img>', {
                            class: 'tvShowImg',
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
                    url: searchMoreTvShowsUrl + i + '&query=' + val,
                    dataType: "jsonp",
                    ifModified: true,
                    success: function (data) {
                        //console.log(data);

                        rest = data.results;

                        for (var j = 0; j < data.total_results; j++) {

                            try {
                                var path = rest[j].poster_path;
                                tvShowId = rest[j].id;

                                tvShowImage = rest[i].backdrop_path;

                                title = rest[j].original_name;

                                var tmdbPathPosterPath = 'https://image.tmdb.org/t/p/w500' + path;
                                var tmbdBackdropPath = 'https://image.tmdb.org/t/p/w500' + tvShowImage;


                                if (path == 'undefined' || path == null) {
                                    tmdbPathPosterPath = './images/stock.png';
                                }


                            } catch (e) {
                                return;
                            }

                            wrapper = $('<div>', {
                                class: 'tvShowWrapper',
                                value: tvShowId,
                                backdropSrc: tmbdBackdropPath,
                                click: function () {
                                    tvShowClicked($(this)[0].attributes.value.textContent, $(this), $(this)[0].attributes.backdropSrc.textContent);
                                },

                            }).appendTo($('.container'));


                            wrapper.css('display', 'none');

                            var tvShowTitle = $('<p>', {
                                class: 'tvShowTitle',
                                text: title

                            }).appendTo(wrapper)

                            var img = $('<img>', {
                                class: 'tvShowImg',
                                src: tmdbPathPosterPath
                            }).appendTo(wrapper);

                            tvShowId = rest[j].id;
                        }

                    },
                    error: function (err) {

                        //console.log(err);
                    }
                });
            }
            
        }, 500)

        setTimeout(function () {
            $('.playingNowHeader').show();

        }, 1000)

        setTimeout(function () {

            if (total_results !== 0) {
                $('.tvShowsHeader').show();
            }

        }, 2000)

        $('#searchMovie').val('');
    }
}

function goHome() {
    if (page !== 0) {
        location.reload();
    }
}

function getCredits(objectId, kind) {

    var tmdbUrl;

    if (kind == 1) {
        tmdbUrl = movieInfoUrl;
    } else {
        tmdbUrl = tvShowInfoUrl;
    }

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tmdbUrl + objectId + "/credits?api_key=" + tmdbKey + "",
        dataType: "jsonp",
        ifModified: true,
        success: function (data) {

            for (var i = 0; i < 21; i++) {

                try {
                    var actorImgPath = 'https://image.tmdb.org/t/p/w500' + data.cast[i].profile_path;

                    if (data.cast[i].profile_path == 'undefined' || data.cast[i].profile_path == null || data.cast[i].profile_path == '') {

                        switch (data.cast[i].gender) {
                            case 0:
                                actorImgPath = './images/actor.png';
                                break;
                            case 1:
                                actorImgPath = './images/actress.png';
                                break;
                            case 2:
                                actorImgPath = './images/actor.png';
                                break;
                        }

                    }

                    var castName = $('<div>', {
                        class: 'castName',
                    }).appendTo($('.cast'));

                    var imageLink = $('<a>', {
                        class: 'imageLink',

                    }).appendTo(castName);

                    var actorImg = $('<img>', {
                        class: 'actorImg',
                        src: actorImgPath,
                        id: data.cast[i].id,
                        click: function () {
                            goToMovieImdb($(this)[0].attributes.id.textContent, $($(this)[0].parentElement));
                        }
                    }).appendTo(imageLink);

                    var actorName = $('<span>', {
                        class: 'actorName',
                        text: data.cast[i].name + ': '
                    }).appendTo(castName);

                    var characterName = $('<span>', {
                        class: 'characterName',
                        text: data.cast[i].character
                    }).appendTo(castName);

                    var imdbLinkWrapper = $('<a>', {
                        class: 'imdbLinkWrapper',

                    }).appendTo(castName);

                    var imdbLink = $('<img>', {
                        src: './images/imdb_small.png',
                        class: 'imdbLink',
                        id: data.cast[i].id,
                        click: function () {
                            goToActorImdb($(this)[0].attributes.id.textContent, $($(this)[0].parentElement));
                        }
                    }).appendTo(imdbLinkWrapper);


                } catch (e) {
                    return;
                }
            }
        },
        error: function (err) {

            //console.log(err);
        }
    })
}

function getImages(objectId, kind) {
    var tmdbUrl;

    if (kind == 1) {
        tmdbUrl = movieInfoUrl;
    } else {
        tmdbUrl = tvShowInfoUrl;
    }

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tmdbUrl + objectId + "/images?api_key=" + tmdbKey + "",
        dataType: "jsonp",
        ifModified: true,
        success: function (data) {

            for (var i = 0; i < data.backdrops.length; i++) {

                var galleryImg = data.backdrops[i].file_path;
                var galleryImgPath;

                if (galleryImg == null || galleryImg == '') {

                    galleryImgPath = './images/noImage.png';
                } else {
                    galleryImgPath = 'https://image.tmdb.org/t/p/w500/' + galleryImg;
                }

                if (i !== 0) {
                    var movieGalleryImg = $('<img>', {
                        class: 'movieGalleryImg',
                        src: galleryImgPath,
                    }).appendTo($('.objectGallery'));
                }
            }
        },
        error: function (e) {
            //console.log(e);
        }
    })
}

function getVideos(objectId, kind) {
    var tmdbUrl;

    if (kind == 1) {
        tmdbUrl = movieInfoUrl;
    } else {
        tmdbUrl = tvShowInfoUrl;
    }

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tmdbUrl + objectId + "/videos?api_key=" + tmdbKey + "",
        dataType: "jsonp",
        ifModified: true,
        success: function (data) {

            for (var i = 0; i < 5; i++) {
                if (data.results[i] == undefined || data.results[i] == null) {
                    return;
                }

                var objectUrl = youtubeVideo + data.results[i].key;
                var movieVideo = $('<iframe>', {
                    class: 'movieVideo',
                    src: objectUrl,
                    width: '420',
                    height: '315'

                }).appendTo($('.objectVideos'));
            }
        },
        error: function (err) {
            //console.log(err);
        }
    })
}

function getObjectInfo(objectId, kind) {
    var inputVal2;
    var url;
    var tmdbUrl;

    if (kind == 1) {
        inputVal2 = $('.movieTitle').html();
        tmdbUrl = movieInfoUrl;
    } else {
        inputVal2 = $('.tvShowTitle').html();
        tmdbUrl = tvShowInfoUrl;
    }

    url = inputVal2.replace(/[^A-Za-z0-9]+/g, "");

    window.history.pushState('page2', 'Title', '?' + url);
    window.addEventListener('popstate', function (event) {
        window.location.reload();
    });

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tmdbUrl + objectId + "?api_key=" + tmdbKey + "",
        dataType: "jsonp",
        ifModified: true,
        success: function (data) {
            page = 1;

            $('.logo').css('cursor', 'pointer');

            objectImage = data.backdrop_path;
            if (kind == 1) {
                imdbId = data.imdb_id;
                var movieReleaseDate = data.release_date;
                date = new Date(movieReleaseDate);

            } else {
                var tvShowReleaseDate = data.first_air_date;
                date = new Date(tvShowReleaseDate);
            }

            if (objectImage == null) {
                finalImg = data.poster_path;

                setTimeout(function () {
                    $('.imdbImage').css('width', '200px');
                }, 1500)
            } else {
                finalImg = objectImage;
            }

            var month = date.getMonth();
            var year = date.getFullYear();
            var day = date.getDate();

            var finalImg;

            changeMonthName(month);
            changeDayName(day);

            var detailsWrapper = $('<div>', {
                class: 'detailsWrapper',
            }).appendTo($('.chosenMovie'));

            if (kind == 1) {
                var imdbLink = $('<a>', {
                    class: 'imdbLink',
                    target: '_blank',
                    href: imdb + imdbId
                }).appendTo(detailsWrapper);
                var withCommas = numberWithCommas(data.revenue);
            } else {
                var imdbLink = $('<a>', {
                    class: 'imdbLink',
                    target: '_blank',

                }).appendTo(detailsWrapper);
            }

            var imdbImage = $('<img>', {
                class: 'imdbImage',
                src: 'https://image.tmdb.org/t/p/w500' + finalImg
            }).appendTo(imdbLink);

            var descriptionWrapper = $('<div>', {
                class: 'descriptionWrapper',
            }).appendTo(detailsWrapper);

            var description = $('<p>', {
                class: 'objectDescription',
                text: data.overview,
            }).appendTo(descriptionWrapper);


            var objectDetails = $('<div>', {
                class: 'objectDetails',
            }).appendTo(detailsWrapper);

            if (kind == 1) {
                var revenue = $('<p>', {
                    class: 'movieRevenue',
                    text: 'Revenue: ' + ' $ ' + withCommas,
                }).appendTo(objectDetails);
                var hoursRuntime = convertMinsToHrsMins(data.runtime);

                var runtime = $('<p>', {
                    class: 'movieRuntime',
                    text: 'Runtime: ' + hoursRuntime,
                }).appendTo(objectDetails);

            } else {
                var seasonsNum = $('<p>', {
                    class: 'seasonsNum',
                    text: 'Seasons: ' + data.number_of_seasons,
                }).appendTo(objectDetails);

                var episodesNum = $('<p>', {
                    class: 'episodesNum',
                    text: 'Episode: ' + data.number_of_episodes,
                }).appendTo(objectDetails);
            }

            var releaseDate = $('<p>', {
                class: 'releaseDate',
                text: 'Release Date: ' + monthName + ' ' + dayName + ' ' + year,
            }).appendTo(objectDetails);

            var objectGenreWrapper = $('<div>', {
                class: 'objectGenreWrapper',
            }).appendTo(objectDetails);

            var objectGenreHead = $('<span>', {
                class: 'objectGenreHead',
                text: 'Genres: ',
            }).appendTo(objectGenreWrapper);

            for (var i = 0; i < data.genres.length; i++) {
                arr.push(data.genres[i].name);
                arr.join(' , ');
            }

            var objectGenre = $('<span>', {
                class: 'objectGenre',
                text: arr,
            }).appendTo(objectGenreWrapper);

            var castWrapper = $('<div>', {
                class: 'castWrapper',
            }).appendTo($('.chosenMovie'));

            var cast = $('<div>', {
                class: 'cast'

            }).appendTo(castWrapper)

            var objectGallery = $('<div>', {
                class: 'objectGallery',
            }).appendTo($('.chosenMovie'));

            var objectVideos = $('<div>', {
                class: 'objectVideos',

            }).appendTo($('.chosenMovie'));

            $('.objectGenre').html($('.objectGenre').html().split(',').join(', '));

        },
        error: function (err) {
            //console.log(err);
        }
    })
}

function tvShowClicked(tvShowId, div, path) {

    $('.container').addClass('singleMovieContainer');
    $('.inputError').fadeOut(200);
    $('.noMovieError').fadeOut(500);

    $('.container').css('margin-top', '3rem');

    $('.spinner').fadeIn('fast');
    $('.spinnerWrapper').fadeIn('fast');
    $('.bottomSection').css('display', 'none');
    $('.tmdbCertWrapper').css('display', 'none');

    div.css('display', 'none');
    div.removeClass('playingNowWrapper');
    div.removeClass('tvShowWrapper');
    
    $('.playingNowHeader').hide();
    $('.playingNowWrapper').remove();
    $('.tvShowsHeader').hide();

    div.addClass('chosenMovie');

    $('.movieWrapper').remove();
    $('.tvShowWrapper').remove();

    $('.movieImg').remove();
    $('.tvShowImg').remove();

    var width = 1;
    var id2 = setInterval(frame, 30);
    function frame() {

        width++;
        if (width >= 100) {
            clearInterval(id2);
            $('.bottomSection').css('display', 'block');
            $('.tmdbCertWrapper').css('display', 'flex');
            $('.tvShowWrapper').css('display', 'flex');
            div.fadeIn('slow');
            width = 1;
        }
    }

    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(getObjectInfo(tvShowId, 2));
        }, 250);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getTvShowImdbId(tvShowId);
        }, 550);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getCredits(tvShowId, 2);
        }, 1000);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getImages(tvShowId, 2);
        }, 1200);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getVideos(tvShowId, 2)
        }, 1200);
    })

    $('.chosenMovie').off();
    $('.actorImg').off();

    setTimeout(function () {
        for (var j = 0; j < $('.movieGalleryImg').length ; j++) {
            tmp = $($('.movieGalleryImg')[j].attributes.src)[0].textContent;
            $($('.movieGalleryImg')[j]).attr('src', 'asd');
            $($('.movieGalleryImg')[j]).attr('src', tmp);
        }

        for (var k = 0; k < $('.actorImg').length ; k++) {
            tmp2 = $($('.actorImg')[k].attributes.src)[0].textContent;
            $($('.actorImg')[k]).attr('src', 'asd');
            $($('.actorImg')[k]).attr('src', tmp2);
        }
        $('.spinnerWrapper').css('display', 'none');
        $('.spinner').css('display', 'none');
    }, 4000)
}

function getTvShowImdbId(tvShowId) {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tvShowInfoUrl + tvShowId + "/external_ids" + "?api_key=" + tmdbKey + "&language=en-US",
        dataType: "jsonp",
        ifModified: true,

        success: function (data) {
            
            $('.imdbLink').attr('href', 'https://www.imdb.com/title/' + data.imdb_id);
            $('.imdbLink').attr('target', '_blank');
        },
        error: function (err) {
            //console.log(err);
        }
    })
}

function movieClicked(movieId, div, path) {

    $('.container').addClass('singleMovieContainer');
    $('.inputError').fadeOut(200);
    $('.noMovieError').fadeOut(500);

    $('.container').css('margin-top', '3rem');

    $('.spinner').fadeIn('fast');
    $('.spinnerWrapper').fadeIn('fast');
    $('.bottomSection').css('display', 'none');
    $('.tmdbCertWrapper').css('display', 'none');

    div.css('display', 'none');
    div.removeClass('playingNowWrapper');
    div.removeClass('movieWrapper');

    $('.playingNowHeader').hide();
    $('.playingNowWrapper').remove();

    div.addClass('chosenMovie');

    $('.movieWrapper').remove();
    $('.tvShowWrapper').remove();
    $('.movieImg').remove();
    $('.tvShowsHeader').hide();

    var width = 1;
    var id2 = setInterval(frame, 30);
    
    function frame() {
        width++;
        if (width >= 100) {
            clearInterval(id2);
            $('.bottomSection').css('display', 'block');
            $('.tmdbCertWrapper').css('display', 'flex');
            $('.movieWrapper').css('display', 'flex');

            div.fadeIn('slow');

            width = 1;
        }
    }

    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(getObjectInfo(movieId, 1));
        }, 250);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getCredits(movieId, 1);
        }, 550);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getImages(movieId, 1);
        }, 1000);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getVideos(movieId, 1);
        }, 1200);
    })
   
    $('.chosenMovie').off();
    $('.actorImg').off();

    setTimeout(function () {
        for (var j = 0; j < $('.movieGalleryImg').length ; j++) {
            tmp = $($('.movieGalleryImg')[j].attributes.src)[0].textContent;
            $($('.movieGalleryImg')[j]).attr('src', 'asd');
            $($('.movieGalleryImg')[j]).attr('src', tmp);
        }

        for (var k = 0; k < $('.actorImg').length ; k++) {
            tmp2 = $($('.actorImg')[k].attributes.src)[0].textContent;
            $($('.actorImg')[k]).attr('src', 'asd');
            $($('.actorImg')[k]).attr('src', tmp2);
        }
        $('.spinnerWrapper').css('display', 'none');
        $('.spinner').css('display', 'none');
    }, 4000)
}

function goToActorImdb(imdbActorId, that) {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieActorsUrl + imdbActorId + "?api_key=" + tmdbKey + "&language=en-US",
        dataType: "jsonp",
        ifModified: true,

        success: function (data) {

            that.attr('href', 'https://www.imdb.com/name/' + data.imdb_id);
            that.attr('target', '_blank');

            var actorImgLink = $(that).parent().find($('.imdbLink'))

            actorImgLink.trigger("click");
            actorImgLink.off();
        },
        error: function (err) {
            //console.log(err);
        }
    })
}

function goToMovieImdb(imdbActorId, that) {

    $('.actorCreditsWrapper').remove();

    var actorCreditsWrapper = $('<div>', {
        class: 'actorCreditsWrapper'

    }).appendTo('.container')

    var actorCredits = $('<div>', {
        class: 'actorCredits'

    }).appendTo(actorCreditsWrapper)

    var closeWrapper = $('<div>', {
        class: 'closeWrapper',
        src: './images/closeBtn.png',
        click: function () {
            $('.actorCreditsWrapper').remove();
        }
    }).appendTo(actorCreditsWrapper)

    var closeBtn = $('<img>', {
        class: 'closeBtn',
        src: './images/closeBtn.png',
        click: function () {
            $('.actorCreditsWrapper').remove();
        }
    }).appendTo(closeWrapper)


    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieActorsUrl + imdbActorId + "/combined_credits?api_key=" + tmdbKey + "&language=en-US",
        dataType: "jsonp",
        ifModified: true,

        success: function (data) {
            for (var i = 0; i < data.cast.length; i++) {

                var path = data.cast[i].poster_path;
                var titleName = data.cast[i].title;

                if (titleName == 'undefined' || titleName == null) {
                    titleName = data.cast[i].name;
                } else {
                    titleName = data.cast[i].title;
                }

                if (path == 'undefined' || path == null) {
                    path = './images/stock.png';
                } else {
                    path = 'https://image.tmdb.org/t/p/w500/' + data.cast[i].poster_path;
                }

                var actorMovie = $('<div>', {
                    class: 'actorMovie',
                }).appendTo(actorCredits);


                var actorMovieImageLink = $('<a>', {
                    class: 'imageLink',

                }).appendTo(actorMovie);

                var actorMovieImg = $('<img>', {
                    class: 'actorMovieImg',
                    src: path,
                    id: data.cast[i].id,
                    click: function () {
                        getActorMovieInfo($(this)[0].attributes.id.textContent, $($(this)[0].parentElement));
                    }
                }).appendTo(actorMovieImageLink);

                var actorMovieTitle = $('<span>', {
                    class: 'actorMovieTitle',
                    text: titleName + ': '
                }).appendTo(actorMovie)

                var actorCharacterName = $('<span>', {
                    class: 'actorCharacterName',
                    text: data.cast[i].character
                }).appendTo(actorMovie);

                //var characterName = $('<span>', {
                //    class: 'characterName',
                //    text: data.cast[i].character
                //}).appendTo(characterWrapper);



            }


        },
        error: function (err) {
            //console.log(err);
        }
    })
}

function getActorMovieInfo(objectId, that) {


    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieInfoUrl + objectId + "?api_key=" + tmdbKey + "",
        dataType: "jsonp",
        ifModified: true,
        success: function (data) {

            that.attr('href', 'https://www.imdb.com/title/' + data.imdb_id);
            that.attr('target', '_blank');

            var actorMovieImg = $(that).find($('.actorMovieImg'));
            actorMovieImg.trigger("click");
            actorMovieImg.off();

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
