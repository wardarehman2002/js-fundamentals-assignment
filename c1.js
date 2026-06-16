// ============================================================
// C1 — E-Commerce Shopping Cart System
// ============================================================


// ============================================================
// ORIGINAL BUGGY CODE — Analysis (do not run this block)
// ============================================================

// BUG LINE: var cartB = cartA;
// cartB is NOT a copy — it holds the SAME reference as cartA.
// Both variables point to the exact same object in memory (Heap).

var cartA = { owner: 'Asad', items: [{ name: 'Laptop', price: 150000 }], total: 150000 };
var cartB = cartA; //  BUG: reference copy, not a data copy

// Tab 2 user adds an item — but this modifies the SHARED object
cartB.items.push({ name: 'Mouse', price: 2500 });
cartB.total = cartB.total + 2500;

// TASK 1: Predicted output of all console.log calls:

console.log('Tab 1 cart items:', cartA.items.length);
// Output: 2 ← BUG! cartA and cartB are the same object,
// so adding to cartB also added to cartA. Tab 1 now has 2 items.

console.log('Tab 1 total:', cartA.total);
// Output: 152500 ← BUG! Same reason — total was modified on the shared object.

// BUG LINE: function applyPromo — mutates the original object
function applyPromo(cart, discount) {
  cart.total = cart.total - discount;    //  BUG: directly mutates the input object
  cart.promoApplied = true;
  return cart;
}

const originalCart = { owner: 'Sara', items: ['Book'], total: 500 };
const discountedCart = applyPromo(originalCart, 50);

console.log('Original total:', originalCart.total);
// Output: 450 ← BUG! The original object was mutated inside the function.
// originalCart.total should still be 500 — but it was changed.


// ============================================================
// TASK 2: Bug Summary
// ============================================================
// Bug 1 — var cartB = cartA
//   Using assignment to "copy" an object only copies the memory reference.
//   Both variables now point to the same object. Any change via cartB affects cartA.

// Bug 2 — cartB.items.push(...)
//   Even if we had done a shallow copy ({ ...cartA }), items is a nested array.
//   Shallow copy only copies the top level — items would still be shared.
//   Need a DEEP copy to truly separate nested data.

// Bug 3 — cart.total = cart.total - discount (inside applyPromo)
//   The function directly mutates the object passed in.
//   JS passes the reference by value — mutations via the parameter affect the original.
//   A pure function should return a new object instead.

// Bug 4 — var keyword used throughout
//   var is function-scoped and can be accidentally re-declared.
//   Modern JS should use const or let.


// ============================================================
// TASK 3: Fixed Version
// ============================================================

// Use structuredClone for a true deep copy (handles nested arrays/objects)
const cartAFixed = {
  owner: 'Asad',
  items: [{ name: 'Laptop', price: 150000 }],
  total: 150000,
};

const cartBFixed = structuredClone(cartAFixed); //  deep copy — completely independent

// Tab 2 adds an item — only affects cartBFixed
cartBFixed.items.push({ name: 'Mouse', price: 2500 });
cartBFixed.total = cartBFixed.total + 2500;

console.log('\n--- FIXED: Cart separation ---');
console.log('Tab 1 items:', cartAFixed.items.length); // 1  unchanged
console.log('Tab 1 total:', cartAFixed.total);         // 150000  unchanged
console.log('Tab 2 items:', cartBFixed.items.length); // 2  separate
console.log('Tab 2 total:', cartBFixed.total);         // 152500  separate

// Fixed applyPromo — pure function, does NOT mutate original
function applyPromoFixed(cart, discount) {
  return {
    ...cart,
    items: [...cart.items],        // shallow copy of items array
    total: cart.total - discount,
    promoApplied: true,
  };
}

const saraCart = { owner: 'Sara', items: ['Book'], total: 500 };
const saraDiscounted = applyPromoFixed(saraCart, 50);

console.log('\n--- FIXED: applyPromo ---');
console.log('Original total:', saraCart.total);       // 500  unchanged
console.log('Discounted total:', saraDiscounted.total); // 450  new object
console.log('Promo applied:', saraDiscounted.promoApplied); // true


// ============================================================
// TASK 4: addItem function — pure, returns new cart
// ============================================================

function addItem(cart, item) {
  return {
    ...cart,
    items: [...cart.items, item],
    total: cart.total + item.price,
  };
}

const shopCart = { owner: 'Umar', items: [], total: 0 };

console.log('\n--- TASK 4: addItem ---');
console.log('Before addItem — items:', shopCart.items.length, 'total:', shopCart.total);

const cartWithLaptop = addItem(shopCart, { name: 'Laptop', price: 80000 });
const cartWithMouse  = addItem(cartWithLaptop, { name: 'Mouse', price: 1500 });

console.log('After addItem — shopCart items:', shopCart.items.length); // 0  original unchanged
console.log('After addItem — shopCart total:', shopCart.total);        // 0  original unchanged
console.log('cartWithMouse items:', cartWithMouse.items.length);       // 2
console.log('cartWithMouse total:', cartWithMouse.total);              // 81500