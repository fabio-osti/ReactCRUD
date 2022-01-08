import React, { Component } from "react";
import { DataForm, form } from "./DataForm";
import { hairColor, IPerson } from "./modules/Person";

import "./FetchData.css";
import { formatCasedString } from "./modules/EnumHelpers";
import { Modal } from "reactstrap";
import { buildAspHttpInit, buildResponseErrorTreatment } from "./modules/HttpHelpers";
import { AuthHandler } from "./modules/AuthHandler";

interface IProps {
	auth: AuthHandler;
}
interface IState {
	forecasts: any[];
	persons: IPerson[];
	filter?: IPerson;
	update?: IPerson;
	loading: boolean;
	page: number;
	pages: number;
	rows: number;
	entries: number;
	orderingBy: orderBy;
	form: form;
}
enum orderBy {
	nameA,
	nameD,
	ageA,
	ageD,
	sexA,
	sexD,
	hairColorA,
	hairColorD,
	none,
}

export class FetchData extends Component<IProps, IState> {
	static displayName = FetchData.name;

	constructor(props: any) {
		super(props);
		this.state = {
			forecasts: [],
			persons: [],
			loading: true,
			page: 1,
			pages: 1,
			rows: 10,
			entries: 0,
			orderingBy: orderBy.none,
			form: form.none,
		};
	}

	componentDidMount() {
		this.populateTable();
	}

	componentDidUpdate() {
		if (this.state.loading) this.populateTable();
	}

	async populateTable() {
		const filter =
			(this.state.filter?.name === undefined ? "" : `&name=${this.state.filter?.name}`) +
			(this.state.filter?.age === undefined ? "" : `&age=${this.state.filter?.age}`) +
			(this.state.filter?.sex === undefined ? "" : `&sex=${this.state.filter?.sex}`) +
			(this.state.filter?.hairColor === undefined ? "" : `&hc=${this.state.filter?.hairColor}`);
		const response = fetch(
			`person/read?rows=${this.state.rows}&page=${this.state.page}&orderby=${this.state.orderingBy}${filter}`,
			buildAspHttpInit(undefined, undefined, this.props.auth.token)
		);
		const data = await (await response).json();
		this.setState({
			persons: data.response,
			entries: data.count,
			pages: Math.ceil(data.count / this.state.rows),
			loading: false,
		});
	}

	// Builds an order by function for every header
	readonly buildOrderBy = (asc: orderBy, desc: orderBy) => () =>
		this.setState({
			orderingBy: this.state.orderingBy === asc ? desc : asc,
			loading: true,
		});

	// Gets caret that should be shown in a given header
	readonly getCaret = (asc: orderBy) => {
		switch (this.state.orderingBy) {
			case asc:
				return (
					<>
						<span className={`oi oi-caret-top`} />{" "}
					</>
				);
			case asc + 1:
				return (
					<>
						<span className={`oi oi-caret-bottom`} />{" "}
					</>
				);
			default:
				return "";
		}
	};

	// Controls the api call's skip/take
	readonly pageDown = () => this.setState({ page: Math.max(this.state.page - 1, 1), loading: true });
	readonly pageUp = () => this.setState({ page: Math.min(this.state.page + 1, this.state.pages), loading: true });
	readonly setRows = (e: React.ChangeEvent<HTMLSelectElement>) =>
		this.setState({
			rows: Number(e.target.value),
			pages: Math.ceil(this.state.entries / Number(e.target.value)),
			loading: true,
		});

	// Builds the delete api function call for every row
	readonly buildDelete = (p: IPerson) => () =>
		window.confirm(`Are you sure you want to delete ${p.name}?`)
			? fetch(`person/delete?id=${p.id}`, buildAspHttpInit(undefined, undefined, this.props.auth.token))
			: undefined;

	// Functions to control the data form
	readonly closeForm = () => this.setState({ form: form.none });
	readonly openCreateForm = () => this.setState({ form: form.create });
	readonly openSearchForm = () => this.setState({ form: form.read });
	readonly buildOpenUpdateForm = (e: IPerson) => () => this.setState({ form: form.update, update: e });
	readonly getFormInit = () => {
		switch (this.state.form) {
			case form.read:
				return this.state.filter;
			case form.update:
				return this.state.update;
			default:
				return undefined;
		}
	};
	readonly getSubmit = () => {
		switch (this.state.form) {
			case form.create:
			case form.update:
				return (person: IPerson) => {
					if (
						person.name !== undefined &&
						person.age !== undefined &&
						person.sex !== undefined &&
						person.hairColor !== undefined
					) {
						fetch(
							`person/${this.state.form === form.create ? "create" : "update"}`,
							buildAspHttpInit("POST", JSON.stringify(person), this.props.auth.token)
						)
							.then(
								buildResponseErrorTreatment(undefined, undefined, () =>
									this.setState({ loading: true, form: form.none })
								)
							)
							.catch((e: Error) => alert(e.message));
					} else {
						alert("You must fill all fields!");
					}
				};
			case form.read:
				return (person: IPerson) => this.setState({ loading: true, form: form.none, filter: person });
			default:
				return () => undefined;
		}
	};

	renderTable() {
		return (
			<table className="table table-striped">
				<thead>
					<tr>
						<th className="tbl-head" onClick={this.buildOrderBy(orderBy.nameA, orderBy.nameD)}>
							{this.getCaret(orderBy.nameA)}
							Name
						</th>
						<th className="tbl-head" onClick={this.buildOrderBy(orderBy.ageA, orderBy.ageD)}>
							{this.getCaret(orderBy.ageA)}
							Age
						</th>
						<th className="tbl-head" onClick={this.buildOrderBy(orderBy.sexA, orderBy.sexD)}>
							{this.getCaret(orderBy.sexA)}
							Sex
						</th>
						<th className="tbl-head" onClick={this.buildOrderBy(orderBy.hairColorA, orderBy.hairColorD)}>
							{this.getCaret(orderBy.hairColorA)}
							Hair Color
						</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{this.state.persons.map((person: IPerson) => (
						<tr key={person.id}>
							<td>{person.name}</td>
							<td>{person.age}</td>
							<td>{person.sex ?? false ? "Male" : "Female"}</td>
							<td>{formatCasedString(hairColor[person.hairColor!])}</td>
							<td>
								<ul className="list-inline m-0">
									<li className="list-inline-item">
										<button
											className="btn btn-success btn-sm "
											type="button"
											onClick={this.buildOpenUpdateForm(person)}
											title="Edit"
										>
											<span className="oi oi-pencil" />
										</button>
									</li>

									<li className="list-inline-item">
										<button
											className="btn btn-danger btn-sm "
											type="button"
											onClick={this.buildDelete(person)}
											title="Delete"
										>
											<span className="oi oi-trash" />
										</button>
									</li>
								</ul>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	}

	render() {
		const contents = this.state.loading ? (
			<p>
				<em>Loading...</em>
			</p>
		) : (
			this.renderTable()
		);

		return (
			<div>
				<Modal isOpen={this.state.form !== form.none} toggle={this.closeForm}>
					<DataForm init={this.getFormInit()} action={this.state.form} submit={this.getSubmit()} />
				</Modal>
				<h1 id="tabelLabel">Person table</h1>
				<p>This component demonstrates fetching data from the server.</p>
				<div style={{ width: "100%" }}>
					<button className="btn options oi oi-plus" onClick={this.openCreateForm} style={{ float: "left" }} />
					<button
						className="btn options oi oi-magnifying-glass"
						onClick={this.openSearchForm}
						style={{ float: "left" }}
					/>
					<ul className="pagination d-sm-inline-flex flex-grow options" style={{ marginRight: 0 }}>
						<li className="page-item">
							<button
								className="page-link page-navg page-btn"
								style={{ color: "black" }}
								disabled={this.state.page <= 1}
								onClick={this.pageDown}
							>
								Previous
							</button>
						</li>
						<li className="page-item">
							<div className="page-link" style={{ color: "black", backgroundColor: "rgb(250, 250, 250)" }}>
								{this.state.page} of {this.state.pages}
							</div>
						</li>
						<li className=" page-item ">
							<button
								className="page-link page-navg page-btn"
								style={{ color: "black" }}
								disabled={this.state.page >= this.state.pages}
								onClick={this.pageUp}
							>
								Next
							</button>
						</li>
					</ul>
					<select className="btn dropdown-toggle options" onChange={this.setRows}>
						<option value={10}>10</option>
						<option value={25}>25</option>
						<option value={50}>50</option>
					</select>
				</div>
				{contents}
			</div>
		);
	}
}
