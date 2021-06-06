import express from 'express';
import axios from 'axios';

const router = express.Router();

//all routes in here start with /category
router.get('/',(req,res)=>{
    axios.get('https://opentdb.com/api_category.php').then(response=> {
        const categories = response.data.trivia_categories;
        res.render('categories',{categories})
        // res.send(categories);
    })
})

router.get('/:id',(req,res)=>{
    res.send('selected category will move to here');
})

export default router;
