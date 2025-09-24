const express = require("express");
var router = express.Router();
var {
  getAllTodos,
  saveTodo,
  getTodoById,
  updateTitleTodoById,
  getUserTodos,
  deleteAllTodos,
} = require("../controllers/todo");
var auth = require("../middlewares/auth");

/** get all todos **/
router.get("/", async (_req, res,next) => {
  try {
    var todos = await getAllTodos();
    res.status(200).json({ data: todos });
  } catch (err) {
    next(err)
  }
});
/** add new todo **/
router.post("/", auth, async (req, res,next) => {
  var title = req.body.title;
  try {
    var newTodo = await saveTodo({ title: title, userId: req.id });
    res.status(201).json({ data: newTodo });
  } catch (err) {
    next(err)
  }
});


/* -------------------- lab ------------------- */
/** update todo by id **/
router.patch("/:id",auth, async (req, res,next) => {
  var { title } = req.body
  var { id } = req.params
  
  try {
    if (id && title) {
      var UpdatedTodo = await updateTitleTodoById(id , title )
      res.status(200).json({ data: UpdatedTodo })
    }
    else res.status(400).json({ message: "must provide title and id to edit todo" })
  } catch (e) {
    next(e)
  }
});


/** get all todos for the logged user=> by id in token **/
router.get("/user",auth, async (req, res,next) => {
  try {
    var todos = await getUserTodos( req.id )
    todos.length > 0 && res.status(200).json({ data: todos })
    todos.length == 0 && res.status(200).json({ message: "Couldn't find any todos for " + req.id })
  } catch (e) {
    next(e)
  }
});

router.delete("/",auth,async(_req,res,next)=>{
  try {
    await deleteAllTodos()
    res.status(200).json({ message: "todos have been deleted successfully" })
  } catch (e) {
    next(e)
    
  }
})


/** get todo by id */
router.get("/:id",auth, async (req, res,next) => {
  var { id } = req.params
  
  try {
    var todo = await getTodoById( id )
    if (todo) {
      res.status(200).json({ data: todo })
    } else {
      res.status(404).json({ message: "there is no todo with id"+id })
    }
  } catch (err) {
    next(err)
  }
});
module.exports = router;
