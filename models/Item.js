const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    coverPicture: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    category: {
      type: String,
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

itemSchema.methods.toJSON = function () {
  const post = this;
  const postObject = post.toObject();

  delete postObject.__v;

  return postObject;
};

itemSchema.pre("save", async function (next) {
  const post = this;

  next();
});

itemSchema.pre("remove", async function (next) {
  const post = this;

  // Remove Object attach to the post
  //await Task.deleteMany({ owner: post._id });

  next();
});

const Post = mongoose.model("Item", itemSchema);

module.exports = Post;
