
/**Returns a Regex value matching with the input string
 * 
 * @param s a string value
 * @returns 
 */
export function convertStringToRegex(s:string){

    return RegExp(
        s.replace(
          /[-[\]{}()*+?.,\\^$|]/i, // Escape regex special characters
          "\\$&"
        ),
        "i"
      )
}


/**Returns a Regex value matching with any of the input strings
 * 
 * @param s a string value
 * @returns 
 */
export function convertStringListToRegex(stringList:string[]){
  
  if(stringList.length == 0){
    return /.*/
  }

  // Escape special characters in each string and join them with '|' to form an alternation pattern
  const escapedList = stringList.map(str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').toLowerCase());
  const pattern = escapedList.join('|');
  //console.log(new RegExp(`(${pattern})`,"i"))
  // Create and return a new RegExp object
  return new RegExp(`(${pattern})`,
    "i");
}


