const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    coverPicture: {
      type: String,
    },
    shopName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    author: {
      type: String,
    },
    category: {
      type: Array,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["private", "public"],
      },
      default: "private",
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

shopSchema.methods.toJSON = function () {
  const shop = this;
  const shopObject = shop.toObject();

  delete shopObject.__v;

  return shopObject;
};

shopSchema.pre("save", async function (next) {
  const shop = this;

  next();
});

shopSchema.pre("remove", async function (next) {
  const shop = this;

  // Remove Object attach to the shop
  //await Task.deleteMany({ owner: shop._id });

  next();
});

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
