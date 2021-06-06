import express from 'express';

const router = express.Router();

//all routes in here start with /db
router.get('/',(req,res)=>{
    res.send('json db will be stored here');
})

export default router;
