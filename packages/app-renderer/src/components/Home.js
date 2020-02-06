import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';
import log from '@/utils/log';

import Box from './Box';

log(456);

export default class Home extends Component {
  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <Box name="box" />
        <Link to={routes.COUNTER}>to Counter</Link>
      </div>
    );
  }
}
