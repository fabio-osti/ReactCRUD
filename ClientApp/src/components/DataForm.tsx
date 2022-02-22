import React from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { FormPerson, hairColor, IPerson } from "./modules/Person";
import { enumMap, formatCasedString } from "./modules/EnumHelpers";
import { Container } from "reactstrap";

export enum form {
	create,
	read,
	update,
	none,
}

export function DataForm(props: { init?: IPerson; action: form; submit: (p: IPerson) => void }) {
	console.log(props.init);
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
	};
	return (
		<div style={{ padding: 10 }}>
			<Formik initialValues={new FormPerson(props.init)} onSubmit={(e) => props.submit(e.toPerson())}>
				<Form>
					<div className="field">
						<label htmlFor="name">Name:</label>
						<br />
						<ErrorMessage name="name">{(e) => <p className="error">{e}</p>}</ErrorMessage>
						<Field type="text" name="name" className="border" style={{ width: "325px" }} />
					</div>

					<Container className="row-flex">
						<div>
							<label htmlFor="age">Age:</label>
							<br />
							<Field type="number" min={8} max={128} name="age" className="border" style={{ width: "48px" }} />
						</div>

						<div className="field" style={{ paddingLeft: "12px" }}>
							<label htmlFor="hairColor">Hair Color:</label>
							<br />
							<Field as="select" name="hairColor" className="border" style={{ height: "30px" }}>
								<option value={""} style={{ display: "none" }} />
								{enumMap(hairColor, (key) => (
									<option key={key} value={key}>
										{formatCasedString(hairColor[key])}
									</option>
								))}
							</Field>
						</div>

						<div style={{ paddingLeft: "12px" }}>
							<label htmlFor="sex">Sex:</label>
							<br />
							<div className="row-flex" style={{ paddingTop: "4px" }}>
								<div>
									<Field type="radio" value="f" name="sex" />
									<label htmlFor="Female" style={{ paddingLeft: "2px" }}>
										Female
									</label>
								</div>

								<div style={{ paddingLeft: "8px" }}>
									<Field type="radio" value="m" name="sex" />
									<label htmlFor="Male" style={{ paddingLeft: "2px" }}>
										Male
									</label>
								</div>
							</div>
						</div>
					</Container>

						<button className="btn btn-primary" type="submit">
							{getLabel()}
						</button>
						{props.action === form.read ? (
							<button className="btn btn-primary" style={{ paddingLeft: "2px" }} onClick={() => undefined}>
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
