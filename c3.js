// ============================================================
// C3 — Student Grade Management System — Report Generator
// ============================================================

// Given data — do NOT modify
const students = [
    { name: 'Asad',   scores: [85, 90, 78, 92],       present: true  },
    { name: 'Sara',   scores: [70, 65, '80', 75],      present: true  },
    { name: 'Ali',    scores: [55, 60, 50, null],       present: false },
    { name: 'Fatima', scores: [95, 98, 100, 92],        present: true  },
    { name: 'Umar',   scores: [],                       present: true  },
  ];
  
  
  // ============================================================
  // Function 1: getAverage(scores)
  // ============================================================
  // - Skip null values
  // - Coerce string values to number using Number()
  // - Return 0 if no valid scores
  // - Return average rounded to 1 decimal place
  
  function getAverage(scores) {
    // Filter and coerce: keep only values that are valid numbers after coercion
    const validScores = scores
      .map(score => Number(score))           // coerce everything — null→0, '80'→80
      .filter((score, i) => {
        // Skip original null values (Number(null) gives 0 which is misleading)
        if (scores[i] === null) return false;
        // Skip NaN (non-coercible values)
        return !isNaN(score);
      });
  
    if (validScores.length === 0) return 0;
  
    const sum = validScores.reduce((total, score) => total + score, 0);
    return parseFloat((sum / validScores.length).toFixed(1));
  }
  
  
  // ============================================================
  // Function 2: getGrade(average)
  // ============================================================
  
  function getGrade(average) {
    if (average >= 90) return 'A+';
    if (average >= 80) return 'A';
    if (average >= 70) return 'B';
    if (average >= 60) return 'C';
    if (average >= 50) return 'D';
    return 'F';
  }
  
  
  // ============================================================
  // Function 3: generateReport(students)
  // ============================================================
  // Returns a NEW array — does NOT mutate the students array
  
  function generateReport(students) {
    return students.map(student => {
      // student is passed by reference — we read from it but never write to it
      const average = getAverage(student.scores);
      const grade = getGrade(average);
      const status = student.present ? 'present' : 'absent';
      const passed = average >= 60 && student.present === true;
  
      // Return a brand new object — original student object is untouched
      return {
        name: student.name,
        average,
        grade,
        status,
        passed,
      };
    });
  }
  
  
  // ============================================================
  // Function 4: getSummary(report)
  // ============================================================
  
  function getSummary(report) {
    const total = report.length;
    const passed = report.filter(r => r.passed).length;
    const failed = total - passed;
  
    // Find top student — highest average
    const topStudent = report.reduce(
      (top, current) => (current.average > top.average ? current : top),
      report[0]
    ).name;
  
    // Class average — average of all student averages
    const sumOfAverages = report.reduce((sum, r) => sum + r.average, 0);
    const classAverage = parseFloat((sumOfAverages / total).toFixed(1));
  
    return { total, passed, failed, topStudent, classAverage };
  }
  
  
  // ============================================================
  // RUN & OUTPUT
  // ============================================================
  
  // Prove students array is unchanged BEFORE the call
  console.log('--- students BEFORE generateReport ---');
  console.log(JSON.stringify(students, null, 2));
  
  const report = generateReport(students);
  
  // Prove students array is unchanged AFTER the call
  console.log('\n--- students AFTER generateReport ---');
  console.log(JSON.stringify(students, null, 2));
  //  Should be identical to before — no mutation occurred
  
  // Print the full report
  console.log('\n--- REPORT ---');
  report.forEach(student => {
    console.log(
      `${student.name.padEnd(7)}: avg=${student.average}, grade='${student.grade}', ` +
      `status='${student.status}', passed=${student.passed}`
    );
  });
  
  // Expected:
  // Asad   : avg=86.3, grade='A',  status='present', passed=true
  // Sara   : avg=72.5, grade='B',  status='present', passed=true   (string '80' coerced)
  // Ali    : avg=55.0, grade='D',  status='absent',  passed=false  (absent + null skipped)
  // Fatima : avg=96.3, grade='A+', status='present', passed=true
  // Umar   : avg=0,   grade='F',  status='present', passed=false  (empty scores)
  
  console.log('\n--- SUMMARY ---');
  const summary = getSummary(report);
  console.log(summary);
  // Expected: { total: 5, passed: 3, failed: 2, topStudent: 'Fatima', classAverage: 62.0 }
  
  
  // ============================================================
  // VERIFICATION — Type checks used in getAverage
  // ============================================================
  console.log('\n--- Coercion checks ---');
  console.log(Number('80'));   // 80    string coerced to number
  console.log(Number(null));   // 0    ← this is why we skip null before coercing
  console.log(Number(''));     // 0    ← same issue with empty string
  console.log(Number('abc'));  // NaN  ← not coercible
  console.log(typeof Number('80')); // 'number'