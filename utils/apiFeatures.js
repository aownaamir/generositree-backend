class APIFeatures {
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }

  filter() {
    // Filtering
    let queryObj = { ...this.queryString };
    const excludeFields = ["sort", "fields", "limit", "page"];
    excludeFields.forEach((field) => delete queryObj[field]);
    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne)\b/g,
      (match) => `$${match}`
    );
    const newQueryObject = JSON.parse(queryStr);
    this.query = this.query.find(newQueryObject);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("targetAmount");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 20;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
