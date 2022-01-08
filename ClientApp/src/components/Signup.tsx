import React from "react";
import CryptoJS from "crypto-js";

import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import {AuthHandler} from "./modules/AuthHandler";
import { IUser } from "./modules/User";

export function Signup (props: { authentication: AuthHandler, close: () => void }) {
	const submit = (e: IUser) => {
		const unsaltPass = e.password!;
		const salt = CryptoJS.lib.WordArray.random(192 / 8);
		const saltedPass = CryptoJS.PBKDF2(unsaltPass, salt, {
			keySize: 256 / 32,
			iterations: 2048,
		});
		fetch("user/signup", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: e.email,
				username: e.username,
				password: saltedPass.toString(CryptoJS.enc.Base64),
				salt: salt.toString(CryptoJS.enc.Base64),
			}),
		})
			.then((r) => {
				if (r.ok) return r.json();
				else throw new Error("Email already registered");
			})
			.then((token) => {
				props.authentication.setUser(e.email, token)
				props.close()
			})
			.catch((e: Error) => alert(e.message));
	};

	return (
		<>
			<Formik
				initialValues={{ email: "", username: "", password: "" }}
				onSubmit={submit}
				validationSchema={yup.object().shape({
					email: yup.string().email().required(),
					username: yup.string().min(3).max(16),
					password: yup.string().min(8).max(32),
				})}
			>
				<Form>
					<div className="field">
						<label htmlFor="email">Email:</label>
						<br />
						<ErrorMessage name="email">{(e) => <p className="error">{e}</p>}</ErrorMessage>
						<Field type="email" name="email" className="border form-control" style={{ width: "325px" }} />
					</div>
					<div className="field">
						<label htmlFor="username">Username:</label>
						<br />
						<ErrorMessage name="username">{(e) => <p className="error">{e}</p>}</ErrorMessage>
						<Field type="text" name="username" className="border form-control" style={{ width: "325px" }} />
					</div>
					<div className="field">
						<label htmlFor="password">Password:</label>
						<br />
						<ErrorMessage name="password">{(e) => <p className="error">{e}</p>}</ErrorMessage>
						<Field type="password" name="password" className="border form-control" style={{ width: "325px" }} />
					</div>
					<button className="btn btn-primary" type="submit">
						Sign Up
					</button>
				</Form>
			</Formik>
		</>
	);
}
