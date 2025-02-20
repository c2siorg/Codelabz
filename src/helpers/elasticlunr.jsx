import elasticlunr from "elasticlunr";

export default class Elasticlunr {
  constructor(key, ...fields) {
    this.elasticlunr = elasticlunr();
    this.elasticlunr.setRef(key);
    fields.forEach(field => {
      this.elasticlunr.addField(field);
    });
  }

  addDocToIndex(doc) {
    try {
      this.elasticlunr.addDoc(doc);
    } catch (error) {
      console.error("Error adding document to index:", error);
    }
  }

  searchFromIndex(query, options = { expand: true }) {
    try {
      if (typeof query !== "string") {
        throw new Error("Query must be a string.");
      }

      return this.elasticlunr.search(query, options);
    } catch (error) {
      console.error("Error searching the index:", error);
      return [];
    }
  }

  // To get a specific document by its reference key
  getDocById = id => {
    return this.elasticlunr.documentStore.getDoc(id);
  };

  // To get all documents in the index
  getAllDocs = () => {
    return Object.values(this.elasticlunr.documentStore.docs);
  };
}
