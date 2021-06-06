import express from 'express';
import ejs from 'ejs';
import path from 'path';
import categoryRoutes from './routes/category.js';
import dbRoutes from './routes/datebse.js';
import scoresRoute from './routes/scores.js';
import questionsRoute from './routes/questions.js';
import gameRoute from './routes/game.js';


const app = express();
const PORT = 3000;
const __dirname = path.join(path.dirname(decodeURI(new URL(import.meta.url).pathname))).replace(/^\\([A-Z]:\\)/, "$1");
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/src'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/category',categoryRoutes);
app.use('/db',dbRoutes);
app.use('/scores', scoresRoute);
app.use('/questions', questionsRoute);
app.use('/game', gameRoute);



app.get('/',(req,res)=>{
    res.render('home')
    // res.send('this will be the home page');
})

app.listen(PORT, ()=>console.log(`server runs on port ${PORT}`));

