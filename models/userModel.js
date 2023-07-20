const { Schema, model } = require("mongoose");
const validator = require("validator");

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"]
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"]
  },
  fullName: String,
  gender: {
    type: String,
    enum: ["male", "female", "unset"],
    default: "unset"
  },
  dateOfBirth: String,
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      "Valid email format is required"
    ]
  },
  password: {
    type: String,
    required: [true, "Password witn at least 6 characters is required"],
    minlength: true,
    select: false
  },
  profilePhotoUrl: String,
  profilePhotoPublicId: String,
  active: {
    type: Boolean,
    default: true
  },
  lastTimeSeen: {
    type: Date,
    default: Date.now
  },
  blockList: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  blockedMe: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, { timestamps: true });

const User = model("User", UserSchema);

module.exports = User;