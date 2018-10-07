/**
 *
 * AppConnectCard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import QRCode from 'qrcode.react';
const StyledCard = styled(Card)`
  width: 400px;
  margin-top: 1.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function AppConnectCard(props) {
  return (
    <Collapse in={props.checked}>
      <StyledCard>
        <CardContent>
          <Typography>
            Scan the Qr code with the FlipFyle application
          </Typography>
        </CardContent>
        <CardContent>
          <QRCode value={props.roomId} />
        </CardContent>
      </StyledCard>
    </Collapse>
  );
}

AppConnectCard.propTypes = {
  checked: PropTypes.bool,
  roomId: PropTypes.string,
};

export default AppConnectCard;
