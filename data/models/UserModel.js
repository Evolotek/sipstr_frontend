export class UserModel {
  constructor({
    expiresIn = 0,
    userId = null,
    name = "",
    email = "",
    mobileNumber = "",
    isActive = false,
    username = "",
    role = null,
    createdAt = null,
    updatedAt = null,
    uuid = "",
  }) {
    this.expiresIn = expiresIn;
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.mobileNumber = mobileNumber;
    this.isActive = isActive;
    this.username = username;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.uuid = uuid;
  }

  // Static method to create model from Login response
  static fromLoginResponse(data) {
    return new UserModel({
      userId: data.userId,
      email: data.email,
      mobileNumber: data.mobileNumber,
      isActive: data.isActive,
    });
  }

  // Static method to create model from SignUp response
  static fromSignUpResponse(data) {
    return new UserModel({
      userId: data.userId,
      name: data.name,
      email: data.email,
      mobileNumber: data.mobileNumber,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      username: data.username,
      role: data.role,
      uuid: data.uuid,
      username: data.username,
    });
  }

  static fromStorage(data) {
    return new UserModel({
      expiresIn: data.expiresIn,
      userId: data.userId,
      name: data.name,
      email: data.email,
      mobileNumber: data.mobileNumber,
      isActive: data.isActive,
      username: data.username,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      uuid: data.uuid,
    });
  }
  static fromVerifyOtpResponse(data) {
    return new UserModel({
      userId: data.userId,
      email: data.email,
      mobileNumber: data.mobileNumber,
      isActive: data.isActive,
      expiresIn: data.expiresIn,
    });
  }

  static fromProfileResponse(data) {
    return new UserModel({
      id: data.id,
      uuid: data.uuid,
      fullName: data.fullName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      emailVerified: data.emailVerified,
      mobileVerified: data.mobileVerified,
      accountStatus: data.accountStatus,
      role: data.role?.name ?? "CUSTOMER",
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static fromStorage(data) {
    return new UserModel({
      id: data.id,
      uuid: data.uuid,
      fullName: data.fullName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      isActive: data.isActive,
      emailVerified: data.emailVerified,
      mobileVerified: data.mobileVerified,
      accountStatus: data.accountStatus,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      expiresIn: data.expiresIn,
    });
  }
}
