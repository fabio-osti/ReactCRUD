import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { AuthHandler } from './modules/AuthHandler';
import { NavMenu } from './NavMenu';

interface IProps {
  auth: AuthHandler
}

export class Layout extends Component<IProps> {
  static displayName = Layout.name;

  render () {
    return (
      <div>
        <NavMenu auth={this.props.auth} />
        <Container>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
