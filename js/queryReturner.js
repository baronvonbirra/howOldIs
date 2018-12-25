function getQuery() {
    let url = window.location.search;
    url = decodeURI(url);
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
    
var reg = /[\|\d]/g;
    
function getDateCall(call) {
    var jsonCall = JSON.stringify(call.query.pages);
    if (jsonCall.includes('REDIRECT')) {
        var newName = redirectName(jsonCall);
        return redirectMessage(newName);
    } else if ((jsonCall.includes('missing')) || (!jsonCall.includes('birth_date'))) {
        return errorMessage();
    } else {
        var dateParse = dateParser(jsonCall);
        var yearCalculation = calculateYears(dateParse);

        if (checkDeath(jsonCall)) {
            var deathAge = deathAgeCalculation(jsonCall, yearCalculation);
            return successDeadMessage(yearCalculation, deathAge);
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

function dateParser(call) {
    var birthSection = call.split('birth_date')[1].split('birth_place')[0];
    var date = birthSection.match(reg).join('');
    date = dateTrimmer(date);
    
    if (date.length <= 7) {
        date = incompleteDateReturner(date);
    }
    return date;
}

function dateTrimmer(date) {
    while(date.charAt(0) === '|') {
        date = date.substr(1);
    }
    return date;
}

function incompleteDateReturner(date) {
    var newDate = date.substring(2);
    return newDate + "0|0";
}

function getDatePart(date) {
    var currentDate = new Date();
    if (date == 'year') {
        return currentDate.getFullYear();
    } else if (date == 'month') {
        return currentDate.getMonth();
    } else {
        return currentDate.getDate();
    }
}

function compareYear(date) {
    var birthYear = date.split('|')[0];
    var currentYear = getDatePart('year');
    var compare = currentYear - birthYear;
    return compare;
}

function compareMonth(date) {
    var birthMonth = date.split('|')[1];
    var currentMonth = getDatePart('month');
    var compare = (currentMonth + 1) - birthMonth;
    return compare;
}

function compareDay(date) {
    var birthDay = date.split('|')[2];
    var currentDay = getDatePart('day');
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

function checkDeath(call) {
    var death = false;
    if (call.includes('death_date')) {
       if (deathTrimmer(call).includes('death date and age')) {
           death = true;
       }
    }
    return death;
}

function deathTrimmer(call) {
    var deathSplit = call.split('death_date')[1].split('death_place')[0];
    return deathSplit.toLowerCase();
}

function deathCalculation(call) {
    var deathSplit = deathTrimmer(call);
    var dates = deathSplit.match(reg).join('');
    var dateTrim = dateTrimmer(dates);

    var deathYear = dateTrim.split('|')[0];
    var deathMonth = dateTrim.split('|')[1];
    var deathDay = dateTrim.split('|')[2];
    var currentYear = getDatePart('year');
    var currentMonth = getDatePart('month');
    var currentDay = getDatePart('day');
    var compareYear = currentYear - deathYear;
    var compareMonth = (currentMonth + 1) - deathMonth;
    var compareDay = currentDay - deathDay;

    if ((compareMonth <= 0) && (compareDay <=0)){
        return (compareYear + 1);
    } else {
        return compareYear;
    }
}

function deathAgeCalculation(call, years) {
    deathTime = deathCalculation(call);
    return (years - deathTime);
}

function successAliveMessage(age) {
    var message = beautifyName(getQuery()) + ' is ' + age + ' years old.';
    document.getElementById("message").innerHTML = message;
}

function successDeadMessage(age, deathAge) {
    var message = beautifyName(getQuery()) + ' died at the age of ' + deathAge + '. Would be ' + age + ' years old.';
    document.getElementById("message").innerHTML = message;
}

function errorMessage() {
    var message = "Sorry, but " + beautifyName(getQuery()) + ' is not a real person, is not famous enough, or name is misspelled.';
    document.getElementById("message").innerHTML = message;
}

function redirectMessage(newName) {
    var message = 'There seems to be a typo. ' + newName + ' looks like the correct search.';
    document.getElementById("message").innerHTML = message;
}