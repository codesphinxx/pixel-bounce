const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.set('basepath',__dirname + '/public');   
app.use(express.static(path.join(__dirname, 'public')));

app.get('/share', function(req, res){
    res.render('share', { score: req.query.score });
});

app.listen(PORT, () => console.log(`Game app listening on port ${PORT}!`));