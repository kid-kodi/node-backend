const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

categorySchema.methods.toJSON = function () {
  const category = this;
  const categoryObject = category.toObject();

  delete categoryObject.createdAt;
  delete categoryObject.updatedAt;
  delete categoryObject.__v;

  return categoryObject;
};

categorySchema.pre("save", async function (next) {
  const category = this;

  next();
});

categorySchema.pre("remove", async function (next) {
  const category = this;

  // Remove Object attach to the category
  //await Task.deleteMany({ owner: category._id });

  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
