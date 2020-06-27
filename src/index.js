const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const bcrypt = require('bcryptjs')
const app = express()
const port = process.env.PORT

app.use(express.json()) //Parsing Body to JSON.
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("Server started on "+port)
})
// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async () => {
//     // const task = await Task.findById('5ef44c5fa55b081c304dd77f')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner);

//     // const user = await User.findById('5ef44b73d6ffcd1bda0cc90e')
//     // await user.populate('tasks').execPopulate()
//     // console.log(user.tasks)
// }


// main()