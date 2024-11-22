import express from 'express';


const app=express();

app.get("/",(req,res,next)=>{
  console.log(`Welcome To API/v1`)
})

export default app;