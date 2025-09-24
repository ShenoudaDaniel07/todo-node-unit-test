const supertest = require("supertest");
const app = require("..");
const { clearDatabase } = require("../db.connection");
const request = supertest(app);

describe("lab testing:", () => {
  afterAll(async () => {
    await clearDatabase();
  });
  let user = { email: "test@test.com", password: "1234", name: "Ali" };
  let token;
  let todoId;

  beforeAll(async () => {
    await request.post("/user/signup").send(user);

    let res = await request.post("/user/login").send({
      email: user.email,
      password: user.password,
    });
    token = res.body.data;

    res = await request
      .post("/todo")
      .set("Authorization", token)
      .send({ title: "Test Todo" });
    todoId = res.body.data._id;
  });

  describe("users routes:", () => {
    it("GET /user/search should respond with the correct user with the name requested", async () => {
      let res = await request.get("/user/search?name=Ali");
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.name).toEqual("Ali");
      expect(res.body.data.email).toEqual(user.email);
    });

    it("GET /user/search with invalid name should respond with status 404 and the message", async () => {
      let res = await request.get("/user/search?name=NonExistingUser");
      expect(res.status).toBe(404);
      expect(res.body.message).toContain(
        "There is no user with name: NonExistingUser"
      );
    });
  });

  describe("todos routes:", () => {
    it("PATCH /todo/ with id only should respond with res status 400 and a message", async () => {
      let res = await request
        .patch(`/todo/${todoId}`)
        .set("Authorization", token)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toContain(
        "must provide title and id to edit todo"
      );
    });

    it("PATCH /todo/ with id and title should respond with status 200 and the new todo", async () => {
      let updatedTodo = { title: "Updated Todo" };
      let res = await request
        .patch(`/todo/${todoId}`)
        .set("Authorization", token)
        .send(updatedTodo);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.title).toEqual("Updated Todo");
      expect(res.body.data.userId).toBeDefined();
    });

    it("GET /todo/user should respond with the user's all todos", async () => {
      let res = await request.get("/todo/user").set("Authorization", token);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].title).toEqual("Updated Todo");
    });

    it("GET /todo/user for a user hasn't any todo, should respond with status 200 and a message", async () => {
      let newUser = { email: "new@test.com", password: "1234", name: "Sara" };
      let res = await request.post("/user/signup").send(newUser);
      let newUserId = res.body.data._id;

      res = await request.post("/user/login").send({
        email: newUser.email,
        password: newUser.password,
      });
      let newToken = res.body.data;

      res = await request.get("/todo/user").set("Authorization", newToken);
      expect(res.status).toBe(200);

      expect(res.body.data).toBeUndefined();

      expect(res.body.message).toContain(
        `Couldn't find any todos for ${newUserId}`
      );
    });
  });
});
