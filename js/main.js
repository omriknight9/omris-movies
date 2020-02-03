var movieId;
var tvShowId;
var imdbId;
var wrapper;
var total_results;
var title;
var valid;
var onInputResults;
var topTen;
var rest;
var playingNow;
var players = [];
var monthName;
var dayName;
var date;
var arr = [];
var movieImage;
var tvShowImage;
var objectImage;
var tmp;
var tmp2;
var page;
var script;
var clickCounter = 0;

var tmdbKey = '0271448f9ff674b76c353775fa9e6a82';

var imdb = 'https://www.imdb.com/title/';
//var baseUrl = "https://sg.media-imdb.com/suggests/";
var baseUrl = "https://v2.sg.media-imdb.com/suggests/";
var youtubeVideo = 'https://www.youtube.com/embed/';

var nowPlayingUrl = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + tmdbKey + "&language=en-US&page=1";
var searchMovieUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + tmdbKey + "&query=";
var searchMorePagesUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + tmdbKey + "&page=";
var movieInfoUrl = "https://api.themoviedb.org/3/movie/";
var movieActorsUrl = "https://api.themoviedb.org/3/person/";
var searchTvShowUrl = "https://api.themoviedb.org/3/search/tv?api_key=" + tmdbKey + "&query=";
var searchMoreTvShowsUrl = "https://api.themoviedb.org/3/search/tv?api_key=" + tmdbKey + "&page=";
var tvShowInfoUrl = "https://api.themoviedb.org/3/tv/";

$(document).ready(function () {

    let valToSend;
    let nameToSend;
    let fromMovieSite = false;

    if (window.location.href.indexOf("value=") > -1) {
        valToSend = window.location.href.split('value=')[1].split('&')[0];
    }

    if (window.location.href.indexOf("title=") > -1) {
        nameToSend = window.location.href.split('title=')[1].split('&')[0];
        fromMovieSite = true;
        movieFromOtherSiteClicked(valToSend, nameToSend.toString());
    }

    page = 0;

    var x = location.href;

    if (!fromMovieSite) {
        if (x.includes('?')) {
            location.href = x.split("?")[0];
        }
    }

    window.onscroll = function () {
        myFunction();
        scrollBtn();
    };

    $('.Xbtn').click(function () {
        $(this).parent().parent().hide();
    })

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
            var queryUrl = baseUrl + cleanInput[0].toLowerCase() + "/" + cleanInput.toLowerCase() + ".json";

            var ajax2 = $.ajax({
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
                            var resultRow = document.createElement('div');
                            resultRow.setAttribute('class', 'resultRow');
                            var destinationUrl;

                            destinationUrl = "http://www.imdb.com/title/" + result.d[i].id;

                            resultRow.setAttribute('href', destinationUrl);
                            resultRow.setAttribute('target', '_blank');
                            resultRow.setAttribute('rel', 'noopener');

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
                }
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
                            movieClicked($(this)[0].attributes.value.textContent, $(this));
                        },

                    }).appendTo($('.container'));

                    var movieTitle = $('<p>', {
                        class: 'movieTitle',
                        text: title
                    }).appendTo(wrapper)

                    var img = $('<img>', {
                        class: 'movieImg',
                        alt: 'movieImg',
                        src: tmdbPathPosterPath
                    }).appendTo(wrapper);

                } catch (e) {
                    //console.log(e);
                }
            }
        },
        error: function (err) {
            //console.log(err);
        }
    })
}

function onYouTubeIframeAPIReady() {

    var predefined_players = document.getElementsByClassName("objectVideos")[0].getElementsByTagName('iframe');
    for (var i = 0; i < predefined_players.length; i++) {
        predefined_players[i].id = "movieVideo" + i;
        players[i] = new YT.Player("movieVideo" + i, {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }
}

function onPlayerReady() { }

function onPlayerStateChange(event) {
    var link = event.target.a.id;
    var newstate = event.data;
    if (newstate == YT.PlayerState.PLAYING) {
        players.forEach(function (item, i) {
            if (item.a.id != link) item.pauseVideo();
        });
    }
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
        $('body').css('pointer-events', 'none');
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
                                movieClicked($(this)[0].attributes.value.textContent, $(this));
                            },

                        }).appendTo($('.container'));

                        wrapper.css('display', 'none');

                        var movieTitle = $('<p>', {
                            class: 'movieTitle',
                            text: title
                        }).appendTo(wrapper)

                        var img = $('<img>', {
                            class: 'movieImg',
                            src: tmdbPathPosterPath,
                            alt: 'movieImg',
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
                                    movieClicked($(this)[0].attributes.value.textContent, $(this));
                                },
                            }).appendTo($('.container'));

                            wrapper.css('display', 'none');

                            var movieTitle = $('<p>', {
                                class: 'movieTitle',
                                text: title
                            }).appendTo(wrapper)

                            var img = $('<img>', {
                                class: 'movieImg',
                                src: tmdbPathPosterPath,
                                alt: 'movieImg',
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
            $('body').css('pointer-events', 'all');
            $('.spinnerWrapper').css('display', 'none');
            $('.spinner').css('display', 'none');
        }, 3500)
    }
}

function searchTVShows(value) {

    $('.inputError').fadeOut(200);
    $('.noMovieError').fadeOut(500);
    var regex = /[^A-Za-z0-9]+/g;

    valid = true;

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
                $('.tvShowWrapper').css('display', 'block');
                $('.tvShowWrapper').css('display', 'flex');
                width = 1;
            }
        }

        $('.chosenMovie').remove();
        $('.tvShowWrapper').remove();
        $('.tvShowsHeader').remove();
        var val = inputValClean;
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
                            src: tmdbPathPosterPath,
                            alt: 'tvShowImg',
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
                                src: tmdbPathPosterPath,
                                alt: 'tvShowImg',
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

                    if (data.cast[i].character.length > 33) {
                        var maxLength = 33;
                        var trimmedString = data.cast[i].character.substr(0, maxLength);
                        trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));

                        if (trimmedString.slice(-1) == "/") {
                            trimmedString = trimmedString.replace(trimmedString.slice(-1), '');
                        } else {
                            trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
                            if (trimmedString.slice(-1) == "/") {
                                trimmedString = trimmedString.replace(trimmedString.slice(-1), '');
                            }
                        }

                    } else {
                        trimmedString = data.cast[i].character;
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
                        alt: 'actorImg',
                        id: data.cast[i].id,
                        click: function () {
                            var actorNameCredits = $(this).parent().parent().find($('.actorName')).html().replace(':', '');
                            goToMovieImdb($(this)[0].attributes.id.textContent, $($(this)[0].parentElement), actorNameCredits);
                        }
                    }).appendTo(imageLink);

                    var actorName = $('<span>', {
                        class: 'actorName',
                        text: data.cast[i].name + ':'
                    }).appendTo(castName);

                    var characterName = $('<span>', {
                        class: 'characterName',
                        text: trimmedString
                    }).appendTo(castName);


                    var linksWrapper = $('<div>', {
                        class: 'linksWrapper',
                    }).appendTo(castName);

                    var imdbLinkWrapper = $('<a>', {
                        class: 'imdbLinkWrapper',

                    }).appendTo(linksWrapper);

                    var imdbLink = $('<img>', {
                        src: './images/imdb.png',
                        alt: 'imdbImg',
                        class: 'imdbLink',
                        id: data.cast[i].id,
                        click: function () {
                            goToActorImdb($(this)[0].attributes.id.textContent, $($(this)[0].parentElement), 1);
                        }
                    }).appendTo(imdbLinkWrapper);

                    var instagramWrapper = $('<a>', {
                        class: 'instagramWrapper',
                    }).appendTo(linksWrapper);

                    var instagramLink = $('<img>', {
                        src: './images/instagram.png',
                        alt: 'instagramImg',
                        class: 'instagramLink',
                        id: data.cast[i].id,
                        click: function () {
                            goToActorImdb($(this)[0].attributes.id.textContent, $($(this)[0].parentElement), 2);
                        }
                    }).appendTo(instagramWrapper);

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
                        alt: 'movieGalleryImg',
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
        url: tmdbUrl + objectId + "/videos?api_key=" + tmdbKey,
        dataType: "jsonp",
        ifModified: true,
        success: function (data) {

            for (var i = 0; i < 5; i++) {
                if (data.results[i] == undefined || data.results[i] == null) {
                    return;
                }

                var objectUrl = youtubeVideo + data.results[i].key + '?showinfo=0&enablejsapi=1';
                var movieVideo = $('<iframe>', {
                    class: 'movieVideo',
                    id: 'movieVideo' + i,
                    src: objectUrl,
                    width: '420',
                    height: '315',
                    allowfullscreen: true,

                }).appendTo($('.objectVideos'));
            }

        },
        error: function (err) {
            //console.log(err);
        }
    })
}

function getObjectInfo(objectId, kind, titleToSend) {

    var inputVal2;
    var url;
    var tmdbUrl;
    let titleFinal; 
    if (titleToSend == undefined) {
        titleFinal = $('.movieTitle').html();
    } else {
        titleFinal = titleToSend;
    }

    if (kind == 1) {
        inputVal2 = titleFinal;
        tmdbUrl = movieInfoUrl;
    } else {
        inputVal2 = $('.tvShowTitle').html();
        tmdbUrl = tvShowInfoUrl;
        objectKind = 2;
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

            if (script !== undefined && script !== null) {
                $(script).remove();
            }

            setTimeout(function () {
                script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://www.youtube.com/iframe_api';
                $(script).addClass('youtubeScript');
                document.getElementsByTagName('head')[0].appendChild(script);
            }, 1300);

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
                    rel: 'noopener',
                    href: imdb + imdbId
                }).appendTo(detailsWrapper);
                var withCommas = numberWithCommas(data.revenue);
            } else {
                var imdbLink = $('<a>', {
                    class: 'imdbLink',
                    target: '_blank',
                    rel: 'noopener',
                }).appendTo(detailsWrapper);
            }

            var imdbImage = $('<img>', {
                class: 'imdbImage',
                src: 'https://image.tmdb.org/t/p/w500' + finalImg,
                alt: 'imdbImage',
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

            var castHeader = $('<h2>', {
                class: 'castHeader',
                text: 'Cast',
            }).insertAfter(objectDetails);

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
            }).appendTo(castWrapper);

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

    clickCounter++;
    $('body').css('pointer-events', 'none');
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
            getTvShowImdbId(tvShowId, $('.imdbLink'));
        }, 550);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getCredits(tvShowId, 2);
        }, 1000);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getSimilar(tvShowId, 2);
        }, 1200);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getImages(tvShowId, 2);
        }, 1300);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getVideos(tvShowId, 2)
        }, 1400);
    })

    if (clickCounter > 1) {
        promise.then(function (successMessage) {
            setTimeout(function () {
                onYouTubeIframeAPIReady();
            }, 2000);
        })
    }

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
        $('body').css('pointer-events', 'all');
        $('.spinnerWrapper').css('display', 'none');
        $('.spinner').css('display', 'none');
    }, 3500)
}

function getTvShowImdbId(tvShowId, div) {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tvShowInfoUrl + tvShowId + "/external_ids" + "?api_key=" + tmdbKey + "&language=en-US",
        dataType: "jsonp",
        ifModified: true,
        success: function (data) {
            $(div).attr('href', 'https://www.imdb.com/title/' + data.imdb_id);
            $(div).attr('target', '_blank');
            $(div).attr('rel', 'noopener');
        },
        error: function (err) {
            //console.log(err);
        }
    })
}

function movieFromOtherSiteClicked(movieId, nameMovie) {

    clickCounter++;
    $('body').css('pointer-events', 'none');
    $('.container').addClass('singleMovieContainer');
    $('.inputError').fadeOut(200);
    $('.noMovieError').fadeOut(500);
    $('.container').css('margin-top', '3rem');
    $('.spinner').fadeIn('fast');
    $('.spinnerWrapper').fadeIn('fast');
    $('.bottomSection').css('display', 'none');
    $('.tmdbCertWrapper').css('display', 'none');

    $('.movieWrapper').remove();
    $('.tvShowWrapper').remove();
    $('.movieImg').remove();
    $('.tvShowsHeader').hide();

    
    setTimeout(function() {
        let div = $('<div>', {
            class: 'chosenMovie',
            'value': movieId
        }).appendTo($('.singleMovieContainer'));

        let movieFinalName = $('<p>', {
            class: 'movieTitle',
            html: nameMovie
        }).appendTo(div);

        $('.playingNowHeader').hide();
        $('.playingNowWrapper').remove();

    }, 200);

    var width = 1;
    var id2 = setInterval(frame, 30);
    
    function frame() {
        width++;
        if (width >= 100) {
            clearInterval(id2);
            $('.bottomSection').css('display', 'block');
            $('.tmdbCertWrapper').css('display', 'flex');
            $('.movieWrapper').css('display', 'flex');
            width = 1;
        }
    }

    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(getObjectInfo(movieId, 1, '1917'));
        }, 250);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getCredits(movieId, 1);
        }, 550);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getSimilar(movieId, 1);
        }, 1000);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getImages(movieId, 1);
        }, 1200);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getVideos(movieId, 1);
        }, 1300);
    })
    
    if (clickCounter > 1) {
        promise.then(function (successMessage) {
            setTimeout(function () {
                onYouTubeIframeAPIReady();
            }, 2000);
        })
    }

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
        $('body').css('pointer-events', 'all');
        $('.spinnerWrapper').css('display', 'none');
        $('.spinner').css('display', 'none');
    }, 3500)
}

function movieClicked(movieId, div) {

    clickCounter++;
    $('body').css('pointer-events', 'none');
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
            getSimilar(movieId, 1);
        }, 1000);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getImages(movieId, 1);
        }, 1200);
    })

    promise.then(function (successMessage) {
        setTimeout(function () {
            getVideos(movieId, 1);
        }, 1300);
    })
    
    if (clickCounter > 1) {
        promise.then(function (successMessage) {
            setTimeout(function () {
                onYouTubeIframeAPIReady();
            }, 2000);
        })
    }

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
        $('body').css('pointer-events', 'all');
        $('.spinnerWrapper').css('display', 'none');
        $('.spinner').css('display', 'none');
    }, 3500)
}

function goToActorImdb(imdbActorId, that, linkNum) {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieActorsUrl + imdbActorId + "/external_ids?api_key=" + tmdbKey + "&language=en-US",
        dataType: "jsonp",
        ifModified: true,

        success: function (data) {

            if (linkNum == 1) {

                if (data.imdb_id == null) {
                    $('#noImdbPop').show();
                    removePopup($('#noImdbPop'));
                } else {

                    that.attr('href', 'https://www.imdb.com/name/' + data.imdb_id);
                    that.attr('target', '_blank');
                    that.attr('rel', 'noopener');
                    var actorImdbLink = $(that).parent().find($('.imdbLink'))
                    actorImdbLink.trigger("click");
                    actorImdbLink.off();
                }

            } else {

                if (data.instagram_id == null) {
                    $('#noInstagramPop').show();
                    removePopup($('#noInstagramPop'));
                } else {
                    that.attr('href', 'https://www.instagram.com/' + data.instagram_id);
                    that.attr('target', '_blank');
                    that.attr('rel', 'noopener');
                    var actorInstagramLink = $(that).parent().find($('.instagramLink'))
                    actorInstagramLink.trigger("click");
                    actorInstagramLink.off();
                }
            }
        },
        error: function (err) {
            //console.log(err);
        }
    })
}

function goToMovieImdb(imdbActorId, that, name) {

    $('.actorCreditsWrapper').remove();

    var actorCreditsContainer = $('<div>', {
        class: 'actorCreditsContainer'
    }).insertAfter('body');

    var actorCreditsWrapper = $('<div>', {
        class: 'actorCreditsWrapper'
    }).appendTo(actorCreditsContainer)

    var actorCredits = $('<div>', {
        class: 'actorCredits'
    }).appendTo(actorCreditsWrapper)

    var closeWrapper = $('<div>', {
        class: 'closeWrapper',
        src: './images/closeBtn.png',
    }).appendTo(actorCreditsWrapper)

    var closeBtn = $('<img>', {
        class: 'closeBtn',
        src: './images/closeBtn.png',
        alt: 'closeBtn',
        click: function () {
            $('.actorCreditsWrapper').remove();
            $('body').css({'opacity': '1', 'pointer-events': 'all'});
        }
    }).appendTo(closeWrapper)

    var actorCreditsName = $('<p>', {
        class: 'actorCreditsName',
        text: name + "'s Credits"
    }).appendTo(closeWrapper)

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieActorsUrl + imdbActorId + "/combined_credits?api_key=" + tmdbKey + "&language=en-US",
        dataType: "jsonp",
        ifModified: true,

        success: function (data) {

            var array = [];

            for (var i = 0; i < data.cast.length; i++) {

                if (!data.cast[i].release_date || data.cast[i].release_date !== null || data.cast[i].release_date !== 'undefined' || data.cast[i].release_date !== '') {
                    array.push(data.cast[i]);
                }

                function compare(a, b) {
                    if (a.release_date > b.release_date) {
                        return -1;
                    }
                    if (a.release_date < b.release_date) {
                        return 1;
                    }
                    return 0;
                }
                array.sort(compare);
            }

            for (var j = 0; j < array.length; j++) {

                var charachter;

                if (array[j].character == null || array[j].character == 'undefined', array[j].character == '') {

                    charachter = 'Unknown';
                } else {
                    charachter = array[j].character;
                }

                var path = array[j].poster_path;
                var titleName = array[j].title;
                
                if (titleName == 'undefined' || titleName == null) {
                    titleName = array[j].name;
                } else {
                    titleName = array[j].title;
                }

                if (path == 'undefined' || path == null) {
                    path = './images/stock.png';
                } else {
                    path = 'https://image.tmdb.org/t/p/w500/' + array[j].poster_path;
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
                    alt: 'actorMovieImg',
                    id: array[j].id,
                    mediaType: array[j].media_type,
                    click: function () {
                        var type = $(this)[0].attributes.mediaType.textContent;
                        if (type == 'movie') {
                            getActorMovieInfo($(this)[0].attributes.id.textContent, $($(this)[0].parentElement), 1);
                        } else {
                            getActorMovieInfo($(this)[0].attributes.id.textContent, $($(this)[0].parentElement), 2);
                        }
                    }
                }).appendTo(actorMovieImageLink);

                var actorMovieTitle = $('<span>', {
                    class: 'actorMovieTitle',
                    text: titleName + ': '
                }).appendTo(actorMovie)

                var actorCharacterName = $('<span>', {
                    class: 'actorCharacterName',
                    text: charachter
                }).appendTo(actorMovie);
            }

            $('.actorCreditsContainer').fadeIn('fast');
            $('body').css({'opacity': '.3', 'pointer-events': 'none'});
            $('html, body').animate({ scrollTop: $('.actorCreditsContainer').position().top - 150 }, 'slow');
        },
        error: function (err) {
            //console.log(err);
        }
    })
}

function getSimilar(objectId, kind) {

    var tmdbUrl;
    var similarHeader;
    var movieTitle;

    if (kind == 1) {
        tmdbUrl = movieInfoUrl;
        similarHeader = 'Similar Movies';
    } else {
        tmdbUrl = tvShowInfoUrl;
        similarHeader = 'Similar TV Shows';
    }

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tmdbUrl + objectId + "/similar?api_key=" + tmdbKey + "",
        dataType: "jsonp",
        ifModified: true,
        success: function (data) {

            var similarMoviesHeader = $('<h2>', {
                text: similarHeader,
                class: 'similarMoviesHeader'
            }).insertAfter($('.castWrapper'));

            var similarMoviesWrapper = $('<div>', {
                class: 'similarMoviesWrapper',
            }).insertAfter(similarMoviesHeader);

            var similarMovies = $('<div>', {
                class: 'similarMovies'
            }).appendTo(similarMoviesWrapper);

            if (data.results.length == 0) {
                $('.similarMoviesHeader').remove();
                $('.similarMoviesWrapper').remove();
                return;
            }

            for (var i = 0; i < data.results.length; i++) {
                if (kind == 1) {
                    movieTitle = data.results[i].title;
                } else {
                    movieTitle = data.results[i].name;
                }

                try {
                    var img = 'https://image.tmdb.org/t/p/w500' + data.results[i].poster_path;

                    if (data.results[i].poster_path == 'undefined' || data.results[i].poster_path == null || data.results[i].poster_path == '') {

                        img = './images/stock.png';
                    }

                    var similarMovie = $('<div>', {
                        class: 'similarMovie',
                    }).appendTo($('.similarMovies'));

                    var imageLink = $('<a>', {
                        class: 'imageLink',
                    }).appendTo(similarMovie);

                    var similarMovieImg = $('<img>', {
                        class: 'similarMovieImg',
                        src: img,
                        alt: 'similarMovieImg',
                        id: data.results[i].id,
                        click: function () {
                            getActorMovieInfo($(this)[0].attributes.id.textContent, $($(this)[0].parentElement), kind);
                        }
                    }).appendTo(imageLink);

                    var similarMovieName = $('<span>', {
                        class: 'similarMovieName',
                        text: movieTitle
                    }).appendTo(similarMovie);

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

function getActorMovieInfo(objectId, that, kind) {

    var tmdbUrl;

    if (kind == 1) {
        tmdbUrl = movieInfoUrl;
    } else {
        tmdbUrl = tvShowInfoUrl;
    }

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tmdbUrl + objectId + "?api_key=" + tmdbKey + "",
        dataType: "jsonp",
        ifModified: true,
        success: function (data) {
            if (data.imdb_id == undefined || data.imdb_id == null) {

                getTvShowImdbId(objectId, $(that));

                if ($('.actorMovieImg').is(':visible')) {
                    var actorMovieImg = $(that).find($('.actorMovieImg'));
                    actorMovieImg.trigger("click");
                    actorMovieImg.off();
                } else {
                    var similarMovieImg = $(that).find($('.similarMovieImg'));
                    similarMovieImg.trigger("click");
                    similarMovieImg.off();
                }

            } else {
                that.attr('href', 'https://www.imdb.com/title/' + data.imdb_id);
                that.attr('target', '_blank');
                that.attr('rel', 'noopener');

                if ($('.actorMovieImg').is(':visible')) {
                    var actorMovieImg = $(that).find($('.actorMovieImg'));
                    actorMovieImg.trigger("click");
                    actorMovieImg.off();
                } else {
                    var similarMovieImg = $(that).find($('.similarMovieImg'));
                    similarMovieImg.trigger("click");
                    similarMovieImg.off();
                }
            }

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

function removePopup(container) {

    $(document).mouseup(function (e) {
        if (container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
            e.stopPropagation();
            $(document).off('mouseup');
        }
    })
}

function closeCurrentPopup(that) {
    $($(that)[0].parentElement.parentElement.parentElement).hide();
}
