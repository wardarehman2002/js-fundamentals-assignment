// ============================================================
// C2 — User Registration System — Validation Engine
// ============================================================

function validateUser(data) {
    const errors = [];
  
    // ① Name validation — must be a non-empty string
    if (typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('Name cannot be empty');
    }
  
    // ② Email validation — must be a string containing '@' and '.'
    if (typeof data.email !== 'string' || !data.email.includes('@') || !data.email.includes('.')) {
      errors.push('Invalid email format');
    }
  
    // ③ Age validation — may arrive as a string from a form, coerce to number
    const coercedAge = Number(data.age);
    if (isNaN(coercedAge)) {
      // Number('17abc') → NaN — not coercible
      errors.push('Age must be a valid number');
    } else if (coercedAge < 13 || coercedAge > 120) {
      errors.push('Age must be between 13 and 120');
    }
  
    // ④ Password validation — string, minimum 8 characters
    if (typeof data.password !== 'string' || data.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
  
    // ⑤ Role validation — if provided must be one of the allowed values
    const allowedRoles = ['admin', 'editor', 'user'];
    // Use ?? (nullish coalescing) — defaults to 'user' only if role is null or undefined
    const assignedRole = data.role ?? 'user';
  
    if (!allowedRoles.includes(assignedRole)) {
      errors.push(`Role must be 'admin', 'editor', or 'user'`);
    }
  
    // ---- Return result ----
    if (errors.length > 0) {
      return { valid: false, errors };
    }
  
    // Build cleaned user object — do NOT mutate the original data object
    return {
      valid: true,
      user: {
        name: data.name.trim(),
        email: data.email,
        age: coercedAge,        // store as number even if it came as string
        password: data.password,
        role: assignedRole,
      },
    };
  }
  
  
  // ============================================================
  // TEST CASES
  // ============================================================
  
  console.log('--- Test 1: Valid user, age as string, no role provided ---');
  console.log(validateUser({ name: 'Ali', email: 'ali@test.com', age: '25', password: 'pass1234' }));
  // Expected: { valid: true, user: { name:'Ali', email:'ali@test.com', age:25, password:'pass1234', role:'user' } }
  // age '25' is coerced to 25 
  // role defaults to 'user' via ?? operator 
  
  console.log('\n--- Test 2: Multiple validation errors ---');
  console.log(validateUser({ name: '', email: 'notanemail', age: 10, password: 'abc' }));
  // Expected: { valid: false, errors: ['Name cannot be empty', 'Invalid email format', 'Age must be between 13 and 120', 'Password must be at least 8 characters'] }
  
  console.log('\n--- Test 3: Valid user with admin role ---');
  console.log(validateUser({ name: 'Sara', email: 'sara@x.io', age: 30, password: 'secure99', role: 'admin' }));
  // Expected: { valid: true, user: { ...role: 'admin' } }
  
  console.log('\n--- Test 4: Age that cannot be coerced (17abc) ---');
  console.log(validateUser({ name: 'X', email: 'x@x.com', age: '17abc', password: 'hello123' }));
  // Expected: { valid: false, errors: ['Age must be a valid number'] }
  // Number('17abc') → NaN 
  
  // ---- Additional edge cases ----
  
  console.log('\n--- Test 5: Invalid role ---');
  console.log(validateUser({ name: 'Bilal', email: 'b@b.com', age: 22, password: 'mypassword', role: 'superuser' }));
  // Expected: { valid: false, errors: ["Role must be 'admin', 'editor', or 'user'"] }
  
  console.log('\n--- Test 6: Missing fields (undefined) ---');
  console.log(validateUser({ name: 'Zara' }));
  // name valid, email/password/age all undefined → multiple errors
  
  // ---- Purity proof — original data object is NOT mutated ----
  console.log('\n--- Purity check ---');
  const rawData = { name: 'Ali', email: 'ali@test.com', age: '25', password: 'pass1234' };
  const result = validateUser(rawData);
  console.log('rawData.age after validateUser:', rawData.age); // '25'  still a string — unchanged
  console.log('result.user.age:', result.user.age);             // 25  number in cleaned copy