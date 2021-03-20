import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		maxlength: 255,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 1024,
	},
	email: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		unique: true,
	},
	// company: {
	// 	type: String,
	// 	// required: true,
	// 	maxlength: 255,
	// },
	// address: {
	// 	type: String,
	// 	// required: true,
	// 	maxlength: 255,
	// },
});

export default mongoose.model("user", userSchema, "users");
