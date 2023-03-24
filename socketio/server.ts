import express, { Express } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app: Express = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3001;

// Dummy data for the quiz
const quizData = {
  // ...
};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit the 'newRound' event with the current song data when a new user connects
  // Replace with the actual logic to pick a song for the quiz
  const currentSong = quizData.tracks.items[0].track;
  socket.emit('newRound', currentSong);

  socket.on('userGuess', (guess: string) => {
    console.log(`User guessed: ${guess}`);

    // Check if the guess is correct and emit the 'guessResult' event
    // Replace with the actual logic to determine if the guess is correct
    const isCorrect = guess === currentSong.name;
    socket.emit('guessResult', isCorrect);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log('Server is listening on port ${PORT}');
});
