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

// Placeholders, replaced in Ex 2 and Ex 3.
function runConteo() {
  SpreadsheetApp.getActive().toast('Conteo: not implemented yet');
}

function runAlias() {
  SpreadsheetApp.getActive().toast('Alias: not implemented yet');
}
