import React, { Component } from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { FetchData } from "./components/FetchData";
import { Counter } from "./components/Counter";

import "./custom.css";
import { AuthHandler } from "./components/modules/AuthHandler";

interface IProps {}
interface IState {
	username?: string;
}

export default class App extends Component<IProps, IState> {
	static displayName = App.name;
	auth: AuthHandler;
	constructor(props: any) {
		super(props);
		this.auth = new AuthHandler();
    this.state = { username: this.auth.username }
    this.auth.addCallback((u) => this.setState({ username: u.username }))
	}
	render() {
		return (
			<Layout auth={this.auth}>
				<Route exact path="/" component={Home} />
				{this.state.username !== undefined ? (
					<>
						<Route path="/counter" component={Counter} />
						<Route path="/fetch-data">
							<FetchData auth={this.auth} />
						</Route>
					</>
				) : (
					<></>
				)}
			</Layout>
		);
	}
}
