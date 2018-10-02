import { getQuery } from "queryScript";

export const goToWiki = () => {
    let query = getQuery.getQuery();
    let wikiQuery = query.split('+').join('_');
    return wikiQuery;
}