/**
 * Created by Carlos Mercado on 13/11/2016.
 */

/**
 * @typedef {Object} SearchTerms
 * @property {string} genericName
 * @property {string} brandedName
 */

/**
 * Take an medicine text to search input and convert it to an object with separated tokens
 * @param {string} text - the text to be parsed
 * @returns {{SearchTerms}}
 */
export function drugTextToTerms(text) {
   let newText = text.toLowerCase()
      .replace(/\s+/g, ' ').trim();

   // Delete all non allowed characters
   newText = newText.replace(/[^a-záéíóúüñ0-9/\s@#+$-]/gi, '');

   let result = {};

   let position = newText.search(/[#+@$]/);
   if(position === -1) {
      if(newText.length>0)
         result.genericName = newText;
      return result
   }

   if(position >=0) {
      const genericName = newText.substring(0, position);
      if(genericName.length>0)
         result.genericName = genericName
   }


   const wordsReducer = (befWord, word) => (befWord+ (befWord.length>0 ? ' ': '') + word.substr(1).trim());

   const extractTerms = (rx, name) => {
      const arr = newText.match(rx);
      if(arr !== null) {
         const reducedWords = arr.reduce(wordsReducer, '');
         if(reducedWords.length>0)
            result[name] = reducedWords;
      }
   };

   // Look for word between this characters #, +, @, $ or end of line

   const rxPound = /#[^$+@#]*(?=[+#@$]|$)/gi;
   //i.e.: paracet #kitadol +capsu #plus #tw @oral $chile +blandas
   extractTerms(rxPound,"brandedName");

   const rxPlus  = /\+[^$+@#]*(?=[+#@$]|$)/gi;
   //i.e.: paracet #kitadol [+capsu ]#plus #tw @oral $chile [+blandas]
   extractTerms(rxPlus,"drugForm");

   const rxAt    = /@[^$+@#]*(?=[+#@$]|$)/gi;
   //i.e.: paracet #kitadol +capsu #plus #tw [@oral ]$chile +blandas
   extractTerms(rxAt,"route");

   const rxDolar = /\$[^$+@#]*(?=[+#@$]|$)/gi;
   //i.e.: paracet #kitadol +capsu #plus #tw @oral [$chile ]+blandas
   extractTerms(rxDolar,"manufacturer");

   return result;
}

/**
 * Take the individual terms of drug and create an ordered advanced text
 * like the user should be type for search
 * The order is generic name, without prefix
 * @param terms
 * @returns {string}
 */
export function drugTermsToText(terms) {

   return (
      (terms.genericName ? terms.genericName : '') +
      (terms.brandedName ? ' #' + terms.brandedName : '') +
      (terms.drugForm ? ' +' + terms.drugForm : '') +
      (terms.route ? ' @' + terms.route : '') +
      (terms.manufacturer ? ' $' + terms.manufacturer : '')
   )
}