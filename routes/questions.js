import express, { response } from 'express';
import axios from 'axios';

const router = express.Router();

//will be a list of the jsons conataining the questions.
//will change each time we'll call another category quesions.
let questsions_list 

//this file will handle the requests for the trivia questions.

 async function get_id_by_name(category_name){
    return axios.get('https://opentdb.com/api_category.php').then(response=> {
        const test =response.data.trivia_categories.find(x => x.name === category_name);
        return test.id;
    })
}

async function get_questions(category_id){
    let url = `https://opentdb.com/api.php?amount=3&category=${category_id}&difficulty=easy&type=multiple`
    return axios.get(url).then(response =>{
        return response.data.results;
    })
}

//all routes in here start with /questions
router.get('/',(req,res)=>{
    res.send(questsions_list);
})

//all categories with thier id's list of jsons.
router.get('/ids',(req,res)=>{
    axios.get('https://opentdb.com/api_category.php').then(response=> {
        res.send(response.data.trivia_categories)
    })
})
//this route get the questions as list of jsons and then redirect.
router.get('/:category_name',async (req,res)=>{
    const id = get_id_by_name(req.params.category_name).then(id =>{
        const url = get_questions(id).then(questsions =>{
            questsions_list= questsions
            res.redirect('/game')
        });
        });
    });


    
export let questsion_list = questsions_list;
export default router;
