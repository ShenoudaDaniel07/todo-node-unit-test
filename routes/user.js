const express = require("express");
const {
  saveUser,
  deleteAllUsers,
  getUserByName,
  getAllUser,
  getUserById,
  login,
} = require("../controllers/user");
var router = express.Router();


router.get("/", async (_req, res,next) => {
  try {
    let users = await getAllUser();
    res.status(200).json({ data: users });
  } catch (e) {
    next(e)

  }
});

router.post("/signup",  async (req, res,next) => {
    var user = req.body
    try {
        var newUser = await saveUser(user)
        res.status(201).json({ data: newUser })
    } catch (e) {
        next(e)
    }
});

router.post("/login", async (req,res,next) => {
    let {email,password}= req.body
    try {
        if (!email || !password) {
            res.status(400).json({ message: 'please provide email and password' })
        }
        let token= await login(email,password)
        res.status(200).json({ data: token  })
    } catch (e) {
        next(e)        
    }
});

/* -------------------- lab ------------------- */
router.get("/search", async (req,res,next) => {
    try {
        var {name} = req.query
        var user = await getUserByName( name )
        if (user) res.status(200).json({data:user})
        else {
            res.status(404).json({ message: "There is no user with name: " + name })
        }
    } catch (e) {
        next(e)
    }
});

router.delete("/", async (req,res,next) => {
    try {
        await deleteAllUsers()
        res.status(200).json({ message: "users have been deleted successfully" })
    } catch (e) {
        next(e)
    }
});
/* -------------------------------------------- */

/** get user by id **/
router.get("/:id", async (req,res,next) => {
    try {
        let user = await getUserById(req.params.id )
        if (user) res.status(200).json({ data: user })
        else res.status(404).json({message:"there is no user with id="+req.params.id})
    } catch (e) {
        next(e)
    }
});

module.exports = router;
