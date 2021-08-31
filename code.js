const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/', function (request, response) {
  response.sendFile(__dirname + 'public/index.html');
});

const port = 5000;

app.get('/videoInfo', async function (request, response) {
  try {
    const videoURL = request.query.videoURL;
    const info = await ytdl.getInfo(videoURL);
    response.status(200).json(info);
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
});

app.get('/download', function (request, response) {
  const videoURL = request.query.videoURL;
  const itag = request.query.itag;
  const title = request.query.title;
  console.log(title);
  response.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
  ytdl(videoURL, {
    filter: (format) => format.itag == itag,
  }).pipe(response);
});

app.listen(port, () => {
  console.log(`running in port=${port}`);
});
