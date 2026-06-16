// ============================================================
// B4 — Find & Fix Reference/Shallow Copy Bugs
// ============================================================


// ============================================================
// BUG 1: Cart Duplication Bug
// ============================================================

const cart1 = { items: ['JS Book', 'React Book'], total: 150 };
const cart2 = { ...cart1 }; // spread does a SHALLOW copy

cart2.items.push('Node Book');
console.log(cart1.items);
// BUG OUTPUT: ['JS Book', 'React Book', 'Node Book']
// WHY IT'S WRONG: Spread {...cart1} creates a new object BUT only copies
// top-level properties by reference. The 'items' array is an object (non-primitive)
// so both cart1.items and cart2.items point to the SAME array in memory.
// Pushing to cart2.items also pushes to cart1.items!

// ---- FIXED VERSION ----
const cart1Fixed = { items: ['JS Book', 'React Book'], total: 150 };
const cart2Fixed = {
  ...cart1Fixed,
  items: [...cart1Fixed.items], // create a new array for items separately
};

cart2Fixed.items.push('Node Book');
console.log('Bug 1 Fix — cart1 items:', cart1Fixed.items);
// ['JS Book', 'React Book']  original untouched
console.log('Bug 1 Fix — cart2 items:', cart2Fixed.items);
// ['JS Book', 'React Book', 'Node Book']  only cart2 changed

// Alternative fix using structuredClone (deep copy):
const cart2DeepCopy = structuredClone(cart1Fixed);


// ============================================================
// BUG 2: Function Mutating Original Object
// ============================================================

function applyTax(order) {
  order.total = order.total * 1.17; // MUTATES the original object!
  return order;
}

const myOrder = { id: 1, total: 100 };
const taxedOrder = applyTax(myOrder);
console.log(myOrder.total);
// BUG OUTPUT: 117
// WHY IT'S WRONG: Objects are passed by reference (their memory address is passed).
// When we write order.total = ..., we are mutating the SAME object that myOrder points to.
// applyTax returns the same object reference — both myOrder and taxedOrder point to it.

// ---- FIXED VERSION ----
function applyTaxFixed(order) {
  // Return a NEW object — do not touch the original
  return { ...order, total: order.total * 1.17 };
}

const myOrderFixed = { id: 1, total: 100 };
const taxedOrderFixed = applyTaxFixed(myOrderFixed);

console.log('Bug 2 Fix — original total:', myOrderFixed.total);   // 100  unchanged
console.log('Bug 2 Fix — taxed total:',   taxedOrderFixed.total); // 117  new object


// ============================================================
// BUG 3: Config Reset That Doesn't Work
// ============================================================

const defaultConfig = { theme: 'dark', lang: 'en', nested: { fontSize: 14 } };

function resetConfig(config) {
  config = { ...defaultConfig }; // BUG: only reassigns local 'config' variable
  config.nested.fontSize = 14;
  // This does NOT affect the original appConfig passed in!
  // AND: config.nested still points to defaultConfig.nested (shallow copy bug again)
}

const appConfig = { theme: 'light', lang: 'ur', nested: { fontSize: 20 } };
resetConfig(appConfig);

console.log(appConfig.theme);            // 'light' ← NOT reset (reassignment didn't work)
console.log(appConfig.nested.fontSize);  // 20 ← NOT reset

// WHY: JS passes the reference by VALUE. Inside the function, config = {...defaultConfig}
// creates a new local binding for 'config' — it does not change what appConfig points to.
// The original appConfig object in the outer scope is completely unaffected.

// ---- FIXED VERSION ----
function resetConfigFixed(config) {
  // Return a deep clone — caller must assign the return value
  return structuredClone(defaultConfig);
}

let appConfigFixed = { theme: 'light', lang: 'ur', nested: { fontSize: 20 } };
appConfigFixed = resetConfigFixed(appConfigFixed); // must reassign outside

console.log('Bug 3 Fix — theme:', appConfigFixed.theme);                   // 'dark' 
console.log('Bug 3 Fix — fontSize:', appConfigFixed.nested.fontSize);      // 14 