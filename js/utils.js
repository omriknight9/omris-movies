
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
    });
}

function changeMonthName(month, type) {

    if (type == 1) {
        switch (month) {
            case 0: {
                monthName = 'January';
                break;
            }
            case 1: {
                monthName = 'February';
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

    } else {
        switch (month) {
            case 0: {
                monthName = 'Jan';
                break;
            }
            case 1: {
                monthName = 'Feb';
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
                monthName = 'Aug';
                break;
            }
            case 8: {
                monthName = 'Sep';
                break;
            }
            case 9: {
                monthName = 'Oct';
                break;
            }
            case 10: {
                monthName = 'Nov';
                break;
            }
            case 11: {
                monthName = 'Dec';
                break;
            }  
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