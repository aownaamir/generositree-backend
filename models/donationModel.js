const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const donationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A donation must have a name"],
      trim: true,
      unique: [true, "Donation name must be unique"],
      maxLength: [30, "Donation name must have at least 30 characters"],
    },
    description: {
      type: String,
      trim: true,
    },
    img: String,
    verified: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, "A donation must have a target amount"],
    },
    amountRaised: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: new Date(),
      // .toLocaleString("en-US", {
      //   dateStyle: "medium",
      //   timeStyle: "short",
      //   timeZone: "UTC",
      // })
      set: (val) => {
        const parsedDate = new Date(val);
        if (isNaN(parsedDate)) {
          throw new Error(
            "Invalid date format. Please use a valid readable format like 'Jan 22, 2025, 11:36 AM'."
          );
        }
        return parsedDate.toISOString();
      },
    },
    endDate: {
      type: Date,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      default: "regular",
      enum: {
        values: ["regular", "daily", "weekly", "monthly", "yearly"],
        message:
          "Donation type may be either regular, daily, weekly, monthly or yearly",
      },
    },
    slug: String,
  },
  {
    toJSON: { virtuals: true, transform: formatDates },
    toObject: { virtuals: true, transform: formatDates },
  }
);

function formatDates(doc, ret) {
  if (ret.startDate) {
    ret.startDate = new Date(ret.startDate).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    });
  }
  if (ret.endDate) {
    ret.endDate = new Date(ret.endDate).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    });
  }
  return ret;
}

donationSchema.virtual("timeLeft").get(function () {
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  const difference = new Date(end - start);
  const hoursLeft = Math.floor(difference / (1000 * 60 * 60));
  const daysLeft = Math.floor(difference / (1000 * 60 * 60 * 24));
  if (difference <= 0) return "Time has ended";
  if (daysLeft >= 1) return `${daysLeft} days left`;
  return `${hoursLeft} hour(s) left`;
});

donationSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

donationSchema.pre("save", function (next) {
  if (!this.endDate) {
    const givenDate = new Date(this.startDate); //copy by value
    const thirtyDaysAfter = givenDate.setDate(givenDate.getDate() + 30); //gives in milliseconds
    this.endDate = new Date(thirtyDaysAfter);
  }
  next();
});

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
