const csv = require('csv-parser');
const fs = require('fs');
console.log(__dirname)

fs.createReadStream(__dirname + '/therapy.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });