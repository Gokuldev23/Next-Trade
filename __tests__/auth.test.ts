import { login, register } from "../lib/actions/auth.action";
import * as bcrypt from "bcrypt";
import { db } from "../lib/db/postgres";

jest.mock("bcrypt");
jest.mock("../lib/db/postgres", () => ({
  db: { query: jest.fn() },
}));

// Mock the Redis client and session functionality
jest.mock("../lib/db/redis", () => ({
  redis: {
    setex: jest.fn().mockResolvedValue("OK"),
  },
}));

jest.mock("../lib/auth/session", () => ({
  createSession: jest.fn().mockResolvedValue({
    sessionId: "mock-session-id",
  }),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockReturnValue({
    set: jest.fn(),
  }),
}));

// Mock the crypto module
jest.mock("crypto", () => ({
  randomBytes: jest.fn().mockReturnValue(Buffer.from("mock-session-id")),
}));

describe("Auth Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset all mocks to their initial state
    jest.mocked(bcrypt.compare as jest.Mock).mockReset();
    jest.mocked(db.query as jest.Mock).mockReset();
  });

  describe("register", () => {
    // ... your existing register tests ...

    it("should create a user successfully", async () => {
      (db.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] }) // userInDb -> no user
        .mockResolvedValueOnce({
          rows: [{ id: 1, name: "John", email: "test@example.com" }],
        }); // insert

      // Mock bcrypt.hash for registration
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");

      const form = new FormData();
      form.set("name", "John Doe");
      form.set("email", "test@example.com");
      form.set("password", "password123");

      const res = await register(null, form);

      expect(res.success).toBe(true);
      expect(res.message).toMatch(/created/i);
    });
  });

  describe("login", () => {
    it("should fail if user not found", async () => {
      (db.query as jest.Mock).mockResolvedValue({ rows: [] });

      const form = new FormData();
      form.set("email", "missing@example.com");
      form.set("password", "password123");

      const res = await login(null, form);

      expect(res.success).toBe(false);
      expect(res.message).toMatch(/not exists/i);
    });

    it("should fail if password mismatch", async () => {
      (db.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, email: "test@example.com", password_hash: "hashed" }],
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const form = new FormData();
      form.set("email", "test@example.com");
      form.set("password", "wrongpass");

      const res = await login(null, form);

      expect(res.success).toBe(false);
      expect(res.message).toMatch(/incorrect password/i);
    });

    it("should login successfully", async () => {
      (db.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, email: "test@example.com", password_hash: "hashed" }],
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const form = new FormData();
      form.set("email", "test@example.com");
      form.set("password", "password123");

      const res = await login(null, form);

      expect(res.success).toBe(true);
      expect(res.message).toMatch(/successful/i);
    });
  });
});
