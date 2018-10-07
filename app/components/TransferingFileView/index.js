/**
 *
 * TransferingFileView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import desktopIcon from '../../images/desktop2.png';

import Bubbles from '../Bubbles';

const DesktopImg = styled.img`
  width: 240px;
  height: auto;
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
const StyledProgress = styled(LinearProgress)`
  width: 350px;
`;
const StyledCard = styled(Card)`
  width: 400px;
  margin-top: 3em;
  display: flex;
  flex-direction: column;
  align-items: center;
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
        <StyledCard>
          <Header>{message}</Header>
          <DesktopImg src={desktopIcon} />
          <Bubbles up={this.props.up} />
          <h3>{this.props.progress}%</h3>
          <StyledProgress variant="determinate" value={this.props.progress} />
          <h2>{this.props.speed}kb/s</h2>
        </StyledCard>
      </Container>
    );
  }
}

TransferingFileView.propTypes = {
  up: PropTypes.bool,
  progress: PropTypes.number,
  speed: PropTypes.number,
};

export default TransferingFileView;
