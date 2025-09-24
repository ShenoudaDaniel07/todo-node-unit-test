const supertest= require("supertest")
const app = require("..")
const request=supertest(app)

describe("root routes",()=>{
    it("GET / should respond with todos",async()=>{
       let res=await request.get("/")
       expect(res.status).toBe(200)
       expect(res.body.data).toHaveSize(0)
    })
    it("GET /xxx should respond with status 404",async()=>{
       let res=await request.get("/xx")
       expect(res.status).toBe(404)
       expect(res.body.message).toBe("Not found")
    })
})