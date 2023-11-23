import supertest from "supertest";
import { connectDB, disconnectBD } from "../../config/db";
import { createRandomUsers } from "../__data__/user.data";
import app from "../app";
import User, { IUser } from "../models/user";

const request = supertest(app);

interface MockUser extends Partial<IUser> {
  token?: string;
}

// Create mock users
const mockUsers: MockUser[] = createRandomUsers(3);

describe("User Controller Tests", () => {
  beforeAll(async () => {
    // Connect to the database before each test
    await connectDB();
  });

  afterAll(async () => {
    await Promise.all([
      User.deleteMany({ _id: { $in: mockUsers.map(user => user._id) } })
    ]);

    // Disconnect from the database after each test
    await disconnectBD();
  });

  // Insert mock users into the database
  describe("register user", () => {
    it('should register all mock users with valid data', async () => {
      for (const [idx, user] of mockUsers.entries()) {
        const { name, email, password, image, about } = user;

        // Send a POST request to /api/user/register with the user object
        const response = await request.post('/api/user/register')
          .send({
            name,
            email,
            password,
            image,
            about
          });

        // Expect the response to be successful (status code 201)
        expect(response.status).toBe(201);

        const registeredUser = response.body;

        // Expect the registeredUser to contain id and token
        expect(registeredUser).toHaveProperty("_id");
        expect(registeredUser).toHaveProperty("token");

        mockUsers[idx]["_id"] = registeredUser._id;
        mockUsers[idx]["token"] = registeredUser.token;

        // Expect the registeredUser to have identical name, email, image and about
        expect(registeredUser.name).toEqual(user.name);
        expect(registeredUser.email).toEqual(user.email);
        expect(registeredUser.image).toEqual(user.image);
        expect(registeredUser.about).toEqual(user.about);
      }
    });

    it('should fail to register a new user with missing data', async () => {
      // Create an incomplete user object without an email
      const { name, email, password, image, about } = { ...mockUsers[0], email: "" };

      // Send a POST request to /api/user/register with the incomplete user object
      const response = await request.post('/api/user/register')
        .send({
          name,
          email,
          password,
          image,
          about
        });

      // Expect the response to be an error (status code 400)
      expect(response.status).toBe(400);

      // Expect the response to contain an error message about missing data
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/missing required fields/i);

      //Expect the response to contain a specific message about missing data
      expect(response.body).toHaveProperty('fields');
      expect(response.body.fields.includes("email")).toBe(true);
    });

    it('should fail to register a new user with an existing email', async () => {
      // Create a mock user with a pre-existing email
      const { name, email, password, image, about } = mockUsers[0];

      // Send a POST request to /api/user/register with the new user object
      const response = await request.post('/api/user/register')
        .send({
          name,
          email,
          password,
          image,
          about
        });

      // Expect the response to be an error (status code 409)
      expect(response.status).toBe(409);

      // Expect the response to contain an error message about an existing email
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/email already exists/i);
    });
  });

  describe("authenticate user", () => {
    it('should authenticate a user with valid credentials', async () => {
      const { email, password } = mockUsers[0];

      // Send a POST request to /api/user/login with the user credentials
      const response = await request.post('/api/user/auth')
        .send({
          email,
          password
        });

      // Expect the response to be successful (status code 200)
      expect(response.status).toBe(200);

      // Expect the response to contain an authentication token
      expect(response.body).toHaveProperty('token');
    });

    it('should fail to authenticate a user with invalid credentials', async () => {
      const { email, password } = { ...mockUsers[0], password: "invalidpassword" };

      // Send a POST request to /api/user/login with invalid credentials
      const response = await request.post('/api/user/auth')
        .send({
          email,
          password
        });

      // Expect the response to be an error (status code 401)
      expect(response.status).toBe(401);

      // Expect the response to contain an error message
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/invalid credentials/i);
    });
  });

  describe("all users", () => {
    it("should get all users", async () => {
      const user = mockUsers[0];

      // Send a GET request to /api/user
      const response = await (request.get("/api/user"))
        .set("Authorization", `Bearer ${user.token}`);

      // Expect the response to be successful (status code 200)
      expect(response.status).toBe(200);

      const allUsers = response.body;
      const hasMockUsers = allUsers.some((user: MockUser) => mockUsers.some(
        mockUser => user._id.toString() === mockUser._id.toString() &&
          user.name === mockUser.name &&
          user.email === mockUser.email
      ));

      // Expect the response to contain the mock users
      expect(hasMockUsers).toBe(true);
    });

    it("should get filtered users based on search query", async () => {
      const mockUser = mockUsers[0];
      const testUser = mockUsers[1];

      // Send a GET request to /api/user?search=query
      const response = await (request.get(`/api/user?search=${testUser.name}`))
        .set("Authorization", `Bearer ${mockUser.token}`);

      // Expect the response to be successful (status code 200)
      expect(response.status).toBe(200);

      const allUsers = response.body;
      const hasTestUser = allUsers.some((user: MockUser) => testUser._id.toString() === user._id.toString());

      // Expect the response to contain the filtered users
      expect(hasTestUser).toBe(true);
    });
  });
});
