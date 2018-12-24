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
    
var reg = /[\|\d]/g;
    
function getDateCall(call) {
    var jsonCall = JSON.stringify(call.query.pages);
    if (jsonCall.includes('REDIRECT')) {
        var newName = redirectName(jsonCall);
        return redirectMessage(newName);
    } else if ((jsonCall.includes('missing')) || (!jsonCall.includes('birth_date'))) {
        return errorMessage();
    } else {
        var birthSection = jsonCall.split('birth_date')[1].split('birth_place')[0];
        var date = birthSection.match(reg).join('');
        date = dateTrimmer(date);
        var yearCalculation = calculateYears(date, currentDate);

        if (checkDeath(jsonCall)) {
            
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

function compareYear(date) {
    var birthYear = date.split('|')[0];
    var currentYear = currentDate.getFullYear();
    var compare = currentYear - birthYear;
    return compare;
}

function compareMonth(date) {
    var birthMonth = date.split('|')[1];
    var currentMonth = currentDate.getMonth();
    var compare = (currentMonth + 1) - birthMonth;
    return compare;
}

function compareDay(date) {
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

function checkDeath(call) {
    var death = false;
    if (call.includes('death_date')) {
       if (deathTrimmer(call).includes('Death date and age')) {
           death = true;
       }
    }
    return death;
}

function deathTrimmer(call) {
    var deathSplit = call.split('death_date')[1].split('death_place')[0];
    return deathSplit;
}

function deathCalculation(call) {
    var deathSplit = deathTrimmer(call);
    var date = deathSplit.match(reg).join('');
    console.log(date);
    
    return deathSplit;
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
    var message = beautifyName(getQuery()) + ' is not a real person, or is not famous enough. Check spelling and try again.';
    document.getElementById("message").innerHTML = message;
}

function redirectMessage(newName) {
    var message = 'There seems to be a typo. ' + newName + ' looks like the correct search.';
    document.getElementById("message").innerHTML = message;
}