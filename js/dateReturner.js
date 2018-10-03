import beautifyName from './js/getQuery'

function getAge() {
    let query = beautifyName(getQuery());
    let wikiQuery = query.split(' ').join('_');
    const wikiURL = `https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&titles=${wikiQuery}&format=json`;
    var getDate = jQuery.parseJSON( 'pages' );
    
    return getDate;
}

function goToWiki() {
   
    return wikiURL;
}

function testQuery() {
    var query = getAge();
    document.write(query);
}