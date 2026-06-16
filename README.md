# JavaScript Fundamentals Assignment


---

## A1

### var, let, and const — Differences

**① Scope**
- `var` is **function-scoped** — it is accessible anywhere within the function it is declared in, or globally if declared outside a function.
- `let` and `const` are **block-scoped** — they only exist within the `{}` block (if, for, etc.) where they are declared.

```js
function example() {
  if (true) {
    var x = 1;   // function scoped — accessible outside the if block
    let y = 2;   // block scoped — NOT accessible outside the if block
  }
  console.log(x); // 1
  console.log(y); // ReferenceError
}
```

**② Hoisting**
- `var` is hoisted to the top of its scope and initialized with `undefined`.
- `let` and `const` are also hoisted but are NOT initialized — they remain in the **Temporal Dead Zone** until the declaration line is reached.

```js
console.log(a); // undefined  (var is hoisted with value undefined)
console.log(b); // ReferenceError (let is in TDZ)
var a = 5;
let b = 10;
```

**③ Temporal Dead Zone (TDZ)**
- `let` and `const` both have a TDZ — the period between the start of the block and the point where the variable is declared.
- Accessing them during TDZ throws a `ReferenceError`.
- `var` has NO TDZ — it is safe to access before its declaration (returns `undefined`).

**④ Re-declaration and Re-assignment**

| Keyword | Re-declare | Re-assign |
|---------|------------|-----------|
| `var`   |  Yes     |  Yes    |
| `let`   |  No      |  Yes    |
| `const` |  No      |  No     |

Note: `const` prevents re-assignment of the variable itself, but properties of a `const` object CAN be changed.

```js
const user = { name: 'Ali' };
user.name = 'Sara'; //  allowed — mutating property
user = {};          //  TypeError — re-assigning the variable
```

**⑤ Which to use in modern JavaScript?**
- Use `const` by default for everything that won't be reassigned.
- Use `let` only when you know the value will change (like a loop counter).
- **Never use `var`** in modern JS — its function scope and lack of TDZ cause hard-to-find bugs.

---

## A2

### V8 Engine and Single-Threaded JavaScript

**① What is V8?**
V8 is an open-source JavaScript engine built by Google, written in C++. It is used in:
- **Google Chrome** (browser)
- **Node.js** (server-side runtime)

V8 takes JavaScript code and executes it directly on the machine.

**② JIT (Just-In-Time) Compilation**
Traditionally, code is either interpreted (run line by line, slow) or compiled (converted to machine code before running, fast). V8 uses **JIT compilation** — it compiles JavaScript to machine code *at runtime*, just before execution. This makes JS much faster than pure interpretation.

**③ Single-Threaded**
JavaScript has a **single call stack** — it can only do one thing at a time. There is no parallel execution of JS code. Each function call goes onto the stack, and must finish before the next one begins.

**④ How does JS handle async tasks (setTimeout, fetch)?**
Even though JS is single-threaded, it handles async tasks through the **Event Loop** model:
- Async tasks like `setTimeout` or `fetch` are sent to **Web APIs** (provided by the browser or Node.js)
- These run *outside* the JS engine
- When they complete, their callbacks are placed in the **Callback Queue**
- The **Event Loop** checks: "Is the Call Stack empty?" — if yes, it picks the next callback from the queue and pushes it onto the stack

**⑤ The Runtime Model**

```
Call Stack → Web APIs → Callback Queue → Event Loop → Call Stack
```

- **Call Stack**: Where JS executes code, one frame at a time
- **Web APIs**: Browser/Node handles async work (timers, HTTP, DOM events)
- **Callback Queue**: Completed async callbacks wait here
- **Event Loop**: Continuously checks if the Call Stack is empty, then pushes next callback

> **Common interview follow-up:** "If JS is single-threaded, is Node.js also single-threaded?"
> Answer: JS *execution* is single-threaded, but Node.js uses **libuv** (a C++ library) which is multi-threaded for I/O operations like file reading, network calls, etc.

---

## A3

### JavaScript Data Types and Type Coercion

**① The 8 Data Types**

**7 Primitives:**
1. `number` — integers and decimals: `42`, `3.14`
2. `string` — text: `'hello'`
3. `boolean` — `true` or `false`
4. `undefined` — variable declared but not assigned
5. `null` — intentional absence of value
6. `bigint` — large integers: `9007199254740991n`
7. `symbol` — unique identifiers: `Symbol('id')`

**1 Non-Primitive:**
8. `object` — arrays, objects, functions, null (bug)

**② The `typeof null === 'object'` Bug**
`null` is a primitive, but `typeof null` returns `'object'`. This is a **bug from JavaScript's original 1995 implementation** — in the first version of JS, values were stored with type tags, and `null` had the same type tag as objects (000). It was never fixed to maintain **backward compatibility** with existing code. To correctly check for null: `value === null`.

**③ Implicit Coercion — JS silently converts types**
```js
// Example 1: number + string → string concatenation
console.log(5 + '3');    // '53' (number 5 becomes string)

// Example 2: loose equality
console.log(0 == false); // true (false becomes 0)
```

**④ Explicit Coercion — you force the conversion**
```js
Number('42')   // 42    — string to number
String(100)    // '100' — number to string
Boolean(0)     // false — 0 is falsy
```

**⑤ Why `==` is dangerous and `===` is safe**
- `==` (loose equality) performs **type coercion** before comparing — `'5' == 5` is `true`
- `===` (strict equality) checks **both value AND type** — `'5' === 5` is `false`
- Always use `===` to avoid unexpected bugs from silent type conversion.

---

## A4

### Primitive vs Non-Primitive Data Types in Memory

**① Primitive Types — stored on the Stack**
- number, string, boolean, undefined, null, bigint, symbol
- Primitives are stored **directly on the Stack** — a fast, ordered memory structure
- They are **fixed size** and stored by value

**② Non-Primitive Types — stored on the Heap**
- Objects, Arrays, Functions
- The actual data is stored in the **Heap** (a large, unstructured memory pool)
- The **Stack** holds a *reference* (memory address) pointing to the Heap location

**③ Copying a Primitive**
A copy creates an **independent value** — changing the copy does NOT affect the original:
```js
let a = 10;
let b = a;
b = 99;
console.log(a); // 10 — unchanged
```

**④ Copying a Reference Variable**
Copying an object copies the **reference** (memory address), not the actual data — both variables point to the same Heap object:

**⑤ Code Example — Reference Copy Bug**
```js
const obj1 = { name: 'Ali' };
const obj2 = obj1;         // copies the reference, not the data

obj2.name = 'Sara';
console.log(obj1.name);    // 'Sara' — original is affected!
```
To fix this, use a shallow copy: `const obj2 = { ...obj1 }` or deep copy: `structuredClone(obj1)`.

> **Interview tip:** Arrays are objects in JS — non-primitive, stored in Heap, copied by reference.

---

## A5

### Pass by Value vs Pass by Reference

**① Passing a Primitive to a Function**
A *copy* of the value is passed — the original variable is never affected:
```js
function double(n) {
  n = n * 2;
}
let x = 5;
double(x);
console.log(x); // 5 — unchanged
```

**② Passing an Object to a Function**
The *reference address* is passed — mutations inside the function affect the original:
```js
function rename(user) {
  user.name = 'Sara';
}
const person = { name: 'Ali' };
rename(person);
console.log(person.name); // 'Sara' — original changed!
```

**③ The Key Nuance: JS passes the reference BY VALUE**
JavaScript does NOT truly pass by reference. What it does is:
- Copy the **memory address** (reference) and pass that copy to the function
- This means you CAN mutate the object's properties
- But you CANNOT reassign the variable itself and have it affect the original

**④ Proof — Reassigning inside function does NOT change original**
```js
function replaceObject(obj) {
  obj = { name: 'New Person' }; // reassigning the local copy
}
const person = { name: 'Ali' };
replaceObject(person);
console.log(person.name); // 'Ali' — original unchanged
```

**⑤ Both Cases Together**
```js
function test(obj) {
  obj.name = 'Changed';  //  mutates original (same reference)
  obj = { name: 'New' }; //  only changes local copy
}
const p = { name: 'Ali' };
test(p);
console.log(p.name); // 'Changed' — mutation worked, reassignment did not
```

> **Precise interview answer:** "Objects are not passed by reference — the *reference is passed by value*."

---

## A6

### Functions in JavaScript

**① What is a Function?**
A function is a **reusable block of code** that performs a specific task. It solves the problem of code repetition — instead of writing the same logic multiple times, you define it once and call it whenever needed.

**② Function Declaration Syntax**
```js
function functionName(parameter1, parameter2) {
  // function body
  return result;
}
```

**③ Is a Function Declaration Hoisted?**
Yes — function declarations are **fully hoisted**, including their body. You CAN call them before they appear in the code:
```js
greet(); // 'Hello!' — works because of hoisting

function greet() {
  console.log('Hello!');
}
```
This is different from function expressions (`const greet = function() {}`) which are NOT hoisted.

**④ Parameter vs Argument**
- **Parameter**: the variable name in the function definition — `function add(a, b)` — here `a` and `b` are parameters
- **Argument**: the actual value passed when calling the function — `add(3, 5)` — here `3` and `5` are arguments

**⑤ Default Return Value**
If a function has no `return` statement, or just `return;` with no value, it returns `undefined` by default.

**⑥ Real-World Example — Age Validator**
```js
function validateAge(age) {
  if (typeof age !== 'number') {
    return 'Error: age must be a number';
  }
  if (age < 18) {
    return 'Access denied: must be 18 or older';
  }
  return 'Access granted';
}

console.log(validateAge(20));   // 'Access granted'
console.log(validateAge(15));   // 'Access denied: must be 18 or older'
console.log(validateAge('hi')); // 'Error: age must be a number'
```

> **Bonus fact:** Functions are also objects in JS — `typeof function(){} === 'function'` but `function(){} instanceof Object` is `true`. They have properties like `.name` and `.length`.

---



