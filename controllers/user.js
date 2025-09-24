
var userModel = require('../models/user')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {APIError} =require("../utilities/errors")

const getAllUser =() =>   userModel.find()

const saveUser= (user) =>   userModel.create(user)
        
const getUserById=(id) => {       
    return  userModel.findOne({ _id: id })
}
const login=  async function (email, password) {   


        var user = await userModel.findOne({ email })
        if (!user) {
            throw new APIError(401, 'Invalid email or password' )
        }
        var isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            throw new APIError( 401, 'Invalid email or password' )
        }

     var token = jwt.sign({ id: user._id, name: user.name }, process.env.SECRET)
        return token  
   
        

}





//lab
const getUserByName=  (name) => {
    
    return  userModel.findOne({ name })
}
   
const deleteAllUsers= () => {
    return  userModel.deleteMany()
}

module.exports = { saveUser, getAllUser, getUserByName,deleteAllUsers,getUserById,login }