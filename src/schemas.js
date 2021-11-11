import Joi from "joi";

export const singupSchema = Joi.object({
	name: Joi.string().min(1).required(),
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required(),
	cpf: Joi.string()
		.pattern(/[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}[-]?[0-9]{2}$/)
		.required(),
	address: Joi.string().required(),
	password: Joi.string().required(),
	confirmPassword: Joi.ref("password"),
});

export const loginSchema = Joi.object({
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required(),
	password: Joi.string().min(1).required(),
});
