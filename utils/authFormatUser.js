const authFormatUser = (user) => {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
    email: user.email,
    profilePhotoUrl: user.profilePhotoUrl,
    blockList: user.blockList,
    blockedMe: user.blockedMe,
    createdAt: user.createdAt
  };
};

module.exports = authFormatUser;