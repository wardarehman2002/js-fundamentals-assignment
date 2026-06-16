// ============================================================
// B5 — Pure Functions Library (Never Mutate Inputs)
// ============================================================
// A pure function:
// 1. Always returns the same output for the same input
// 2. Never modifies its inputs (no side effects)


// ---- Function 1: addToCart ----
// cart = array of items, item = string
// Returns NEW array with item added — original cart unchanged

function addToCart(cart, item) {
    return [...cart, item]; // spread creates a new array
  }
  
  const myCart = ['milk', 'eggs'];
  const updatedCart = addToCart(myCart, 'bread');
  console.log('addToCart result:', updatedCart); // ['milk', 'eggs', 'bread']
  console.log('original cart:',   myCart);       // ['milk', 'eggs'] ✅ unchanged
  
  
  // ---- Function 2: updateUserAge ----
  // user = object, newAge = number
  // Returns NEW user object with updated age — original unchanged
  
  function updateUserAge(user, newAge) {
    return { ...user, age: newAge }; // spread copies all properties, then overrides age
  }
  
  const originalUser = { name: 'Ali', age: 25 };
  const updatedUser = updateUserAge(originalUser, 26);
  console.log('updateUserAge result:', updatedUser);   // { name: 'Ali', age: 26 }
  console.log('original user age:', originalUser.age); // 25 ✅ unchanged
  
  
  // ---- Function 3: incrementScore ----
  // scores = { playerName: number, ... }
  // Returns NEW scores object with playerName's score incremented by 1
  
  function incrementScore(scores, playerName) {
    return {
      ...scores,
      [playerName]: (scores[playerName] || 0) + 1, // computed property key
    };
  }
  
  const originalScores = { Ali: 5, Sara: 3 };
  const updatedScores = incrementScore(originalScores, 'Ali');
  console.log('incrementScore result:', updatedScores);    // { Ali: 6, Sara: 3 }
  console.log('original Ali score:', originalScores.Ali);  // 5 ✅ unchanged
  
  
  // ---- Function 4: reverseString ----
  // Returns reversed string without modifying original
  // Strings are IMMUTABLE in JS — string methods always return new strings
  
  function reverseString(str) {
    // split('') → array of chars
    // reverse() → reverses the array (this mutates the ARRAY, not the string)
    // join('') → joins back to string
    return str.split('').reverse().join('');
    // Note: str itself is never touched — strings are primitive and immutable
  }
  
  const word = 'hello';
  const reversed = reverseString(word);
  console.log('reverseString result:', reversed); // 'olleh'
  console.log('original string:', word);          // 'hello' ✅ (strings are always safe — immutable)
  
  
  // ---- Function 5: removeItem ----
  // Returns NEW array with item at given index removed
  // Original array must be untouched
  
  function removeItem(arr, index) {
    // slice(0, index) → everything before the index
    // slice(index + 1) → everything after the index
    // concat joins them into a new array
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }
  
  const numbers = [1, 2, 3, 4];
  const withoutSecond = removeItem(numbers, 1); // remove index 1 (value: 2)
  console.log('removeItem result:', withoutSecond); // [1, 3, 4]
  console.log('original array:', numbers);          // [1, 2, 3, 4] ✅ unchanged
  
  
  // ============================================================
  // SUMMARY — Why these are "pure"
  // ============================================================
  // ✅ addToCart     — uses spread [...arr] to create new array
  // ✅ updateUserAge — uses spread {...obj} to create new object
  // ✅ incrementScore — uses spread + computed key for new object
  // ✅ reverseString — strings are primitive and immutable by design
  // ✅ removeItem    — uses slice() which returns new arrays, never mutates