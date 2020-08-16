import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '@/constants/routes.json';
import styles from './style.css';
import { Button } from 'antd';

/** FIXME: make jest support this webpack alias in require.context */
const files = require.context('../../assets/img', false, /\.svg$/);
files.keys().forEach(files);

export default class Home extends Component {
  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <Link to={routes.COUNTER}>to Counter</Link>
        <div>
          <Button>Button</Button>
        </div>
      </div>
    );
  }
}
