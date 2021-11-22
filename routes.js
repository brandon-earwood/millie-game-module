const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("./models/User");
const Game = require("./models/Game");

function verifyToken(req, res, next) {
	if (!req.headers.authorization)
		return res.status(401).send("Unauthorized access");

	let token = req.headers.authorization.split(" ")[1];

	if (token === "null")
		return res.status(401).send("Unauthorized access");

	let payload = jwt.verify(token, 'secretkey');

	if (!payload)
		return res.status(401).send("Unauthorized access");

	req.userId = payload.subject;
	next();
}

router.post("/login", (req, res) => {
	const loginData = req.body;

	User.findOne({ username: loginData.username }, (error, user) => {
		if (error)
			console.log(error);
		else {
			if (!user)
				res.status(401).send("Invalid username");
			else if (user.password != loginData.password)
				res.status(401).send("Invalid password");
			else {
				const payload = { subject: user.username };
				const token = jwt.sign(payload, 'secretkey');
				res.status(200).send({token, user});
			}
		}
	});
});

router.get("/users/:username", async (req, res) => {
	const user = await User.findOne({ username: req.params.username });
	res.status(200).send(user);
});

router.get("/users", async (req, res) => {
	const users = await User.find();
	res.status(200).send(users);
});

router.post("/game", async (req, res) => {
	const game = new Game({
		name: req.body.name,
		season: req.body.season,
		date: req.body.date,
		levels: req.body.levels
	});

	await game.save();
	res.send(game);
});

router.get("/game/:id", async (req, res) => {
	const game = await Game.findOne({ id: req.params.id });
	res.status(200).send(game);
});

module.exports = router;