/**
 *
 * MainScreen
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import DesktopConnectCard from '../DesktopConnectCard';
import AppConnectCard from '../AppConnectCard';

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
const StyledCard = styled(Card)`
  width: 400px;
  margin-top: 3em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const StyledCardActions = styled(CardActions)`
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
`;
const ConnectButton = styled(Button)`
  align-self: flex-end;
`;

/* eslint-disable react/prefer-stateless-function */
class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
    this.handleTabChange = this.handleTabChange.bind(this);
  }
  handleTabChange(event, value) {
    this.setState({ value });
  }
  render() {
    return (
      <Container>
        <Header>FlipFyle</Header>
        <StyledCard>
          <CardContent>
            <Typography align="center">
              Welcome! <br />
              If you recived a code input it below. Otherwise select a option
              below to connect
            </Typography>
          </CardContent>
          <StyledCardActions>
            <TextField
              id="standard-name"
              label="Peer Code"
              value={this.props.roomCodeInput}
              onChange={this.props.handleChange}
              margin="normal"
            />
            <ConnectButton
              color="primary"
              onClick={this.props.connectButtonClicked}
            >
              Connect
            </ConnectButton>
          </StyledCardActions>
          <div>
            <Divider />
          </div>
          <StyledCardActions>
            <Tabs
              value={this.state.value}
              onChange={this.handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Desktop" />
              <Tab label="Phone App" />
            </Tabs>
          </StyledCardActions>
        </StyledCard>

        <DesktopConnectCard
          checked={this.state.value === 0}
          url={this.props.url}
          roomId={this.props.roomId}
        />
        <AppConnectCard
          checked={this.state.value === 1}
          roomId={this.props.roomId}
        />
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
