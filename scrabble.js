/* Problem definition: 

Coding exercise: Scrabble

Write a function that takes a string representing a list of letter tiles. Return the longest word that contains only the given tiles. Every tile does not have to be used, but every letter of the matching word must be a distinct tile: only the first example below matches "canary" since it has two A tiles.

You may supply a word list or use the standard dictionary file at /usr/share/dict/words.

No need to develop a clever algorithm, but briefly describe the time complexity of your solution.

Examples:

scrabble("rancary")
=> canary
scrabble("rancry")
=> carry

*/

const fs = require('fs');
const highland = require('highland');
const path = '/usr/share/dict/words', encoding = 'utf8';

let buildObjFromStringHelper = (string) => { // builds out string into object, helper function
  let obj = {};
  for (let i = 0; i < string.length; i++) {
    if (obj[string.charAt(i)]) {
      obj[string.charAt(i)]++;
    } else {
      obj[string.charAt(i)] = 1;
    }
  }
  return obj;
}

let compareObjects = (stringObj, newObj) => { 
  for (var key in newObj) { // iterate through the objectified version of the new object
    // console.log('key: ', key, ' | bool: ', (stringObj[key] < newObj[key] || stringObj[key] == undefined));
    if (stringObj[key] < newObj[key] || !stringObj[key]) { // if the string has less characters than the new object or the string doesnt have a letter in the new word then it is no longer a candiddate --> return false
      return false;
    }
  }
  return true; // if our false never happens must use the new object
}

let scrabble = (string) => {
  const stringObj = buildObjFromStringHelper(string);
  let longest = {};
  longest.length = 0;
  longest.word = '';
  // console.log('test: ', buildObjFromStringHelper('test'));
  return highland(fs.createReadStream(path, encoding))
    .split('\n')
    .each((word) => {
        // console.log('word: ', word, ' | length: ', word.length, ' | longest length: ', longest.length);
        if (word.length > longest.length) {
          let tempWordObj = buildObjFromStringHelper(word);
          if (compareObjects(stringObj, tempWordObj)) { // if returns true use new word
            longest = tempWordObj;
            longest.length = word.length;
            longest.word = word;
            return longest;
          }
        }
    })
    .done(() => {
      console.log('---------------------------------------\n', longest.word);
      return longest.word;
    })

}

// Inline testing for compare objects function
// let abcdefgObj = buildObjFromStringHelper('abcdefg');
// let wordTestObj = buildObjFromStringHelper('abcdefgh');
// console.log('str obj: ',abcdefgObj, ' | newWordObj: ', wordTestObj);
// console.log(compareObjects(abcdefgObj, wordTestObj))

scrabble('test');

/*

Summary and complexity analysis.
---------------------------------

Great toy problem, I like working with problems that involve some form of interacting with systems like fs rather than just plain old algorithms.
I recently tested out Highland and so thought I would use that to solve this.

Starting with space complexity I really only have 3 objects at any given point of runtime that are each linnear, so 3(N) --> O(N) 

Moving to time complexity, at first I wanted to use readFileSync and just grab all the data cleanly at once, but I thought it would improve efficiency if I just did it as I read in the file.
I must iterate through every word in the file by reading it in, and then as big O notation requires, I assume the worst, that every word would be longer and so I would need to iterate first through each letter to build out an object, then through each key of the object which really makes it 2x^2 --> O'N^2


*/
