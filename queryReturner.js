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

function goToWiki() {
    let query = beautifyName(getQuery());
    let wikiQuery = query.split(' ').join('_');
    const wikiURL = `https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&titles=${wikiQuery}&format=json`;

    return wikiURL;
}

function getAge() {

}

function returnQuery() {
    var query = beautifyName(getQuery());
    let age = 'x';

    document.write(query + ' is ' + age + ' years old.');
}

function testQuery() {
    var query = getAge();
    document.write(query);
}