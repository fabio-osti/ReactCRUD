import React from "react";
import CryptoJS from "crypto-js";
import * as yup from "yup";

import { ErrorMessage, Field, Form, Formik } from "formik";
import {AuthHandler} from "./modules/AuthHandler";
import { IUser } from "./modules/User";

export function Login(props: { authentication: AuthHandler, close: () => void }) {
	const submit = (e: IUser) => {
		fetch("user/getsalt", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: '"' + e.email + '"',
		})
			.then((r) => {
				if (r.ok) return r.json();
				else throw new Error("Email not found");
			})
			.then((salt) => {
				const unsaltPass = e.password!;
				const saltedPass = CryptoJS.PBKDF2(unsaltPass, CryptoJS.enc.Base64.parse(salt), {
					keySize: 256 / 32,
					iterations: 2048,
				}).toString(CryptoJS.enc.Base64);

				fetch("user/login", {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ Email: e.email, Password: saltedPass }),
				})
					.then((r) => {
						if (r.ok) return r.json();
						else throw new Error("Wrong password");
					})
					.then((token) => {
						props.authentication.setUser(e.email, token)
						props.close()
					})
					.catch((e: Error) => alert(e.message));
			})
			.catch((e: Error) => alert(e.message));
	};

	return (
		<>
			<Formik
				initialValues={{ email: "", password: "" }}
				onSubmit={submit}
				validationSchema={yup.object().shape({
					Email: yup.string().email(),
					Password: yup.string().min(8).max(32),
				})}
			>
				<Form>
					<div className="field">
						<label htmlFor="email">Email:</label>
						<br />
						<ErrorMessage name="email">{(e) => <p className="error">{e}</p>}</ErrorMessage>
						<Field type="text" name="email" className="border form-control" style={{ width: "325px" }} />
					</div>
					<div className="field">
						<label htmlFor="password">Password:</label>
						<br />
						<ErrorMessage name="password">{(e) => <p className="error">{e}</p>}</ErrorMessage>
						<Field type="password" name="password" className="border form-control" style={{ width: "325px" }} />
					</div>
					<button className="btn btn-primary" type="submit">
						Log in
					</button>
				</Form>
			</Formik>
		</>
	);
}
