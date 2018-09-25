/**
 *
 * TransferingFileView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LinearProgress from '@material-ui/core/LinearProgress';

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
const ProgressContainer = styled.div`
  width:50vw;
`;

/* eslint-disable react/prefer-stateless-function */
class TransferingFileView extends React.Component {
  render() {
    let message = <FormattedMessage {...messages.reciving} />;
    if (this.props.up) {
      message = <FormattedMessage {...messages.sending} />;
    }
    return (
      <Container>
        <Header>{message}</Header>
        <DesktopImg src={desktopIcon} />
        <Bubbles up={this.props.up} />
        <ProgressContainer>
        <LinearProgress variant="determinate" value={this.props.progress} />
        </ProgressContainer>
        <h2>{this.props.progress}%</h2>
      </Container>
    );
  }
}

TransferingFileView.propTypes = {
  up: PropTypes.bool,
  progress: PropTypes.number,
};

export default TransferingFileView;
