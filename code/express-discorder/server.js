require("dotenv").config();
const express = require("express");
const axios = require("axios").default;

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) =>
  res.send(`
  <html>
    <head><title>Success!</title></head>
    <body>
      <h1>You did it!</h1>
      <img src="https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif" alt="Cool kid doing thumbs up" />
    </body>
  </html>
`)
);

app.post("/github", async (req, res) => {
  const repoName = req.body.repository.name;
  const username = req.body.sender.login;
  const avatarUrl = req.body.sender.avatar_url;

  const content = `${username} starred the repository ${repoName}`;
  try {
    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
      content: content,
      embeds: [
        {
          image: {
            url: avatarUrl,
          },
        },
      ],
    });

    console.log("Success!");
    res.status(204).send();
  } catch (err) {
    console.error(`Error sending to Discord: ${err}`);
  }
});

app.use((error, req, res, next) => {
  res.status(500);
  res.send({ error: error });
  console.error(error.stack);
  next(error);
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
