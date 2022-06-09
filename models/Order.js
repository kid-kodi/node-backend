const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      trim: true,
    },
    totalAmount: {
      type: String,
      required: true,
    },
    totalItems: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "partial", "paid"],
      },
      default: "pending",
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

postSchema.methods.toJSON = function () {
  const post = this;
  const postObject = post.toObject();

  delete postObject.__v;

  return postObject;
};

postSchema.pre("save", async function (next) {
  const post = this;

  next();
});

postSchema.pre("remove", async function (next) {
  const post = this;

  // Remove Object attach to the post
  //await Task.deleteMany({ owner: post._id });

  next();
});

const Post = mongoose.model("Order", postSchema);

module.exports = Post;
