export interface Profile {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  profilePicture?: string;
  roles: string[];
}

export interface ProfileUpdateRequest {
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  profilePicture?: string;
  userPreferences?: any;
}

export interface UpdatePasswordRequest {
  oldPassword?: string;
  newPassword: string;
}

export interface UpdateEmailRequest {
  newEmail: string;
}

export interface UpdatePhoneRequest {
  newPhone: string;
}
