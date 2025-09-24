const supertest = require("supertest");
const app = require("..");
const { clearDatabase } = require("../db.connection");
const request = supertest(app);

describe("todo routes", () => {
  let user = { email: "test@test.com", password: "1234", name: "Ali" };
  let token,idTodoInDB
  beforeAll(async()=>{
    await request.post("/user/signup").send(user)
   let res= await request.post("/user/login").send(user)
   token = res .body.data
  })
  it("GET /todo/ should respond with users=[]", async () => {
    let res = await request.get("/todo/");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveSize(0);
  });
  it("POST /todo with no auth should respond with 401",async()=>{
    let res= await request.post("/todo").send({title:"eat food"})
    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/login first/i)
  })
  it("POST /todo with auth should respond with the new todo",async()=>{
    let res= await request.post("/todo").send({title:"eat food"}).set({authorization:token})
    expect(res.status).toBe(201)
    expect(res.body.data.title).toEqual("eat food")
    idTodoInDB=res.body.data._id
  })
  it("GET /todo/id respond with the todo",async () => {
    let res= await request.get("/todo/"+idTodoInDB).set({authorization:token})
    expect(res.status).toBe(200)
    expect(res.body.data.title).toBe("eat food")
  })
  afterAll(async () => {
    await clearDatabase();
  });
});
