const app = require('../../server/server');
const csv = require('csv-parser');
const getStream = require('get-stream')
const fs = require('fs');

module.exports.generateTherapy = async (req, res, next) => {
  const Model__Therapy = app.models.Therapy;

  const data = await getStream.array(
    fs.createReadStream('mockup/therapy.csv')
      .pipe(csv())
  )

  await data.forEach(async item => {
    const inst = await Model__Therapy.create({
      therapyName: item.name
    })
  })
  res.status(200).json({ message: "Generate data successfully" })
}

module.exports.generateCategory = async (req, res, next) => {
  const Model__Category = app.models.Category;

  const data = await getStream.array(
    fs.createReadStream('mockup/category.csv')
      .pipe(csv())
  )

  await data.forEach(async item => {
    const inst = await Model__Category.create({
      categoryName: item.name
    })
  })
  res.status(200).json({ message: "Generate data successfully" })
}