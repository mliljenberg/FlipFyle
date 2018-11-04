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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import DesktopConnectCard from '../DesktopConnectCard';
import AppConnectCard from '../AppConnectCard';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding-top: 8%;
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
        <StyledCard>
          <CardContent>
            <Typography
              variant="title"
              align="center"
              style={{ margin: '10px 0 15px 0' }}
            >
              Welcome!
            </Typography>
            <Typography variant="subheading">
              Flipfyle lets you send files to your friends or phone quickly,
              securly and wihout going through any servers.
              <br />
              <br />
              Connect to your phone or another person by selecting an option
              below.
            </Typography>
          </CardContent>
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
};

export default MainScreen;
