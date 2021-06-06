import express from 'express';
import axios from 'axios';
const router = express.Router();

//global variables, will be used to handle the game data.
//answers -> array of arrays -> each array containce: incorrect answers and correct on shuffled together.
//data to compare -> array of jsons. json properties : correct answer, chosen answer.
//questions -> array of the questions.
//category will keep the category name.

let answers = [];
let data_to_compare = [] ;
let question_counter = -1;
let questions = [];


function check_score(){
    let final_score = 0
    for(let i = 0; i < data_to_compare.length; i++){
        if (data_to_compare[i].correct_answer == data_to_compare[i].chosen_answer){
            final_score += 10

        }
    }
    return final_score
    
}


function shuffleArray(array) {

    //this function iterate the array from it's end to start and swap elements to random index.
    //the outcome is an shuffled array.
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function appand_question(index, element) {
    //this function add the elment to the given index in questions array.
    questions[index] = element;

};

function handle_answers(index, incorrect, correct) {
    //incorrect ia any array with 3 elements, correct is one element.
    //this function creates an array of 3 incorrect answers and the correct one.
    //then it calls to shuffle_array which shuffels the answers[index] array.
    answers[index] = incorrect;
    answers[index].push(correct);
    shuffleArray(answers[index]);
};

function handle_data_compares(index, correct_answer) {
    data_to_compare[index] = {correct_answer : correct_answer}
};

async function is_same_game(){
    //this function checks if the game was restarted with new category or questions.
    //return true if it's the same game, else false.
    //compare between the questions array first question to the /questions endpoint.
    return await axios.get('http://localhost:3000/questions').then(res=> {
        if (res.data[0].question == questions[0]){
            return true;
        }
        return false;
    });
};

async function  init_stage() {
    //this functions provides clean array of questions, array of answers and json of correct answers.
    // the answers of questions[i] will stored in answers[i] as array.
    await axios.get('http://localhost:3000/questions').then(res=> {
        question_counter = -1;
        for (let i = 0; i < res.data.length; i++) {
            appand_question(i, res.data[i].question );
            handle_answers(i, res.data[i].incorrect_answers, res.data[i].correct_answer);
            handle_data_compares(i, res.data[i].correct_answer);
        };
    });
};

//all routes in here start with /game

router.get('/', async (req,res) =>{
    if (!(question_counter == -1 )) {
    //this condiotion is true during the round as long as the counter < 2. 
        if (await is_same_game()){
            //it's the same game.
            question_counter +=1;
            res.render('game', {
                question : questions[question_counter],
                answers : answers[question_counter]});
        }else{
            //new game has started without old one finished.
            await init_stage().then( () => {
            question_counter +=1;
            res.render('game', {
                question : questions[question_counter],
                answers : answers[question_counter] 
                });
            });
        }; 
    }else {
        //this condition is true when new round getting started, sets up the data.
        await init_stage().then( () => {
            question_counter +=1;
            res.render('game', {
                question : questions[question_counter],
                answers : answers[question_counter] 
            
            });
        });   
    }
});


router.post('/next',(req, res) =>{
    //saves the player chosen answer into data to compare
    data_to_compare[question_counter].chosen_answer =answers[question_counter][req.body.optradio];
    if (question_counter == questions.length-1){
        //if there are no more questions ->calculate score 
        //and redirect to scores page.
        question_counter = -1;
        let final_score = check_score()
        res.redirect(`/scores/${final_score}`)
    } else{
        //if it was not the last questions , redirect to /game 
        //which will render the next question.
    
        res.redirect('/game');
    }

});


export default router;
