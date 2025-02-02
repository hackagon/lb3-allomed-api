/**
 * @todo  fetch relation data
 * @param instance
 * @param relationName  relation name that defined in relations area of model
 * @param relationFieldName  field name of relational instance
 * @param type  item (default) | collection
 * @param returnName
 */
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
      const fieldName = returnName || `${relationName}Name`
      if (!relation__instance) return { [fieldName]: null }
      return {
        [fieldName]: relation__instance.__data[relationFieldName]
      }
  }
}