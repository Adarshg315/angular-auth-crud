import mongoose from "mongoose";

var EmployeeSchema = new mongoose.Schema({
	empName: {
		type: String,
		required: true,
		maxlength: 255,
		unique: true,
	},
	empPassword: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 1024,
	},
	empEmail: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		unique: true,
	},
	is_deleted: {
		type: Boolean,
		default: false,
	},
	updated: { type: Date, default: Date.now },
});

export default mongoose.model("emp", EmployeeSchema, "emp");
