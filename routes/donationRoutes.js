const express = require("express");
const donationConttroller = require("./../controllers/donationController");
const router = express.Router();

router
  .route("/highest-target")
  .get(
    donationConttroller.getHighestTarget,
    donationConttroller.getAllDonations
  );

router
  .route("/")
  .get(donationConttroller.getAllDonations)
  .post(donationConttroller.createDonation);

router
  .route("/:id")
  .get(donationConttroller.getDonation)
  .patch(donationConttroller.updateDonation)
  .delete(donationConttroller.deleteDonation);

module.exports = router;
