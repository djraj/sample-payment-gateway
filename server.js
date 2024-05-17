const express = require("express");

const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "Welcome to Payment Gateway Server",
    version: "v1",
  });
});
require(`./app/routes/payment.route`)(app);
// Start server
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
