function getQuery() {
    let url = window.location.href;
    let queryIndex = url.indexOf('?');
    let query = url.slice(queryIndex);
    query = query.slice(3);

    return query;
}

function beautifyName(query) {
    let name = query.split('+');
    for (var i = 0; i < name.length; i++) {
		name[i] = name[i].charAt(0).toUpperCase() + name[i].slice(1);
	}
    name = name.join(" ");

    document.write(name);
}