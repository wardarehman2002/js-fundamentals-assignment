// ============================================================
// B3 — calculateDiscount Function
// ============================================================

function calculateDiscount(price, userType, isMember) {

    // Rule 1: Guard clause — validate price first
    if (typeof price !== 'number' || price <= 0) {
      return 'Invalid price';
    }
  
    let finalPrice = price;
  
    // Rule 2: Admin always gets 50% off (takes priority over other discounts)
    if (userType === 'admin') {
      finalPrice = finalPrice * 0.50;
    }
    // Rule 3: price > 1000 → 20% off (only if not admin)
    else if (price > 1000) {
      finalPrice = finalPrice * 0.80;
    }
    // Rule 4: price > 500 → 10% off (only if not admin and not > 1000)
    else if (price > 500) {
      finalPrice = finalPrice * 0.90;
    }
  
    // Rule 5: Members get an ADDITIONAL 5% off (applied after above discounts)
    if (isMember === true) {
      finalPrice = finalPrice * 0.95;
    }
  
    // Rule 6: Minimum price is 1
    if (finalPrice < 1) {
      finalPrice = 1;
    }
  
    // Rule 7: Return rounded to 2 decimal places
    return parseFloat(finalPrice.toFixed(2));
  }
  
  // ---- TEST CASES ----
  
  console.log(calculateDiscount(1200, 'user', false));
  // price > 1000 → 20% off: 1200 * 0.80 = 960 → no member discount
  // Expected: 960
  
  console.log(calculateDiscount(1200, 'user', true));
  // price > 1000 → 20% off: 1200 * 0.80 = 960
  // member → 5% off: 960 * 0.95 = 912
  // Expected: 912
  
  console.log(calculateDiscount(600, 'admin', true));
  // admin → 50% off: 600 * 0.50 = 300
  // member → 5% off: 300 * 0.95 = 285
  // Expected: 285
  
  console.log(calculateDiscount(-50, 'user', false));
  // price <= 0 → 'Invalid price'
  // Expected: 'Invalid price'
  
  console.log(calculateDiscount('abc', 'user', false));
  // typeof 'abc' !== 'number' → 'Invalid price'
  // Expected: 'Invalid price'
  
  // ---- ADDITIONAL EDGE CASES ----
  
  console.log(calculateDiscount(400, 'user', false));
  // price not > 500 → no base discount, no member discount
  // Expected: 400
  
  console.log(calculateDiscount(400, 'user', true));
  // no base discount, member 5% off: 400 * 0.95 = 380
  // Expected: 380
  
  console.log(calculateDiscount(0.50, 'admin', false));
  // admin 50% off: 0.50 * 0.50 = 0.25 → below minimum of 1
  // Expected: 1