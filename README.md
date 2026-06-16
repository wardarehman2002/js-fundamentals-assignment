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


Section B:  Screenshots of output 

B1  Predict the output AND explain why — then fix all the bugs. 


<img width="659" height="245" alt="b1 js" src="https://github.com/user-attachments/assets/7c805e7d-c10a-4d13-89b3-03dfdf403971" />



B2  Write a function typeAnalyser(value) that accepts any value and returns a detailed report.


<img width="489" height="287" alt="b2 js" src="https://github.com/user-attachments/assets/9f25674c-fd83-41f9-b524-7364cbdeedf1" />

<img width="206" height="308" alt="p2" src="https://github.com/user-attachments/assets/a244c6cc-060c-48a4-8503-e5007da12bfb" />

<img width="238" height="310" alt="p3" src="https://github.com/user-attachments/assets/1183e73c-5cd3-492d-b207-f8a27b1b4610" />

<img width="206" height="311" alt="p4" src="https://github.com/user-attachments/assets/f814dc83-a091-49a8-ac2d-e1c63440a1af" />



B3  Write a function calculateDiscount(price, userType, isMember) that returns the final price after discount.


<img width="121" height="136" alt="b3 js" src="https://github.com/user-attachments/assets/6edea375-7406-4810-b8b3-84c49c04dd74" />



B4  Identify the bugs caused by pass-by-reference and shallow copy — then fix each one correctly.


<img width="472" height="172" alt="b4 js" src="https://github.com/user-attachments/assets/f7f4630c-80bd-4855-8e1e-220bbff6f845" />



B5  Build a pure function library — functions that never mutate inputs.


<img width="345" height="169" alt="b5 js" src="https://github.com/user-attachments/assets/712cc2f8-80a5-4d93-a9d5-8b7981048b66" />



Section C:  Scenario-Based Problem Solving

C1  E-Commerce Product Manager — Shopping Cart System


<img width="247" height="247" alt="c1 js" src="https://github.com/user-attachments/assets/0b3db524-1df7-4e1e-a0e7-038cb049fe41" />

<img width="268" height="110" alt="c1p2" src="https://github.com/user-attachments/assets/9b05593d-8604-440d-9757-7537837a7f09" />



C2  User Registration System — Validation Engine


<img width="434" height="192" alt="c2 js" src="https://github.com/user-attachments/assets/45e07094-c01b-4b4f-92a0-be9d0c39ec17" />

<img width="343" height="200" alt="c2p2" src="https://github.com/user-attachments/assets/fe457086-1553-4acb-9c47-98bb65ac61d1" />

<img width="437" height="258" alt="c2p3" src="https://github.com/user-attachments/assets/be9aa91d-56a1-4270-a115-287f53c2d1a2" />

<img width="425" height="265" alt="c2p4" src="https://github.com/user-attachments/assets/e5da61e9-4e51-4ff9-b2fc-164ee28dc217" />

<img width="276" height="60" alt="c2p5" src="https://github.com/user-attachments/assets/7559a0b6-627c-425f-adba-1d4b6c5285a2" />



C3  Student Grade Management System — Report Generator


<img width="294" height="290" alt="c3 js" src="https://github.com/user-attachments/assets/c7ede8de-8c74-4427-ac24-400fc8cd4b8f" />

<img width="193" height="310" alt="c3p2" src="https://github.com/user-attachments/assets/653c411f-cd10-4f64-8c78-b211a7698d28" />

<img width="293" height="310" alt="c3p3" src="https://github.com/user-attachments/assets/1a58beb3-0a16-429e-8509-a6abc121a9b7" />

<img width="182" height="310" alt="c3p4" src="https://github.com/user-attachments/assets/cd97356b-d6e8-44d4-9e43-4cd033befa28" />

<img width="172" height="239" alt="c3p5" src="https://github.com/user-attachments/assets/6da18b2d-e432-4745-a55e-e7825af09061" />

<img width="183" height="266" alt="c3p6" src="https://github.com/user-attachments/assets/e68ceb78-99cb-47b3-bd38-ee4e150eb2f1" />

<img width="447" height="268" alt="c3p7" src="https://github.com/user-attachments/assets/1a132593-305c-407f-8768-1f1a52f762b4" />

<img width="182" height="110" alt="c3p8" src="https://github.com/user-attachments/assets/a7c3e198-887c-4983-b3c3-15c2ef344a67" />








