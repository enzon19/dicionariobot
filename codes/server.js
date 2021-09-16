const app = require('express')();
const path = __dirname + '/status.html'

app.get('/', (req, res) => res.sendFile(path));

module.exports = () => {
  app.listen(3000, ()=>{console.log("O servidor está supimpamente bem.")});
}
