const supertest= require("supertest")
const app = require("..")
const { clearDatabase } = require("../db.connection")
const request=supertest(app)

describe("user routes",()=>{
    let user={ email:"test@test.com",password:"1234",name:"Ali"}
    it("GET /user/ should respond with users=[]",async () => {
       let res= await request.get("/user/")
       expect(res.status).toBe(200)
       expect(res.body.data).toHaveSize(0)
    })
    it("POST /user/signup should respond with the new user ",async () => {
        let res= await request.post("/user/signup").send(user)
        expect(res.status).toBe(201)
        expect(res.body.data.email).toEqual(user.email)
    })
    it("POST /user/signup should respond with validation error for name ",async () => {
        let user2={ email:"test2@test.com",password:"1234"}
        let res= await request.post("/user/signup").send(user2)
        expect(res.status).toBe(500)
        expect(res.body.message).toContain("Name is required")
    })
    it("POST /user/login should respond with token",async () => {
        let res= await request.post("/user/login").send(user)
        expect(res.status).toBe(200)
        expect(res.body.data).toBeDefined()
    })
    afterAll(async()=>{
       await clearDatabase()
    })
})