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
    let age = 'x';

    document.write(query + ' is ' + age + ' years old.');
}

var queryInfo = $.ajax( {
    url: 'https://en.wikipedia.org/w/api.php',
    data: {
        action: 'query',
        prop: 'revisions',
        rvprop: 'content',
        rvsection: 0,
        titles: beautifyName(getQuery()),
        format: 'json',
        origin: 'https://en.wikipedia.org'
    },
    xhrFields: {
        withCredentials: true
    },
    dataType: 'json'
} ).done( function ( data ) {
    alert( 'Foreign user ' + data.query.userinfo.name +
        ' (ID ' + data.query.userinfo.id + ')' );
} );

function testQuery() {
    var query = queryInfo;
    document.write(query);
}