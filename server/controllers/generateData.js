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
    await Model__Therapy.create({
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
    await Model__Category.create({
      categoryName: item.name
    })
  })
  res.status(200).json({ message: "Generate data successfully" })
}

module.exports.generateColor = async (req, res, next) => {
  const Model__Color = app.models.Color;

  const data = await getStream.array(
    fs.createReadStream('mockup/color.csv')
      .pipe(csv())
  )

  await data.forEach(async item => {
    try {
      const inst = await Model__Color.create({
        colorName: item.color_name,
        colorCode: item.color_code
      })
    } catch (error) {
      console.log(error)
    }
  })
  res.status(200).json({ message: "Generate data successfully" })
}