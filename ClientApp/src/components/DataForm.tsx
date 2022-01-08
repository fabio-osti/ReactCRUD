import React from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { FormPerson, hairColor, IPerson } from "./modules/Person";
import { enumMap, formatCasedString } from "./modules/EnumHelpers";

export enum form {
	create,
	read,
	update,
	none,
}

export function DataForm (props: { init?: IPerson; action: form; submit: (p: IPerson) => void }) {
	console.log(props.init)
	const getLabel = () => {
		switch (props.action) {
			case form.create:
				return "Create";
			case form.update:
				return "Update";
			case form.read:
				return "Search";
			case form.none:
				return "VOID";
		}
	}
	return (
		<div style={{padding:10}}>

		<Formik
			initialValues={new FormPerson(props.init)}
			onSubmit={e => props.submit(e.toPerson())}
			>
			<Form>
				<div className="field">
					<label htmlFor="name">Name:</label>
					<br />
					<ErrorMessage name="name">{(e) => <p className="error">{e}</p>}</ErrorMessage>
					<Field type="text" name="name" className="border" style={{ width: "325px" }} />
				</div>

				<div className="field" style={{ display: "inline-block", width: "100%" }}>
					<div style={{ float: "left" }}>
						<label htmlFor="age">Age:</label>
						<br />
						<Field type="number" min={8} max={128} name="age" className="border" style={{ width: "48px" }} />
					</div>

					<div className="field" style={{ float: "left", paddingLeft: "12px" }}>
						<label htmlFor="hairColor">Hair Color:</label>
						<br />
						<Field as="select" name="hairColor" className="border" style={{ height: "30px" }}>
							<option value={""} style={{ display: "none" }} />
							{enumMap(hairColor, (key) => <option key={key} value={key}>{formatCasedString(hairColor[key])}</option>)}
						</Field>
					</div>

					<div style={{ float: "left", paddingLeft: "12px" }}>
						<label htmlFor="sex">Sex:</label>
						<br />

						<div style={{ float: "left", paddingTop: "4px" }}>
							<Field type="radio" value="f" name="sex" />
							<label htmlFor="Female" style={{ paddingLeft: "2px" }}>
								Female
							</label>
						</div>

						<div style={{ float: "left", paddingLeft: "8px", paddingTop: "4px" }}>
							<Field type="radio" value="m" name="sex" />
							<label htmlFor="Male" style={{ paddingLeft: "2px" }}>
								Male
							</label>
						</div>
					</div>
				</div>

				<button className="btn btn-primary" type="submit" style={{ float: "left" }}>
					{getLabel()}
				</button>
				{props.action === form.read ? (
					<button className="btn btn-primary" onClick={() => undefined} style={{ float: "left" }}>
						Clear
					</button>
				) : (
					<></>
					)}
			</Form>
		</Formik>
					</div>
	);
}
