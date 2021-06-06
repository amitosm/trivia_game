//import axios from 'axios';


async function get_questions(){
    return axios.get('http://localhost:3000/questions').then(response=> {
        //includes 3 questions in an array of jsons.
        return response.data;
    })
}

async function game_logic(){
    let json_quest =  await get_questions();
    console.log(json_quest)
    
}

game_logic()