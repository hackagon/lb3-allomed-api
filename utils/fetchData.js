// type = collection | item
module.exports.getRelationInstanceField = async (instance, relationName, relationFieldName, type, returnName) => {
  switch (type) {
    case "collection":
      const relation__instances = await instance[relationName].find();
      return {
        [returnName]: relation__instances
          .map(item => item.__data[relationFieldName])
          .join(", ")
      }

    case "item":
      const relation__instance = await instance[relationName].get();
      if (!relation__instance) return { [`${relationName}Name`]: null }
      return {
        [`${relationName}Name`]: relation__instance.__data[relationFieldName]
      }
  }
}