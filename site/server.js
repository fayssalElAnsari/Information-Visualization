const express = require("express");
const app = express();
const PORT = 3001;

// Cette ligne indique le répertoire qui contient
// les fichiers statiques: html, css, js, images etc.
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
