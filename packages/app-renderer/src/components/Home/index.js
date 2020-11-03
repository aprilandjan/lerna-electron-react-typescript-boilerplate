import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import routes from '@/constants/routes.json';
import styles from './style.css';
import { Button } from 'antd';
import { dispatch } from '@/store';

const files = require.context('../../assets/img', false, /\.svg$/);
files.keys().forEach(files);

export default class Home extends Component {
  handleClick = () => {
    dispatch(push(routes.COUNTER));
  };
  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2 data-testid="home">Home</h2>
        <Link to={routes.COUNTER}>GO TO Counter PAGE</Link>
        <div>
          <Button onClick={this.handleClick}>GO TO COUNTER PAGE</Button>
        </div>
      </div>
    );
  }
}
