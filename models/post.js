const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  published: { type: Boolean },
});


PostSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/blog/post/${this._id}`;
});

// Export model
module.exports = mongoose.model("Post", PostSchema);