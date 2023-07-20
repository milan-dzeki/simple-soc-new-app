const { Schema, model } = require("mongoose");

const FriendsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  sentPendingRequests: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  receivedPendingRequests: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }]
});

const Friends = model("Friends", FriendsSchema);

module.exports = Friends;