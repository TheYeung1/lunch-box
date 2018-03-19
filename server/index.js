const io = require('socket.io')();

const foodMap = {};

io.on('connection', (client) => {
    client.on('newConnection', () => {
        console.log("New connection established!");
        client.emit('latestFoodMap', JSON.stringify(foodMap));
    });

    client.on('newFoodSuggestion', (suggestion) => {
        console.log("Suggestion added: " + suggestion);

        let votes = foodMap[suggestion];
        if (!votes) votes = 1;
        else votes = votes + 1;

        foodMap[suggestion] = votes;

        io.emit('foodSuggestionAdded', { 
            votes,
            food: suggestion,
        });
    });

    client.on('voteFoodSuggestion', (suggestion) => {
        console.log('Vote for ' + suggestion);

        let votes = foodMap[suggestion];
        votes = votes + 1;
        foodMap[suggestion] = votes;

        io.emit('foodSuggestionUpdated', {
            votes,
            food: suggestion,
        });
    });
});

const port = 8000;
io.listen(port);
console.log("Listening on port ", port);