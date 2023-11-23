interface UserType {
  _id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  about: string;
  isAdmin: boolean;
  token: string;
}

export default UserType;