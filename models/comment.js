const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  text: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
});


CommentSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/blog/comment/${this._id}`;
});

// Export model
module.exports = mongoose.model("Comment", CommentSchema);