function getQuery() {
    let url = window.location.search;
    let query = url.slice(3);

    return query;
}

function beautifyName(query) {
    let name = query.toLowerCase().split('+');
    for (var i = 0; i < name.length; i++) {
		name[i] = name[i].charAt(0).toUpperCase() + name[i].slice(1);
	}
    name = name.join(" ");

    return name;
}

var queryInfo = $.ajax( {
    url: 'https://en.wikipedia.org/w/api.php',
    data: {
        action: 'query',
        prop: 'revisions',
        rvprop: 'content',
        rvsection: 0,
        titles: beautifyName(getQuery()),
        format: 'json'
    },
    type: 'GET', 
    xhrFields: {
        withCredentials: true
    },
    dataType: 'jsonp',
    success: getDateCall
    });
    
function getDateCall(call) {
    var jsonCall = JSON.stringify(call.query.pages);
    if (jsonCall.includes('REDIRECT')) {
        var newName = redirectName(jsonCall);
        return redirectMessage(newName);
    } else if ((jsonCall.includes('missing')) || (!jsonCall.includes('birth_date'))) {
        return errorMessage();
    } else {
        var birthSection = jsonCall.split('birth_date')[1].split('birth_place')[0];
        var reg = /[\|\d]/g;
        var date = birthSection.match(reg).join('');
        date = dateTrimmer(date);
        var yearCalculation = calculateYears(date, currentDate);
        if (jsonCall.includes('death_date')){
           return successDeadMessage(yearCalculation);
        } else {
        return successAliveMessage(yearCalculation);
        }
    }
}

function redirectName(call) {
    var cut = call.split('REDIRECT')[1].split('Redirect')[0];
    var regDelete = /[\[\]\\n\{\}]/g
    cut = cut.replace(regDelete, '');
    var reg = /(\W)([a-zA-Z]+)/g;
    var name = cut.match(reg).join('');

    return name;
}

function dateTrimmer(date) {
    while(date.charAt(0) === '|') {
        date = date.substr(1);
    }
    return date;
}

var currentDate = new Date();

function compareYear(date, compareDate) {
    var birthYear = date.split('|')[0];
    var currentYear = currentDate.getFullYear();
    var compare = currentYear - birthYear;
    return compare;
}

function compareMonth(date, compareDate) {
    var birthMonth = date.split('|')[1];
    var currentMonth = currentDate.getMonth();
    var compare = (currentMonth + 1) - birthMonth;

    return compare;
}

function compareDay(date, compareDate) {
    var birthDay = date.split('|')[2];
    var currentDay = currentDate.getDate();
    var compare = currentDay - birthDay;

    return compare;
}

function calculateYears(date) {
    var initialYears = compareYear(date);
    var monthDifference = compareMonth(date);
    var dayDifference = compareDay(date);

    if ((monthDifference <= 0) && (dayDifference <=0)){
        return (initialYears + 1);
    } else {
        return initialYears;
    }
}

function successAliveMessage(age) {
    var message = beautifyName(getQuery()) + ' is ' + age + ' years old.';
    document.getElementById("message").innerHTML = message;
}

function successDeadMessage(age) {
    var message = beautifyName(getQuery()) + ' died. Would be ' + age + ' years old.';
    document.getElementById("message").innerHTML = message;
}

function errorMessage() {
    var message = beautifyName(getQuery()) + ' is not a person, or is not famous enough. Check spelling and try again.';
    document.getElementById("message").innerHTML = message;
}

function redirectMessage(newName) {
    var message = 'There seems to be a typo. ' + newName + ' looks like the correct search.';
    document.getElementById("message").innerHTML = message;
}