import supertest from "supertest";
import app from "../app";
import Chat, { IChat } from "../models/chat";
import Message from "../models/message";
import generateToken from "../../config/generateToken";
import { connectDB, disconnectBD } from "../../config/db";
import { createRandomUsers } from "../__data__/user.data";
import User from "../models/user";


const request = supertest(app);

// Create mock users
const mockUser = createRandomUsers(3);
const token = generateToken(mockUser[0]._id.toString());

const chat1 = new Chat({
  users: [mockUser[0]._id, mockUser[1]._id],
  isGroupChat: false
});

const chat2 = new Chat({
  users: [mockUser[0]._id, mockUser[1]._id],
  isGroupChat: true
});

const message1 = new Message({
  sender: mockUser[0]._id,
  content: "Hello from John Doe!",
  chat: chat1._id
});

const message2 = new Message({
  sender: mockUser[1]._id,
  content: "Hello from Jane Doe!",
  chat: chat2._id
});

describe("Chat Controller Tests", () => {
  beforeAll(async () => {
    // Connect to the database before each test
    await connectDB();

    await Promise.all(mockUser.map(user => user.save()));

    await Promise.all([
      chat1.save(),
      chat2.save(),
      message1.save(),
      message2.save()
    ]);
  }, 10000);

  afterAll(async () => {
    await Promise.all([
      User.deleteMany({ _id: { $in: mockUser.map(user => user._id) } }),
      Chat.deleteMany({ _id: { $in: [chat1._id, chat2._id] } }),
      Message.deleteMany({ _id: { $in: [message1._id, message2._id] } })
    ]);

    // Disconnect from the database after each test
    await disconnectBD();
  });

  describe("create one to one chat", () => {
    it("should not create a new one to one chat without userId", async () => {
      const response = await request
        .post("/api/chat/")
        .set("Authorization", `Bearer ${token}`);

      // Expect the response to be an error (status code 400)
      expect(response.status).toBe(400);

      // Expect the response to contain an error message about missing data
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/userId is required/i);
    });

    it("should create a new one to one chat with userId", async () => {
      const response = await request
        .post("/api/chat/")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId: mockUser[1]._id.toString()
        });

      expect(response.status).toBe(200);

      const chat = await Chat.findOne({ users: { $elemMatch: { $eq: mockUser[0]._id } } });

      expect(chat).not.toBeNull();

      if (chat) {
        expect(chat.users.length).toEqual(2);
        expect(chat.isGroupChat).toEqual(false);
      }
    });
  });

  describe("fetch all chats", () => {
    it("should fetch all chats for a user", async () => {
      const response = await request
        .get("/api/chat/")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);

      const chats = response.body;

      expect(chats.length).toEqual(2);

      const testChat1 = chats.filter((chat: IChat) => chat._id.toString() === chat1._id.toString())[0];
      const testChat2 = chats.filter((chat: IChat) => chat._id.toString() === chat2._id.toString())[0];

      expect(testChat1.users.length).toEqual(2);
      expect(testChat1.isGroupChat).toEqual(false);

      expect(testChat2.users.length).toEqual(2);
      expect(testChat2.isGroupChat).toEqual(true);
    });
  });

  describe("create group", () => {
    it("should create a new group chat", async () => {
      const groupName = "Test Group";

      const response = await request
        .post("/api/chat/group")
        .set("Authorization", `Bearer ${token}`)
        .send({
          users: JSON.stringify([
            mockUser[1]._id.toString(),
            mockUser[2]._id.toString()
          ]),
          name: groupName
        });

      // Expect the response to be successful (status code 200)
      expect(response.status).toBe(200);

      const groupChat = response.body;

      // Expect chat to be null
      expect(groupChat).not.toBeNull();

      // Expect the response to have _id
      expect(groupChat).toHaveProperty("_id");

      // Expect the response to have chatName
      expect(groupChat).toHaveProperty("chatName");
      expect(groupChat.chatName).toEqual(groupName);

      expect(groupChat.users.length).toEqual(3);
      expect(groupChat.isGroupChat).toEqual(true);
    });
  });
});
