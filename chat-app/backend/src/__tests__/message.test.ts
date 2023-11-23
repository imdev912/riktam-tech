import supertest from "supertest";
import app from "../app";
import Message, { IMessage } from "../models/message";
import Chat from "../models/chat";
import { connectDB, disconnectBD } from "../../config/db";
import generateToken from "../../config/generateToken";
import { createRandomUsers } from "../__data__/user.data";
import User from "../models/user";


const request = supertest(app);

// Create mock users
const mockUser = createRandomUsers(3);
const token = generateToken(mockUser[0]._id.toString());

const mockChat = new Chat({
  users: [mockUser[0]._id, mockUser[1]._id]
});

const mockMsgs: IMessage[] = [];

describe("Message Controller Tests", () => {
  beforeAll(async () => {
    // Connect to the database before each test
    await connectDB();

    await Promise.all(mockUser.map(user => user.save()));
    await mockChat.save();
  }, 10000);

  afterAll(async () => {
    await Promise.all([
      User.deleteMany({ _id: { $in: mockUser.map(user => user._id) } }),
      Chat.deleteOne({_id: mockChat._id})
    ]);

    // Disconnect from the database after each test
    await disconnectBD();
  });

  describe("send message", () => {
    it("should send a new message", async () => {
      const msgs = [
        "testing message 1",
        "testing message 2"
      ];

      for (const msg of msgs) {
        const response = await request
          .post("/api/message/")
          .set("Authorization", `Bearer ${token}`)
          .send({
            content: msg,
            chatId: mockChat._id.toString()
          });

        expect(response.status).toBe(200);

        const message = await Message.findOne({ _id: response.body._id.toString() });
        mockMsgs.push(message!);

        expect(message).not.toBeNull();

        if (message) {
          expect(message.sender.toString()).toEqual(mockUser[0]._id.toString());
          expect(message.content).toEqual(msg);
          expect(message.chat.toString()).toEqual(mockChat._id.toString());
        }
      }
    }, 10000);

    it("should fail to send a new message with missing chat ID", async () => {
      const response = await request
        .post("/api/message/")
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "This is a new message"
        });

      expect(response.status).toBe(400);
    });

    it("should fail to send a new message with missing content", async () => {
      const response = await request
        .post("/api/message/")
        .set("Authorization", `Bearer ${token}`)
        .send({
          chatId: mockChat._id
        });

      expect(response.status).toBe(400);
    });
  });

  describe("all messages", () => {
    it("should get all messages for a chat", async () => {
      const response = await request
        .get(`/api/message/${mockChat._id.toString()}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);

      const chatMsgs = response.body;
      const isEqual = chatMsgs.some((chatMsg: IMessage) => mockMsgs.some(mockMsg => chatMsg._id.toString() === mockMsg._id.toString() && chatMsg.content === mockMsg.content));

      expect(isEqual).toBe(true);
    });

    it("should fail to get all messages for a chat with invalid chat ID", async () => {
      const response = await request
        .get("/api/message/123456")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });
});
