const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 2020;

app.use(express.json());

mongoose
  .connect("mongodb://0.0.0.0:27017/curd", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log("server is running on port", port);
    });
  })
  .catch((error) => {
    console.log("error", error);
  });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("curd", userSchema);

app.post("/create", (req, res) => {
  const { name, age, password } = req.body;

  User.create({ name, age, password })
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
});


app.get("/findbyId/:id", (req, res) => {
    const userId = req.params.id;
    User.findById(userId)
        .then((user) => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Internal server error" });
        });
});



app.put("/update/:id", (req, res) => {
    const userId = req.params.id;
    const { name, age, password } = req.body;
    User.findByIdAndUpdate(userId, { name, age, password }, { new: true })
        .then((user) => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Internal server error" });
        });
});


app.delete("/delete/:id", (req, res) => {
    const userId = req.params.id;
    User.findByIdAndDelete(userId)
        .then((user) => {
            if (user) {
                res.json({ message: "User deleted successfully" });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: "Internal server error" });
        });
});