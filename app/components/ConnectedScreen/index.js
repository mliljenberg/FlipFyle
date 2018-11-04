/**
 *
 * ConnectedScreen
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';

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
/* eslint-disable react/prefer-stateless-function */
class ConnectedScreen extends React.Component {
  render() {
    return (
      <Container>
        <StyledCard>
          <CardContent align="center">
            <Typography variant="title">Connected!</Typography>

            <Typography variant="subheading">
              You can now send files to eachother.
            </Typography>
          </CardContent>
          <CardActions>
            <input
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
              name="myFile"
              onChange={this.props.uploadFile}
            />
            <label htmlFor="raised-button-file">
              <Button component="span" variant="outlined" color="primary">
                Upload File
              </Button>
            </label>
          </CardActions>
        </StyledCard>
      </Container>
    );
  }
}

ConnectedScreen.propTypes = {
  uploadFile: PropTypes.func,
};

export default ConnectedScreen;
