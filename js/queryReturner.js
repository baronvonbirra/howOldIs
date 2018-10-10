function getQuery() {
    let url = window.location.search;
    let query = url.slice(3);

    return query;
}

function beautifyName(query) {
    let name = query.split('+');
    for (var i = 0; i < name.length; i++) {
		name[i] = name[i].charAt(0).toUpperCase() + name[i].slice(1);
	}
    name = name.join(" ");

    return name;
}

function returnQuery() {
    var query = beautifyName(getQuery());

    document.write(query);
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
    var birthSection = jsonCall.split('birth_date')[1].split('birth_place')[0];
    var yearCalculation = calculateYears(birthSection);

    document.getElementById("age").innerHTML = yearCalculation;
    return yearCalculation;
    }

function compareYear(date) {
    console.log(date);
    var birthYear = date.split('|')[1];
    console.log(birthYear);
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var compare = currentYear - birthYear;

    return compare;
}

function compareMonth(date) {
    var birthMonth = date.split('|')[2];
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth();
    var compare = (currentMonth + 1) - birthMonth;

    return compare;
}

function compareDay(date) {
    var birthDay = date.split('|')[3];
    var currentDate = new Date();
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