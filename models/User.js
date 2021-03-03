import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatarUrl: {
    type: String,
    default:
      "https://lh3.googleusercontent.com/proxy/9klF-yog5dFG-zFxvuQHtDm-lRNkoiZTBHsDUNfhOr1qP-XnC7i5mycqLQWIDyg5FnuKBubBmBoztCP9oP6MPvVIdA-UnGmZnDlZT0fwpRo5rYoJcrKw8spm9fLcC4jeCScMcI2orE46m2u4rvsxvakCy0uUOwUscFjMsAP2",
  },
  facebookId: Number,
  githubId: Number,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const model = mongoose.model("User", UserSchema);

export default model;
