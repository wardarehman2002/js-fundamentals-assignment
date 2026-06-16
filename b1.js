// ============================================================
// B1 — Predict Output + Hoisting Bugs
// ============================================================

// ---- PART 1: PREDICTIONS ----

console.log(a); // Output: undefined
// WHY: var is hoisted to the top of its scope and initialized with undefined.
// So even though the declaration is below, JS already knows about 'a' but has no value yet.

console.log(b); // Output: ReferenceError: Cannot access 'b' before initialization
// WHY: let is hoisted but NOT initialized — it stays in the Temporal Dead Zone (TDZ)
// from the start of the block until the declaration line. Accessing it throws ReferenceError.

console.log(c); // Output: ReferenceError: Cannot access 'c' before initialization
// WHY: Same as let — const is also hoisted but in TDZ. Cannot be accessed before declaration.

var a = 10;
let b = 20;
const c = 30;

// ---- PART 2: PREDICTIONS ----

var a = 99;
// var CAN be re-declared — no error. a is now 99.

// let b = 88;
// ERROR: SyntaxError: Identifier 'b' has already been declared
// let CANNOT be re-declared in the same scope.

// const c = 77;
// ERROR: SyntaxError: Identifier 'c' has already been declared
// const CANNOT be re-declared in the same scope.

// ---- PART 3: PREDICTIONS ----

const user = { name: 'Asad' };

user.name = 'Ali';
// ALLOWED  — const prevents re-assigning the variable itself,
// but it does NOT make the object's contents immutable.
// We are changing a property, not the variable binding.

// user = {};
// NOT ALLOWED  — TypeError: Assignment to constant variable.
// This tries to reassign the 'user' variable to a new object, which const forbids.

console.log(user.name); // 'Ali'


// ============================================================
// CORRECTED VERSION — Clean, bug-free code
// ============================================================

// Use let for variables that will be reassigned, const for those that won't
let score = 10;
const MAX_SCORE = 30;

console.log(score);     // 10
console.log(MAX_SCORE); // 30

score = 99; //  allowed — let can be reassigned
// MAX_SCORE = 77; //  would throw TypeError

// For the user object: const is fine, just don't reassign the variable
const currentUser = { name: 'Asad' };
currentUser.name = 'Ali'; //  allowed — mutating a property
console.log(currentUser.name); // 'Ali'

// To truly make an object immutable, use Object.freeze()
const frozenUser = Object.freeze({ name: 'Asad' });
frozenUser.name = 'Ali'; // silently fails (no error in non-strict mode)
console.log(frozenUser.name); // still 'Asad'


c:\Users\Administrator\Pictures\b1.js.jpg
