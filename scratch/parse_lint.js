const fs = require('fs');

try {
  const data = fs.readFileSync('scratch/lint-errors.json', 'utf8');
  const results = JSON.parse(data);
  const errors = results.filter(r => r.errorCount > 0);
  
  errors.forEach(file => {
    console.log(`\nFILE: ${file.filePath}`);
    file.messages.filter(m => m.severity === 2).forEach(m => {
      console.log(`  Line ${m.line}: ${m.message} [${m.ruleId}]`);
    });
  });
} catch (e) {
  console.log('Error parsing:', e.message);
}
