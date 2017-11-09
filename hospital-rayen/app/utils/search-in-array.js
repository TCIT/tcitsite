/**
 * Created by Carlos Mercado on 13/11/2016.
 */
const tokenize = (text) => {
   return text.toLowerCase()
      .replace(/\s+/g, ' ').trim()
      .replace(/[aá]/gi,'[aá]')
      .replace(/[eé]/gi,'[eé]')
      .replace(/[ií]/gi,'[ií]')
      .replace(/[oó]/gi,'[oó]')
      .replace(/[uúü]/gi,'[uúü]')
      .split(' ');
};

/**
 * Returns an array filtered by filterText param with the original array items
 * @param arrayList: The array to filter
 * @param {boolean} beginWordsOnly - Match at beginning of words only, not inside
 * @param {string} searchText - The words to match
 * @param {string} fieldToSearch - The name of property for search in array object item (content must be lowercase)
 * @returns {Array} - With the filtered original items (not a new copy of each item)
 */
export function arrayFilter(arrayList, beginWordsOnly, searchText, fieldToSearch) {

   return multipleArrayFilter(arrayList, [{ beginWordsOnly, searchText, fieldToSearch }]);
}


/**
 * Returns an array filtered by filterText param with the original array items
 * @param {array} arrayList - The array to filter
 * @param {Object[]} filters - The list of filters to apply
 * @param {boolean} filters[].beginWordsOnly - Match at beginning of words only, not inside
 * @param {string} filters[].filterText - The words to match (all of them)
 * @param {string} filters[].fieldToSearch - The name of property for search in array object item
 * @returns {Array} - With the filtered original items (not a new copy of each item)
 */
export function multipleArrayFilter(arrayList, filters) {
  let filtersRegexes = filters.map((filter) => {
    const words= tokenize(filter.filterText);
    const exp = words.map((word) => {
        return new RegExp(filter.beginWordsOnly ? ('\\s' + word + '|^' + word) : word , 'gi'); // pattern \sterm|^term
    });
    return exp
  });

  return arrayList.filter(function (item) {
    // The algorithm: if any word was not found the array item is rejected (returns false)
    for (let f = 0; f<filters.length; f++) {
        for(let regex of filtersRegexes[f]) {
          let found = regex.test(item[filters[f].fieldToSearch]);
          if (!found)
              return false
        }
    }
    return true; // if all words found, accept the array item
  });
}


/*
 * Returns an array sorted by terms param with the original array items
 * @param {array} arrayList - The array to sort
 * @param {string} fieldToSort - The name of property used to sort
 * @param {string} terms - The words to use for ranking each array item
 * @param {boolean} beginWordsOnly - Match at beginning of words only, not inside
 * @returns {Array} - A new array with sorted original items (not a new copy of each item)
 */
export function arraySort(arrayList, fieldToSort, terms, beginWordsOnly ) {
   return multipleArraySort(arrayList, [{ fieldToSort, terms, beginWordsOnly }])
}


/**
 * Returns an array sorted by terms param with the original array items
 * @param {array} arrayList - The array to sort
 * @param {Object[]} filters - The list of filters to apply
 * @param {string} filters[].fieldToSort - The name of property used to sort
 * @param {string} filters[].terms - The words to use for ranking each array item
 * @param {boolean} filters[].beginWordsOnly - Match at beginning of words only, not inside
 * @returns {Array} - A new array with sorted original items (not a new copy of each item)
 */
export function multipleArraySort(arrayList, filters) {

   let regexFilters= filters.map((filter) => {

      const words= tokenize(filter.terms);
      const exps =  words.map((word) => {
         return new RegExp(filter.beginWordsOnly ? ('\\s' + word + '|^' + word) : word , 'gi'); // pattern \sterm|^term
      });
      return exps;
   });

   let aPos, bPos;
   const newArray = [...arrayList];
   const result = newArray.sort((a,b) => {
      for (let f = 0; f<filters.length; f++) {
         for(let exp of regexFilters[f]) {
            aPos = a[filters[f].fieldToSort].search(exp);
            bPos = b[filters[f].fieldToSort].search(exp);
            if (aPos === -1 && bPos >= 0) // a not exists, so is later than b
               return 1;
            if (bPos === -1 && aPos >= 0) // b not exists, so is later than a
               return -1;
            if (aPos > bPos) // if pattern word in b is closed to the beginning than in a, then a is later than b
               return 1;
            else if (aPos < bPos)
               return -1;
         }
      }
      return 0; // all patterns words match the same position
   });

   return result;
}


/**
 * Highlight the indicated terms in the highlighters on column basis
 * @param {array} arrayList - The array to highlight
 * @param {string} fieldToHighlight - The name of property for search in array object item
 * @param {string} terms - The terms to highlight
 * @param {boolean} beginWordsOnly - Match at beginning of words only, not inside
 * @param {string} highlightedName
 * @param {string} beginTag
 * @param {string} endTag
 * @returns {Array} containing items. Each item has the properties indicated in highlightedName property from each highlighter
 */
export function highlightTerms(arrayList, fieldToHighlight, terms, beginWordsOnly, highlightedName, beginTag, endTag) {

   return multipleHighlightTerms(arrayList,[{ fieldToHighlight, terms, beginWordsOnly, highlightedName, beginTag, endTag }]);
}


/**
 * Highlight the indicated terms in the highlighters on column basis
 * @param {array} arrayList - The array to highlight
 * @param {Object[]} highlighters - The list of highlight to apply
 * @param {string} highlighters[].terms - The terms to highlight
 * @param {boolean} highlighters[].beginWordsOnly - Match at beginning of words only, not inside
 * @param {string} highlighters[].fieldToHighlight - The name of property for search in array object item
 * @param {string} highlighters[].highlightedName
 * @param {string} highlighters[].beginTag
 * @param {string} highlighters[].endTag
 * @returns {Array} containing new highlighted items. Each item has the properties
 * indicated in highlightedName property from each highlighter and add a new itemRef property
 * with a reference to the original item of the original array
 */
export function multipleHighlightTerms(arrayList, highlighters) {
   let highlightersRegexs = highlighters.map((highlighter) => {
      const words= tokenize(highlighter.terms);
      const exps =  words.map((word) => {
         return new RegExp(highlighter.beginWordsOnly ? ('\\s' + word + '|^' + word) : word , 'gi'); // pattern \sterm|^term
      });
      return exps;
   });

   return arrayList.map( function (item) {
      let newItem = { itemRef: item }; // This is the item for return to highlighted array
      for (let h = 0; h < highlighters.length; h++) {
         const { fieldToHighlight, highlightedName, beginTag, endTag } = highlighters[h];

         newItem[highlightedName] = highlightersRegexs[h].reduce((beforeString, currentRegex) => {
            return beforeString.replace(currentRegex, beginTag + '$&' + endTag);
         }, item[fieldToHighlight]);
      }
      return newItem;
   })
}



