/**
 *
 * MainScreen
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

const Header = styled.h1`
  margin-top: 5vh;
`;
// const QR = styled.div`
//   width: 40vh;
//   height: 40vh;
//   margin-top: 10vh;
//   background-color: black;
// `;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const Description = styled.p`
  margin-top: 10vh;
`;

/* eslint-disable react/prefer-stateless-function */
class MainScreen extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          <FormattedMessage {...messages.header} />
        </Header>
        <Description>
          Send the following link to whom you want to connect to:
          <h2>{this.props.url}</h2>
          Or ask them to input the following code after opening flipFyle:
          <h2>{this.props.roomId}</h2>
          If you got a code from a friend input it here:
        </Description>
        <TextField
          id="standard-name"
          label="Peer Code"
          value={this.props.roomCodeInput}
          onChange={this.props.handleChange}
          margin="normal"
        />
        <Button
          color="primary"
          variant="contained"
          onClick={this.props.connectButtonClicked}
        >
          Connect
        </Button>
      </Container>
    );
  }
}

MainScreen.propTypes = {
  roomId: PropTypes.string,
  url: PropTypes.string,
  handleChange: PropTypes.func,
  roomCodeInput: PropTypes.string,
  connectButtonClicked: PropTypes.func,
};

export default MainScreen;
