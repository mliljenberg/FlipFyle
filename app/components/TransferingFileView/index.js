/**
 *
 * TransferingFileView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import desktopIcon from '../../images/desktop.svg';

import Bubbles from '../Bubbles';

const DesktopImg = styled.img`
  margin-top: 10vh;
  width: 40vh;
  height: 40vh;
`;
const Header = styled.h1`
  margin-top: 5vh;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

/* eslint-disable react/prefer-stateless-function */
class TransferingFileView extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          <FormattedMessage {...messages.sending} />
        </Header>
        <DesktopImg src={desktopIcon} />
        <Bubbles up={this.props.up} />
        <h1>{this.props.progress}%</h1>
      </Container>
    );
  }
}

TransferingFileView.propTypes = {
  up: PropTypes.bool,
  progress: PropTypes.number,
};

export default TransferingFileView;
