const { Schema, model } = require("mongoose");

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  currentResidence: {
    country: String,
    state: String,
    city: String,
    from: String
  },
  previousResidences: [
    {
      country: String,
      state: String,
      city: String,
      from: String,
      to: String
    }
  ],
  highSchool: {
    name: String,
    country: String,
    state: String,
    city: String,
    status: {
      type: String,
      enum: ["studying", "finished"]
    },
    graduateDate: String
  },
  colleges: [
    {
      name: String,
      country: String,
      state: String,
      city: String,
      status: {
        type: String,
        enum: ["studying", "finished"]
      },
      graduateDate: String
    }
  ],
  educationOther: [
    {
      name: String,
      country: String,
      state: String,
      city: String,
      status: {
        type: String,
        enum: ["studying", "finished"]
      },
      graduateDate: String
    }
  ], 
  jobs: [{
    role: String,
    company: String,
    country: String,
    state: String,
    city: String,
    from: String
  }],
  previousJobs: [
    {
      role: String,
      company: String,
      country: String,
      state: String,
      city: String,
      from: String,
      to: String
    }
  ]
});

const Profile = model("Profile", ProfileSchema);

module.exports = Profile;