import express from 'express';

const router = express.Router();

//scores list will refreash when restart the server.
//score will keep the score of the last game played.
const scores = []

function sort_scores(scores_list){
    //this function sort the scores array of jsons.
    scores_list.sort(function(a, b){
        return b.score - a.score;
    });

}

function is_scores_full(){
    //returns true if scores table is full. else -> false.
    if (scores.length>2){
        return true
    }
    return false
}


//all routes in here start with /scores
router.get('/',(req,res)=>{
    res.render('scores',{scores:scores});
})


router.post('/', (req, res) =>{
        if (is_scores_full()){
            //if the scores table is full, delete last element (list is sorted)
            //replace last score with new score.
            scores.splice(scores.length-1, 1, req.body)
        }else {
            scores.push(req.body);
        }
        sort_scores(scores);
        res.redirect('/scores');
});

router.get('/:score', (req, res) =>{
    if (is_scores_full()){
    //the scores table is full, check if player's score is higher than current last place score.
        if (parseInt(req.params.score) > scores[scores.length-1].score) {
            //player gets in the score table, redirect to scores/add
            res.render('add-score' , {score : req.params.score});
        } else {
            //player's score isn't high enough, redirect to scores.
            res.redirect('/scores');
        }
    }else if (req.params.score >=0){
        //table isn't full , score automatically pushed into score table as long as score >0.
        //redirect to scores/add
        res.render('add-score' , {score : req.params.score});
    };
    
})
export default router;
