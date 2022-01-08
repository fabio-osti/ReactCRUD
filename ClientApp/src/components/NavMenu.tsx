import React, { Component } from "react";
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Modal } from "reactstrap";
import { Link } from "react-router-dom";
import "./NavMenu.css";
import { AuthHandler } from "./modules/AuthHandler";
import { Login } from "./Login";
import { Signup } from "./Signup";

interface IProps {
	auth: AuthHandler;
}
interface IState {
	userModal: modalState;
	collapsed: boolean;
	username?: string;
}

enum modalState {
	login,
	signup,
	none,
}

export class NavMenu extends Component<IProps, IState> {
	static displayName = NavMenu.name;

	constructor(props: any) {
		super(props);

		this.state = {
			userModal: modalState.none,
			collapsed: true,
			username: this.props.auth.username,
		};
		this.props.auth.addCallback((u) => this.setState({ username: u.username }));
	}

	toggleNavbar = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	};

	readonly toggle = () => this.setState({ userModal: modalState.none });

	render() {
		return (
			<header>
				<Modal isOpen={this.state.userModal !== modalState.none} toggle={this.toggle}>
					{this.state.userModal === modalState.login ? (
						<Login authentication={this.props.auth} close={this.toggle} />
					) : (
						<Signup authentication={this.props.auth} close={this.toggle} />
					)}
				</Modal>
				<Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
					<Container>
						<NavbarBrand tag={Link} to="/">
							reactCRUD
						</NavbarBrand>
						<NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
						<Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
							<ul className="navbar-nav flex-grow">
								{this.state.username !== undefined ? (
									<>
										<NavItem>
											<NavLink tag={Link} className="text-dark" to="/counter">
												Counter
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink tag={Link} className="text-dark" to="/fetch-data">
												Fetch data
											</NavLink>
										</NavItem>
										<NavItem>
											<span
												className="nav-link"
												style={{ cursor: "pointer" }}
												onClick={() => this.props.auth.setUser()}
											>
												<b>{this.state.username}</b>
											</span>
										</NavItem>
									</>
								) : (
									<>
										<NavItem>
											<span
												className="nav-link"
												style={{ cursor: "pointer" }}
												onClick={() => this.setState({ userModal: modalState.login })}
											>
												<b>Log In</b>
											</span>
										</NavItem>
										<NavItem>
											<span
												className="nav-link"
												style={{ cursor: "pointer" }}
												onClick={() => this.setState({ userModal: modalState.signup })}
											>
												<b>Sign Up</b>
											</span>
										</NavItem>
									</>
								)}
							</ul>
						</Collapse>
					</Container>
				</Navbar>
			</header>
		);
	}
}
