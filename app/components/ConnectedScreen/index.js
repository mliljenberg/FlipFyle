/**
 *
 * ConnectedScreen
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
const Header = styled.h1`
  margin-top: 5vh;
`;

/* eslint-disable react/prefer-stateless-function */
class ConnectedScreen extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          <FormattedMessage {...messages.header} />
        </Header>
        <input type="file" name="myFile" onChange={this.props.uploadFile} />
      </Container>
    );
  }
}

ConnectedScreen.propTypes = {
  uploadFile: PropTypes.func,
};

export default ConnectedScreen;
