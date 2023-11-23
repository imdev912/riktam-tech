import { faker } from '@faker-js/faker';
import User, { IUser } from "../models/user";

const createRandomUser = (): IUser => {
  const user = new User({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    image: faker.image.avatar(),
    password: faker.internet.password(),
    about: faker.lorem.sentence()
  });

  return user;
}

const createRandomUsers = (count: number): IUser[] => {
  return faker.helpers.multiple(createRandomUser, { count: count });
}

export { createRandomUser, createRandomUsers };