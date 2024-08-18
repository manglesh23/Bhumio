const mongoose= require('mongoose');
const URI= process.env.DATABASE_KEY;

const connectDatabase=async()=>{
    try{
       await mongoose.connect(URI);
       console.log("database connection established");
    }catch(e){
        return{
            error:true,
            details:e
        }
    }
}
module.exports={connectDatabase};