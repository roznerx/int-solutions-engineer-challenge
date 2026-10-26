// Reference copy. The live code is bound to the Google Sheet (Extensions → Apps Script).

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Validaciones')
    .addItem('Conteo', 'runConteo')
    .addItem('Alias', 'runAlias')
    .addToUi();
}

// Simple trigger: runs on every user edit. Writes made by a script don't fire onEdit,
// so writing B1 here can't loop.
function onEdit(e) {
  e.range.getSheet().getRange('B1')
    .setValue(new Date())
    .setNumberFormat('yyyy-mm-dd hh:mm:ss');
}

// Longest contiguous run of strictly increasing letters that contains a vowel.
// A run with no vowel has no part with one, so checking maximal runs is enough.
function securityCount(hash) {
  // Step 1: cut the hash into runs.
  const runs = [];
  let current = hash[0] || '';

  for (let i = 1; i < hash.length; i++) {
    if (hash[i] > hash[i - 1]) {
      current += hash[i]; // still going forward: add to the current run.
    } else {
      runs.push(current); // went backwards: close the run.
      current = hash[i];  // start a new run  with this letter.
    }
  }
  runs.push(current); // close the last run.

  // Step 2: keep runs with a vowel, return the longest length.
  return runs
    .filter(run => /[aeiou]/.test(run))
    .reduce((max, run) => Math.max(max, run.length), 0);
}

function runConteo() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const numRows = sheet.getLastRow() - 3;
  if (numRows < 1) return;
  const hashes = sheet.getRange(4, 4, numRows, 1).getValues();
  const counts = hashes.map(([hash]) => [securityCount(String(hash))]);
  sheet.getRange(4, 5, numRows, 1).setValues(counts);
}

function testSecurityCount() {
  Logger.log(securityCount('acbcrxorzeh')); // expected 3.
}

// Unique random aliases: dedupe the API names, shuffle them, give one to each employee.
function runAlias() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const numRows = sheet.getLastRow() - 3;
  if (numRows < 1) return;

  const response = UrlFetchApp.fetch('https://hp-api.onrender.com/api/characters');
  const characters = JSON.parse(response.getContentText());
  const names = [...new Set(characters.map(c => String(c.name || '').trim()).filter(Boolean))];

  if (names.length < numRows) {
    throw new Error(`Only ${names.length} unique names for ${numRows} employees.`);
  }

  // Shuffle by sorting with a random comparator.
  names.sort(() => Math.random() - 0.5);

  const aliases = names.slice(0, numRows).map(name => [name]);
  sheet.getRange(4, 3, numRows, 1).setValues(aliases);
}
