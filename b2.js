// ============================================================
// B2 — typeAnalyser Function
// ============================================================

function typeAnalyser(value) {
    return {
      input: value,
      typeofResult: typeof value,
      isArray: Array.isArray(value),
      isNull: value === null,          // typeof null is 'object' — must check explicitly
      toNumber: Number(value),
      toBoolean: Boolean(value),
      toString: String(value),
    };
  }
  
  // ---- TEST CALLS ----
  
  console.log('--- typeAnalyser(42) ---');
  console.log(typeAnalyser(42));
  // typeofResult: 'number', isArray: false, isNull: false
  // toNumber: 42, toBoolean: true, toString: '42'
  
  console.log('--- typeAnalyser("hello") ---');
  console.log(typeAnalyser('hello'));
  // typeofResult: 'string', toNumber: NaN, toBoolean: true, toString: 'hello'
  
  console.log('--- typeAnalyser(null) ---');
  console.log(typeAnalyser(null));
  // typeofResult: 'object' (famous JS bug!), isNull: true
  // toNumber: 0, toBoolean: false, toString: 'null'
  
  console.log('--- typeAnalyser([]) ---');
  console.log(typeAnalyser([]));
  // typeofResult: 'object', isArray: true, isNull: false
  // toNumber: 0, toBoolean: true  ← IMPORTANT: empty array is TRUTHY!
  // toString: ''
  
  console.log('--- typeAnalyser(undefined) ---');
  console.log(typeAnalyser(undefined));
  // typeofResult: 'undefined', toNumber: NaN, toBoolean: false, toString: 'undefined'
  
  console.log('--- typeAnalyser(true) ---');
  console.log(typeAnalyser(true));
  // typeofResult: 'boolean', toNumber: 1, toBoolean: true, toString: 'true'
  
  console.log('--- typeAnalyser(0) ---');
  console.log(typeAnalyser(0));
  // toBoolean: false ← 0 is FALSY!
  // toNumber: 0, toString: '0'
  
  console.log('--- typeAnalyser("") ---');
  console.log(typeAnalyser(''));
  // toBoolean: false ← empty string is FALSY!
  // toNumber: 0, toString: ''
  
  // ---- TRUTHY/FALSY SUMMARY ----
  // Falsy values: false, 0, '', null, undefined, NaN
  // EVERYTHING else is truthy — including [], {}, '0', -1