const Donation = require("../models/donationModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllDonations = async (req, res) => {
  try {
    const features = new APIFeatures(Donation.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const donations = await features.query;

    // let queryObj = { ...req.query };

    // const excludeFields = ["sort", "fields", "limit", "page"];
    // excludeFields.forEach((field) => delete queryObj[field]);

    // let queryString = JSON.stringify(queryObj);
    // queryString = queryString.replace(
    //   /\b(gte|gt|lte|lt|ne)\b/g,
    //   (match) => `$${match}`
    // );
    // const newQueryObject = JSON.parse(queryString);

    // let query = Donation.find(newQueryObject);

    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort("targetAmount");
    // }

    // if (req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ");
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }

    // // if (req.query.page || req.query.limit) {
    // const page = req.query.page || 1;
    // const limit = req.query.limit || 20;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);
    // // }

    // const donations = await query;

    res.status(200).json({
      status: "success",
      results: donations.length,
      data: { donations },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getDonation = async (req, res) => {
  try {
    const donations = await Donation.findById(req.params.id);
    res.status(200).json({
      status: "success",
      donations,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createDonation = async (req, res) => {
  try {
    const donation = await Donation.create(req.body);
    res.json({ status: "success", data: { donation } });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({
      status: "success",
      data: { donation },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getHighestTarget = async (req, res, next) => {
  req.query.sort = "-targetAmount";
  req.query.limit = 1;
  next();
};
