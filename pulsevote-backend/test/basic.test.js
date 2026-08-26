const request = require("supertest");
const app = require("../app");

describe("Basic API endpoints", () => {
  it("GET / -> 200", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("PulseVote API running!");
  });

  it("GET /test -> 200", async () => {
    const res = await request(app).get("/test");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "This is a test endpoint from PulseVote API!"
    );
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("timestamp");
  });
});