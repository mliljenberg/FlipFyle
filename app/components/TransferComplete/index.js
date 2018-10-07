/**
 *
 * TransferComplete
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Card from '@material-ui/core/Card';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

const StyledCard = styled(Card)`
  width: 400px;
  margin-top: 3em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
/* eslint-disable react/prefer-stateless-function */
class TransferComplete extends React.Component {
  render() {
    return (
      <Container>
        <StyledCard>
          <CardContent align="center">
            <h3>
              <FormattedMessage {...messages.header} />{' '}
            </h3>
          </CardContent>
          <CardActions />
        </StyledCard>
      </Container>
    );
  }
}

TransferComplete.propTypes = {};

export default TransferComplete;
