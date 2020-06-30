let movieId;
let tvShowId;
let imdbId;
let wrapper;
let total_results;
let title;
let valid;
let onInputResults;
let topTen;
let rest;
let playingNow;
let players = [];
let monthName;
let dayName;
let date;
let arr = [];
let movieImage;
let objectImage;
let page;
let script;

let counter = 1;

let upcoming;
let upcoming_topTen;

const tmdbKey = '0271448f9ff674b76c353775fa9e6a82';

let imdb = 'https://www.imdb.com/title/';
const baseUrl = "https://v2.sg.media-imdb.com/suggests/";
const youtubeVideo = 'https://www.youtube.com/embed/';
const upcomingUrl = "https://api.themoviedb.org/3/movie/upcoming?api_key=" + tmdbKey + "&language=en-US&page=";
const nowPlayingUrl = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + tmdbKey + "&language=en-US&page=1";
const searchMovieUrl = "https://api.themoviedb.org/3/search/multi?api_key=" + tmdbKey + "&query=";
const searchMorePagesUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + tmdbKey + "&page=";
const movieInfoUrl = "https://api.themoviedb.org/3/movie/";
const movieActorsUrl = "https://api.themoviedb.org/3/person/";
const searchTvShowUrl = "https://api.themoviedb.org/3/search/tv?api_key=" + tmdbKey + "&query=";
const searchMoreTvShowsUrl = "https://api.themoviedb.org/3/search/tv?api_key=" + tmdbKey + "&page=";
const tvShowInfoUrl = "https://api.themoviedb.org/3/tv/";

$(document).ready(function () {

    let valToSend;
    let nameToSend;
    let fromMovieSite = false;

    if (window.location.href.indexOf("value=") > -1) {
        valToSend = window.location.href.split('value=')[1].split('&')[0];
    }

    if (window.location.href.indexOf("title=") > -1) {
        nameToSend = window.location.href.split('title=')[1].split('&')[0];
        nameToSend = nameToSend.split('%20').join(' ');
        fromMovieSite = true;
        fromOtherSite(valToSend, nameToSend.toString(), 1);
        $('html').css('overflow-y', 'unset');  
    } else {
        getPlayingNow();
        $('html').css('overflow-y', 'unset');  
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
    });

    showResults();
})

function switchContent(type) {
    $('.chosenMovieSection').empty();
    $('#chosenMovieTitle').remove();
    $('.container, #switchContentBtnWrapper, .bottomSection').hide();
    $('.spinner').fadeIn('fast');
    $('body').css('pointer-events', 'none');
    // $('.spinnerWrapper').css({'position': 'unset', 'margin-top': '2rem', 'margin-bottom': '2rem'});
    $('body').css('opacity', '.5');

    if (type == 1) {
        getUpcoming();
        $('#switchContentBtn').attr('onclick', 'switchContent(2)');
        $('#switchContentBtn').html('Show Playing Now');
        $('#switchContentBtn').css('width', '8rem');
        setTimeout(function() {
            $('.spinner').hide();
            $('body').css('pointer-events', 'all');
            $('.container, #switchContentBtnWrapper').show();
            $('body').css('opacity', '1');
            $('.bottomSection').show();
        }, 1000);
    } else {
        getPlayingNow();
        $('#switchContentBtn').attr('onclick', 'switchContent(1)');
        $('#switchContentBtn').html('Show Upcoming');
        $('#switchContentBtn').css('width', '7rem');
        setTimeout(function() {
            $('.spinner').hide();
            $('body').css('pointer-events', 'all');
            $('.container, #switchContentBtnWrapper').show();
            $('body').css('opacity', '1');
            $('.bottomSection').show();
        }, 1000);
    }
}

function getUpcomingMovies(type, times) {

    $('.playingNowWrapper').remove();

    let finalUrl;

    if (type == 1) {
        finalUrl = upcomingUrl;
    } else {
        finalUrl = upcomingUrl + times; 
    }

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: finalUrl,
        dataType: "jsonp",
        ifModified: true,
        success: function (data) {

            let param = data.results;

            let today = new Date();

            if (type == 1) {
                $('.btnWrapperPlayingNow').remove();

                let btnWrapper = $('<div>', {
                    class: 'btnWrapper btnWrapperUpcoming'
                }).appendTo('#switchContentBtnWrapper');

                $('#currentHeader').html('Upcoming Movies');
    
                let dateSortBtn = $('<button>', {
                    class: 'dateSortBtn',
                    text: 'Sort By Date',
                    click: function() {
                        sortMovies('releaseDate', 1, 2);
                    }
                }).appendTo(btnWrapper);
    
                let titleSortBtn = $('<button>', {
                    class: 'titleSortBtn',
                    text: 'Sort By Name',
                    click: function() {
                        sortMovies('movieTitle', 2, 2);
                    }
                }).appendTo(btnWrapper);
            }

            for (let i = 0; i < param.length; i++) {

                let finalDate;

                if (param[i].release_date == '') {
                    finalDate = 'No Release Date';
                } else {
                    let readDate = new Date(param[i].release_date);
                    let finalMonth = readDate.getMonth() + 1;
                    let finalDay = readDate.getDate();
        
                    changeMonthName(finalMonth - 1, 2);
                    changeDayName(finalDay);

                    finalDate = monthName + ' ' + dayName + ' ' + readDate.getFullYear(); 
                }

                let movieDateTopTen = new Date(JSON.stringify(param[i].release_date));

                if (movieDateTopTen > today) {
                    try {
    
                        let path = param[i].poster_path;
                        title = param[i].title;
                        movieId = param[i].id;
                        movieImage = param[i].backdrop_path;
    
                        let tmdbPathPosterPath = 'https://image.tmdb.org/t/p/w500' + path;
                        let tmbdBackdropPath = 'https://image.tmdb.org/t/p/w500' + movieImage;
    
                        if (path == 'undefined' || path == null) {
                            tmdbPathPosterPath = './images/stock.webp';
                        }
    
                        wrapper = $('<div>', {
                            class: 'upcomingMovieWrapper',
                            value: movieId,
                            backdropSrc: tmbdBackdropPath,
                            releaseDate: param[i].release_date,
                            movieTitle: title,
                            click: function () {
                                objectClicked($(this).attr('value'), $(this).attr('movieTitle'), 1);
                            },
    
                        }).appendTo($('.container'));
    
                        let finalName;

                        if (title.length > 40) {
                            finalName = title.substring(40, 0) + '...';
                            $(wrapper).addClass('longNameWrapper');
                        } else {
                            finalName = title;
                        }

                        var movieTitle = $('<p>', {
                            class: 'movieTitle',
                            text: finalName
                        }).appendTo(wrapper);

                        if ($(wrapper).hasClass('longNameWrapper')) {
                            $(movieTitle).addClass('longName');
                
                            let movieFullNameWrapper = $('<div>', {
                                class: 'movieFullNameWrapper',
                            }).appendTo(wrapper);
                
                            let movieFullName = $('<p>', {
                                class: 'movieFullName',
                                text: title
                            }).appendTo(movieFullNameWrapper);
                
                            if ($(window).width() > 765) {
                                $('.longName').hover(
                                    function() {
                                        $(this).css('opacity', '.5');
                                        $(this).parent().find('.movieFullNameWrapper').fadeIn();
                                    }
                                );
                
                                $(wrapper).hover(
                                    function() {
                
                                    }, function() {
                                        $(this).find($('.longName')).css('opacity', '1');
                                        $(this).find('.movieFullNameWrapper').fadeOut();
                                    }
                                );
                            }   
                        }  

                        let imgDateWrapper = $('<p>', {
                            class: 'imgDateWrapper',
                        }).appendTo(wrapper);

                        let movieDate = $('<p>', {
                            class: 'movieDate',
                            text: finalDate
                        }).appendTo(imgDateWrapper);
    
                        let img = $('<img>', {
                            class: 'movieImg',
                            src: tmdbPathPosterPath,
                            alt: 'movieImg',
                        }).appendTo(imgDateWrapper);
                    }
                    catch(e) {
                        return;
                    } 
                }
            }
        },
        error: function (err) {
            //console.log(err);
        }
    })
}

async function getUpcoming() {

    var promise = new Promise(function (resolve, reject) {
        resolve(getUpcomingMovies(1, 0));
    });
    
    var promise2 = new Promise(function (resolve, reject) {
        getUpcomingMovies(2, 2);
    });

    var promise3 = new Promise(function (resolve, reject) {
        getUpcomingMovies(2, 3);
    });

    var promise4 = new Promise(function (resolve, reject) {
        getUpcomingMovies(2, 4);
    });

    await Promise.all([promise, promise2, promise3, promise4]);
}

function showResults() {
    $(document).mouseup(function (e) {
        var container = $(".results");

        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
        }
    });

    $('#searchMovie').on('keyup', function () {
        $('.results').empty();
        var cleanInput = $('#searchMovie').val();

        if (cleanInput.length === 0) {
            $('.results').html('');
            $('.results').hide();
        }

        if (cleanInput.length > 0) {
            $('#searchMovie').css('color', 'black');

            var queryUrl = searchMovieUrl + cleanInput + '&language=en-US';

            var ajax2 = $.ajax({
                url: queryUrl,
                dataType: 'json',
                jsonp: false,
                success: function (result) {

                    if (result == 'undefind' || result == null) {
                        return;
                    }

                    if (result.length > 0) {
                        $('.results').html('');
                        $('.results').hide();
                    }

                    $('.results').show();
                    $('.results').animate({ scrollTop: 0 }, 'fast');

                    for (var i = 0; i < result.results.length; i++) {

                        if (result.results[i].media_type !== 'person') {
                            let finalTitle;

                            if (result.results[i].media_type == 'tv') {
                                finalTitle = result.results[i].name;
                            } else if (result.results[i].media_type == 'movie') {
                                finalTitle = result.results[i].title;
                            }
    
                            let finalDate;
                            let readDate;
    
                            if (result.results[i].media_type == 'tv') {
                                readDate = new Date(result.results[i].first_air_date);
                            } else if (result.results[i].media_type == 'movie') {
                                readDate = new Date(result.results[i].release_date);
                            }
    
                            let finalMonth = readDate.getMonth() + 1;
                            let finalDay = readDate.getDate();
                
                            changeMonthName(finalMonth - 1, 2);
                            changeDayName(finalDay);
        
                            finalDate = monthName + ' ' + dayName + ' ' + readDate.getFullYear(); 
    
                            let posterUrl;
    
                            if (result.results[i].poster_path == null) {
                                posterUrl = './images/noImage.webp';
                            } else {
                                posterUrl = 'https://image.tmdb.org/t/p/w500' + result.results[i].poster_path
                            }
    
                            let resultWrapper = $('<div>', {
                                class: 'resultRow',
                                popularity: result.results[i].popularity,
                                name: finalTitle,
                                id: result.results[i].id,
                                type: result.results[i].media_type,
                                click: function() {
                                    $('.chosenMovieSection').empty();
                                    $('#chosenMovieTitle').remove();
                                    $('.results').fadeOut('fast');
                                    $('#searchMovie').val('');
                                    $('.btnWrapper').hide();
                                    $('.playingNowWrapper').remove();
                                    $('.upcomingMovieWrapper').remove();
                                    
                                    if ($(this).attr('type') == 'tv') {
                                        fromOtherSite($(this).attr('id'), $(this).attr('name').toString(), 2);
                                    } else {
                                        fromOtherSite($(this).attr('id'), $(this).attr('name').toString(), 1);
                                    }
                                }
                            }).appendTo($('.results'));
    
                            let posterWrapper = $('<div>', {
                                class: 'posterWrapper'
                            }).appendTo(resultWrapper);
    
                            let poster = $('<img>', {
                                class: 'poster',
                                alt: 'poster',
                                src: posterUrl
                            }).appendTo(resultWrapper);
    
                            let movieDescription = $('<div>', {
                                class: 'description'
                            }).appendTo(resultWrapper);
    
                            let resultMovieTitle = $('<p>', {
                                class: 'resultMovieTitle',
                                text: finalTitle
                            }).appendTo(movieDescription);
    
                            if ((result.results[i].release_date !== null && result.results[i].release_date !== 'undefined' && result.results[i].release_date !== undefined &&
                            result.results[i].release_date !== '') || (result.results[i].first_air_date !== null && result.results[i].first_air_date !== 'undefined' &&
                            result.results[i].first_air_date !== undefined && result.results[i].first_air_date !== '')) {
                                let resultMovieDate = $('<p>', {
                                    class: 'resultMovieDate',
                                    text: finalDate
                                }).appendTo(movieDescription);   
                            }
                        }
                    }
                }
            })
        }

        setTimeout(function() {
            sortResults($('.results'), 'popularity');
        }, 500);
    })
}

function sortResults(container, elem1) {

    let children;
    $.each($(container), function (key, value) {

        let ids = [], obj, i, len;

        children = $(this).find('.resultRow');

        for (i = 0, len = children.length; i < len; i++) {

            obj = {};
            obj.element = children[i];
            let elem2 = $(children[i]).attr(elem1);
			obj.idNum = elem2;
            ids.push(obj);
        }

        ids.sort(function (a, b) { return (b.idNum - a.idNum); });

        for (i = 0; i < ids.length; i++) {
            $(this).append(ids[i].element);
        }
    });

    $.each($('.resultRow'), function (key, value) {
        if ($('.resultRow[id="' + $(value).attr('id') + '"]').length > 1) {
            $('.resultRow[id="' + $(value).attr('id') + '"]')[0].remove();
        }
    });
}

function getPlayingNow() {

    $('.upcomingMovieWrapper').remove();

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: nowPlayingUrl,
        dataType: "jsonp",
        ifModified: true,
        success: function (data) {

            playingNow = data.results;
            $('.btnWrapperUpcoming').remove();

            let btnWrapper = $('<div>', {
                class: 'btnWrapper btnWrapperPlayingNow'
            }).appendTo('#switchContentBtnWrapper');

            $('#currentHeader').html('Playing Now');

            let dateSortBtn = $('<button>', {
                class: 'dateSortBtn',
                text: 'Sort By Date',
                click: function() {
                    sortMovies('releaseDate', 1, 1);
                }
            }).appendTo(btnWrapper);

            let titleSortBtn = $('<button>', {
                class: 'titleSortBtn',
                text: 'Sort By Name',
                click: function() {
                    sortMovies('movieTitle', 2, 1)
                }
            }).appendTo(btnWrapper);
            
            for (var i = 0; i < data.results.length; i++) {

                try {
                    var path = playingNow[i].poster_path;

                    title = playingNow[i].title;
                    movieImage = playingNow[i].backdrop_path;
                    movieId = playingNow[i].id;
                    var tmdbPathPosterPath = 'https://image.tmdb.org/t/p/w500' + path;
                    var tmbdBackdropPath = 'https://image.tmdb.org/t/p/w500' + movieImage;

                    let finalDate;

                    if (playingNow[i].release_date == '') {
                        finalDate = 'No Release Date';
                    } else {
                        let readDate = new Date(playingNow[i].release_date);
                        let finalMonth = readDate.getMonth() + 1;
                        let finalDay = readDate.getDate();
            
                        changeMonthName(finalMonth - 1, 2);
                        changeDayName(finalDay);
    
                        finalDate = monthName + ' ' + dayName + ' ' + readDate.getFullYear(); 
                    }

                    if (path == 'undefined' || path == null) {
                        tmdbPathPosterPath = './images/stock.webp';
                    }

                    wrapper = $('<div>', {
                        class: 'playingNowWrapper',
                        value: movieId,
                        backdropSrc: tmbdBackdropPath,
                        releaseDate: playingNow[i].release_date,
                        movieTitle: title,
                        click: function () {
                            objectClicked($(this).attr('value'), $(this).attr('movieTitle'), 1);
                        },

                    }).appendTo($('.container'));

                    let finalName;

                    if (title.length > 40) {
                        finalName = title.substring(40, 0) + '...';
                        $(wrapper).addClass('longNameWrapper');
                    } else {
                        finalName = title;
                    }

                    var movieTitle = $('<p>', {
                        class: 'movieTitle',
                        text: finalName
                    }).appendTo(wrapper);

                    if ($(wrapper).hasClass('longNameWrapper')) {
                        $(movieTitle).addClass('longName');
            
                        let movieFullNameWrapper = $('<div>', {
                            class: 'movieFullNameWrapper',
                        }).appendTo(wrapper);
            
                        let movieFullName = $('<p>', {
                            class: 'movieFullName',
                            text: title
                        }).appendTo(movieFullNameWrapper);
            
                        if ($(window).width() > 765) {
                            $('.longName').hover(
                                function() {
                                    $(this).css('opacity', '.5');
                                    $(this).parent().find('.movieFullNameWrapper').fadeIn();
                                }
                            );
            
                            $(wrapper).hover(
                                function() {
            
                                }, function() {
                                    $(this).find($('.longName')).css('opacity', '1');
                                    $(this).find('.movieFullNameWrapper').fadeOut();
                                }
                            );
                        }   
                    } 

                    let imgDateWrapper = $('<p>', {
                        class: 'imgDateWrapper',
                    }).appendTo(wrapper);

                    let movieDate = $('<p>', {
                        class: 'movieDate',
                        text: finalDate
                    }).appendTo(imgDateWrapper);

                    var img = $('<img>', {
                        class: 'movieImg',
                        alt: 'movieImg',
                        src: tmdbPathPosterPath
                    }).appendTo(imgDateWrapper);

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

function sortMovies(elem1, kind, type) {

    $.each($('.container'), function (key, value) {
        let ids = [], obj, i, len;
        let children;
        if (type == 1) {
            children = $(this).find('.playingNowWrapper');
        } else {
            children = $(this).find('.upcomingMovieWrapper');
        }

        for (i = 0, len = children.length; i < len; i++) {
            obj = {};
            obj.element = children[i];
            let elem2 = $(children[i]).attr(elem1);
            switch (kind) {
                case 1:
                    obj.idNum = new Date(elem2);
                    break;
                case 2:
                    obj.idNum = elem2;
                    break;
                case 3:
                    obj.idNum = parseInt(elem2.replace(/[^\d]/g, ""), 10);
                    break;
            }
            ids.push(obj);
        }

        switch (kind) {
            case 1:
                switch (counter) {
                    case 1:
                        ids.sort(function (a, b) { return (b.idNum - a.idNum); });
                        counter = 2;
                        break;
                    case 2:
                        ids.sort(function (a, b) { return (a.idNum - b.idNum); });
                        counter = 1;
                        break;
                }
                break;
            case 2:
                switch (counter) {
                    case 1:
                        ids.sort(function (a, b) {
                            return a.idNum.localeCompare(b.idNum);
                        });

                        counter = 2;
                        break;

                    case 2:
                        ids.sort(function (a, b) {
                            return b.idNum.localeCompare(a.idNum);
                        });
                        counter = 1;
                        break;
                }
                $('.btnWrapper').attr('kind', kind);
                $('.groupSortBtn').css('pointer-events', 'all');
                break;
        }

        for (i = 0; i < ids.length; i++) {
            $(this).append(ids[i].element);
        }
    });

    $('.sortContainer').fadeOut('fast');
}

function goHome() {
    if (page !== 0) {
        $('#switchContentBtn').show();
        $('.chosenMovieSection').empty();
        $('#chosenMovieTitle').remove();
        $('.chosenMovie').hide();
        $('.container').removeClass('singleMovieContainer');
        $('#searchMovie').val('');
        $('.logo').css('cursor', 'auto');
        switchContent(2);
        window.history.pushState({ "html": location.href, "pageTitle": location.href.pageTitle }, "", location.href.split("?")[0]);
        page = 0;
    }
}

function getObjectInfo(objectId, movieTitle, kind) {

    arr = [];
    var url;
    var tmdbUrl;

    if (kind == 1) {
        tmdbUrl = movieInfoUrl;
    } else {
        tmdbUrl = tvShowInfoUrl;
    }

    url = movieTitle.replace(/[^A-Za-z0-9]+/g, "");

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

            var finalImg;

            if (objectImage == null) {
                finalImg = data.poster_path;
                setTimeout(function () {
                    $('.imdbImage').css('width', '200px');
                }, 1500);
            } else {
                finalImg = objectImage;
            }

            var month = date.getMonth();
            var year = date.getFullYear();
            var day = date.getDate();


            changeMonthName(month, 1);
            changeDayName(day);

            var detailsWrapper = $('<div>', {
                class: 'detailsWrapper',
            }).appendTo($('#detailsWrapper'));

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

            if (data.overview !== '') {

                var descriptionWrapper = $('<div>', {
                    class: 'descriptionWrapper',
                }).appendTo(detailsWrapper);

                var description = $('<p>', {
                    class: 'objectDescription',
                    text: data.overview,
                }).appendTo(descriptionWrapper);
            }

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

            if (data.release_date !== '') {
                var releaseDate = $('<p>', {
                    class: 'releaseDate',
                    text: 'Release Date: ' + monthName + ' ' + dayName + ' ' + year,
                }).appendTo(objectDetails);
            }

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

            setTimeout(function() {
                $('.objectGenre').html($('.objectGenre').html().split(',').join(', '));
            }, 500)
        },
        error: function (err) {
            //console.log(err);
        }
    })
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

            var castWrapper = $('<div>', {
                class: 'castWrapper',
            }).appendTo($('#castWrapper'));

            var cast = $('<div>', {
                class: 'cast'
            }).appendTo(castWrapper);

            for (var i = 0; i < 21; i++) {
                try {
                    var actorImgPath = 'https://image.tmdb.org/t/p/w500' + data.cast[i].profile_path;

                    if (data.cast[i].profile_path == 'undefined' || data.cast[i].profile_path == null || data.cast[i].profile_path == '') {

                        switch (data.cast[i].gender) {
                            case 0:
                                actorImgPath = './images/actor.webp';
                                break;
                            case 1:
                                actorImgPath = './images/actress.webp';
                                break;
                            case 2:
                                actorImgPath = './images/actor.webp';
                                break;
                        }
                    }

                    if (data.cast[i].character.length > 25) {
                        var maxLength = 25;
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
                    }).appendTo(cast);

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
                            goToMovieImdb($(this)[0].attributes.id.textContent, actorNameCredits);
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
                        src: './images/imdb.webp',
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
                        src: './images/instagram.webp',
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

            var objectGallery = $('<div>', {
                class: 'objectGallery',
            }).appendTo($('#galleryWrapper'));

            for (var i = 0; i < data.backdrops.length; i++) {

                var galleryImg = data.backdrops[i].file_path;
                var galleryImgPath;

                if (galleryImg == null || galleryImg == '') {

                    galleryImgPath = './images/noImage.webp';
                } else {
                    galleryImgPath = 'https://image.tmdb.org/t/p/w500/' + galleryImg;
                }

                if (i !== 0) {
                    var movieGalleryImg = $('<img>', {
                        class: 'movieGalleryImg',
                        src: galleryImgPath,
                        alt: 'movieGalleryImg',
                    }).appendTo(objectGallery);
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

            var objectVideos = $('<div>', {
                class: 'objectVideos',
            }).appendTo($('#videosWrapper'));

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

                }).appendTo(objectVideos);
            }
        },
        error: function (err) {
            //console.log(err);
        }
    })
}

function getTvShowImdbId(tvShowId) {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: tvShowInfoUrl + tvShowId + "/external_ids" + "?api_key=" + tmdbKey + "&language=en-US",
        dataType: "jsonp",
        ifModified: true,
        success: function (data) {
            $('.detailsWrapper').find($('.imdbLink').attr('href', 'https://www.imdb.com/title/' + data.imdb_id))
        },
        error: function (err) {
            //console.log(err);
        }
    })
}

function characterClick(movieId, movieName) {
    $('.chosenMovieSection').empty();
    $('#chosenMovieTitle').remove();
    $('.results').fadeOut('fast');
    $('#searchMovie').val('');
    $('.btnWrapper').hide();
    $('.playingNowWrapper').remove();
    $('.upcomingMovieWrapper').remove();
    fromOtherSite(movieId, movieName, 1);
}

async function fromOtherSite(id, name, type) {
    $('body').css('pointer-events', 'none');
    $('.container').addClass('singleMovieContainer');
    $('.container, .bottomSection').hide();
    $('.spinner').fadeIn('fast');
    $('#switchContentBtnWrapper').hide();
    $('.movieWrapper').remove();
    $('.movieImg').remove();
    $('body').css('opacity', '.5');

    var title = $('<p>', {
        text: name,
        id: 'chosenMovieTitle'
    }).insertBefore($('#detailsWrapper'));

    var width = 1;
    var id2 = setInterval(frame, 30);
    
    function frame() {
        width++;
        if (width >= 100) {
            clearInterval(id2);
            $('body').css('opacity', '1');
            $('.container').fadeIn('slow');
            $('.movieWrapper').css('display', 'flex');
            $('.chosenMovie').fadeIn('slow');
            $('.bottomSection').show();
            width = 1;
        }
    }
	
	var promise = new Promise(function (resolve, reject) {
        resolve(getObjectInfo(id, name, type));
    });
	
	var promise2 = new Promise(function (resolve, reject) {
        resolve(getCredits(id, type));
    });
    
	var promise3 = new Promise(function (resolve, reject) {
        resolve(getSimilar(id, type));
    });
	
    var promise4 = new Promise(function (resolve, reject) {
        resolve(getImages(id, type));
    });

    var promise5 = new Promise(function (resolve, reject) {
        resolve(getVideos(id, type));
    });
	
	if(type == 2) {
		var promise6 = new Promise(function (resolve, reject) {
			resolve(getTvShowImdbId(id));
		});
		await Promise.all([promise, promise2, promise3, promise4, promise5, promise6]);
	} else {
	    await Promise.all([promise, promise2, promise3, promise4, promise5]);
	}
    
    $('.chosenMovie').off();
    $('.actorImg').off();

    setTimeout(function () {
        $('body').css('pointer-events', 'all');
        $('.spinner').hide();
    }, 3500)
}

async function objectClicked(id, movieTitle, type) {
    $('body').css('pointer-events', 'none');
    $('.container').addClass('singleMovieContainer');
    $('.spinner').fadeIn('fast');
    $('.imgDateWrapper, .bottomSection').hide();
    $('body').css('opacity', '.5');
    $('#searchMovie').val('');

    var title = $('<p>', {
        text: movieTitle,
        id: 'chosenMovieTitle'
    }).insertBefore($('#detailsWrapper'));
    
    $('#switchContentBtnWrapper').hide();
    $('.btnWrapper').hide();
    $('.playingNowWrapper').remove();
    $('.upcomingMovieWrapper').remove();
    $('.movieWrapper').remove();
    $('.movieImg').remove();

    var width = 1;
    var id2 = setInterval(frame, 30);
    function frame() {

        width++;
        if (width >= 100) {
            clearInterval(id2);
            $('body').css('opacity', '1');
            $('.bottomSection').show();
            $('.chosenMovie').fadeIn('slow');
            width = 1;
        }
    }

    var promise = new Promise(function (resolve, reject) {
        resolve(getObjectInfo(id, movieTitle, type));
    });

    var promise2 = new Promise(function (resolve, reject) {
        resolve(getCredits(id, type));
    });

    var promise3 = new Promise(function (resolve, reject) {
        resolve(getSimilar(id, type));
    });

    var promise4 = new Promise(function (resolve, reject) {
        resolve(getImages(id, type));
    });

    var promise5 = new Promise(function (resolve, reject) {
        resolve(getVideos(id, type));
    });
	
	if(type == 2) {
		var promise6 = new Promise(function (resolve, reject) {
			resolve(getTvShowImdbId(id));
		});
	    await Promise.all([promise, promise2, promise3, promise4, promise5, promise6]);
	} else {
	    await Promise.all([promise, promise2, promise3, promise4, promise5]);
	}

    $('.chosenMovie').off();
    $('.actorImg').off();

    setTimeout(function () {
        $('body').css('pointer-events', 'all');
        $('.spinner').hide();
        // $('.spinnerWrapper').css({'position': 'absolute', 'margin-top': 'unset', 'margin-bottom': 'unset'});
    }, 3500);
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

function goToMovieImdb(imdbActorId, name) {

    $('.actorCreditsWrapper').remove();

    var actorCreditsContainer = $('<div>', {
        class: 'actorCreditsContainer'
    }).insertAfter('body');

    var actorCreditsWrapper = $('<div>', {
        class: 'actorCreditsWrapper'
    }).appendTo(actorCreditsContainer);

    var actorCredits = $('<div>', {
        class: 'actorCredits'
    }).appendTo(actorCreditsWrapper);

    var closeWrapper = $('<div>', {
        class: 'closeWrapper',
    }).appendTo(actorCreditsWrapper);

    var closeBtn = $('<img>', {
        class: 'closeBtn',
        src: './images/closeBtn.webp',
        alt: 'closeBtn',
        click: function () {
            $('.actorCreditsWrapper').remove();
            $('body').css({'opacity': '1', 'pointer-events': 'all'});
        }
    }).appendTo(closeWrapper);

    var actorCreditsName = $('<p>', {
        class: 'actorCreditsName',
        text: name + "'s Credits"
    }).appendTo(closeWrapper);

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
                    path = './images/stock.webp';
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
            }).appendTo($('#similarWrapper'));

            var similarMoviesWrapper = $('<div>', {
                class: 'similarMoviesWrapper',
            }).appendTo($('#similarWrapper'));

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

                        img = './images/stock.webp';
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

                getTvShowImdbId(objectId);

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
