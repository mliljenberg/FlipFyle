/**
 *
 * DesktopConnectCard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
const StyledCard = styled(Card)`
  width: 400px;
  margin-top: 1.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function DesktopConnectCard(props) {
  return (
    <Collapse in={props.checked}>
      <StyledCard>
        <CardContent>
          <Typography variant="subheading">
            Send the following link to whom you want to connect to:
          </Typography>
        </CardContent>
        <CardContent>
          <Typography>
            <h2>{props.url}</h2>
          </Typography>
        </CardContent>
      </StyledCard>
    </Collapse>
  );
}

DesktopConnectCard.propTypes = {
  url: PropTypes.string,
  checked: PropTypes.bool,
};

export default DesktopConnectCard;
