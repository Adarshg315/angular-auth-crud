import express from "express";
import User from "../models/User.mjs";
import Employees from "../models/Employee.mjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
import bcrypt from "bcryptjs";
import http from "http";
import socket from "socket.io";

const app = express();
const server = http.createServer(app);
const io = socket(server);

server.listen(4000, () => {
	console.log(`socket on 4000`);
});

// socket io
io.on("connection", (socket) => {
	socket.on("newdata", (data) => {
		io.emit("new-data", { data: data });
	});
	socket.on("updatedata", (data) => {
		io.emit("update-data", { data: data });
	});
});

//verifyToken Middleware
const verifyToken = (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(401).send("Unauthorized request");
	}
	let token = req.headers.authorization.split(" ")[1];
	if (token === "null") {
		return res.status(401).send("Unauthorized request");
	}

	let payload = jwt.verify(token, "secretKey");
	// console.log(payload);

	if (!payload) {
		return res.status(401).send("Unauthorized request");
	}
	req.userId = payload.subject;
	next();
};
const router = express.Router();

// list emp
router.get("/", verifyToken, (req, res) => {
	Employees.find((err, emp) => {
		if (err) return next(err);
		res.json(emp);
	});
});

// get emp by id
router.get("/:id", (req, res, next) => {
	Employees.findById(req.params.id, (err, emp) => {
		if (err) return next(err);
		res.json(emp);
	});
});

// post emp data
router.post("/", async (req, res) => {
	const schema = Joi.object({
		empName: Joi.string().required(),
		empEmail: Joi.string().min(6).required().email(),
		empPassword: Joi.string().min(6).required(),
	});

	const { error } = schema.validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	// Check if this user already exisits
	const existingEmp = await Employees.findOne({ empEmail: req.body.empEmail });
	if (existingEmp) {
		return res.status(400).send("Employee already exisits!");
	}

	const hashedPassword = await bcrypt.hash(req.body.empPassword, 12);

	// creating new emp
	let empData = req.body;
	const emp = new Employees({
		empName: empData.empName,
		empEmail: empData.empEmail,
		empPassword: hashedPassword,
	});

	//save emp to database
	await emp.save((err) => {
		if (err) {
			console.log("error saving to db" + err);
		}
	});
	res.send(emp);
});

router.post("/register", async (req, res) => {
	const schema = Joi.object({
		username: Joi.string().required(),
		email: Joi.string().min(6).required().email(),
		password: Joi.string().min(6).required(),
	});

	// First Validate The Request
	const { error } = schema.validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	// Check if this user already exisits
	const existingUser = await User.findOne({ email: req.body.email });
	if (existingUser) {
		return res.status(400).send("User already exisits!");
	}
	//hashing the password
	const hashedPassword = await bcrypt.hash(req.body.password, 12);

	// creating new user
	let userData = req.body;
	const user = new User({
		email: userData.email,
		password: hashedPassword,
		username: userData.username,
	});

	//save user to database
	await user.save((err, registeredUser) => {
		if (err) {
			console.log(err);
		} else {
			let payload = { subject: registeredUser._id };
			let token = jwt.sign(payload, "secretKey");
			res.status(200).send({ token });
		}
	});
	res.send(user);
});

// put emp data
router.put("/:id", (req, res, next) => {
	Employees.findByIdAndUpdate(req.params.id, req.body, (err, emp) => {
		if (err) {
			console.log(err);
			return next(err);
		}
		res.json(emp);
	});
});

// soft delete emp by id
router.delete("/:id", (req, res, next) => {
	Employees.findByIdAndUpdate(req.params.id, req.body, (err, emp) => {
		if (err) {
			console.log(err);
			return next(err);
		}
		res.json(emp);
	});
});

router.post("/login", async (req, res) => {
	let userData = req.body;
	await User.findOne({ email: userData.email }, async (err, user) => {
		if (err) {
			console.log(err);
		} else {
			if (!user) {
				res.status(401).send("Invalid Email");
			} else {
				const isEqual = await bcrypt.compare(userData.password, user.password);
				if (!isEqual) {
					res.status(401).send("Invalid Password");
				} else {
					let payload = { subject: user._id };
					let token = jwt.sign(payload, "secretKey");
					res.status(200).send({ token });
				}
			}
		}
	});
});

export default router;
