const io = require('socket.io')();

const foodMap = {};


io.on('connection', (client) => {
    client.on('newConnection', () => {
        console.log("New connection established!");
        client.emit('latestFoodMap', JSON.stringify(foodMap));
    });
    client.on('newFoodSuggestion', (suggestion) => {
        let votes = foodMap[suggestion];
        console.log("Suggestion added: " + suggestion);
        if (votes === undefined) {
            votes = 1;
        } else {
            votes = votes + 1;
        }
        foodMap[suggestion] = votes;
        io.emit('foodSuggestionAdded', {food: suggestion, votes: votes})
    });
    client.on('voteFoodSuggestion', (suggestion) => {
        console.log('Vote for ' + suggestion)
        let votes = foodMap[suggestion];
        votes = votes + 1;
        foodMap[suggestion] = votes;
        io.emit('foodSuggestionUpdated', {food: suggestion, votes: votes})
    });
});

const port = 8000;
io.listen(port);
console.log("Listening on port ", port);