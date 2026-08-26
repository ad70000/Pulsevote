const request = require("supertest");
const app = require("../app");

describe("Authentication API", () => {
  describe("POST /api/auth/register-user", () => {
    it("should return 400 for an invalid email", async () => {
      const res = await request(app)
        .post("/api/auth/register-user")
        .send({
          email: "not-an-email",
          password: "Password123"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid input");
    });

    it("should return 400 for a weak password", async () => {
      const res = await request(app)
        .post("/api/auth/register-user")
        .send({
          email: "test@example.com",
          password: "weak"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid input");
    });
  });

  describe("POST /api/auth/register-manager", () => {
    it("should return 401 when no authentication token is provided", async () => {
      const res = await request(app)
        .post("/api/auth/register-manager")
        .send({
          email: "manager@example.com",
          password: "Password123"
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Unauthorized");
    });
  });

  describe("POST /api/auth/register-admin", () => {
    it("should return 400 for invalid input", async () => {
      const res = await request(app)
        .post("/api/auth/register-admin")
        .send({
          email: "invalid-email",
          password: "weak"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid input");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 400 for an invalid email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "invalid-email",
          password: "Password123"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid input");
    });

    it("should return 400 when password is missing", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid input");
    });
  });

  describe("GET /api/protected", () => {
    it("should return 401 when no token is provided", async () => {
      const res = await request(app).get("/api/protected");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Unauthorized");
    });

    it("should return 403 when an invalid token is provided", async () => {
      const res = await request(app)
        .get("/api/protected")
        .set("Authorization", "Bearer invalid-token");

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty(
        "message",
        "Token invalid or expired"
      );
    });
  });
});