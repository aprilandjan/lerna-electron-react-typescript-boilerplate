import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import routes from '@/constants/routes.json';
import styles from './style.css';
import { Button } from 'antd';
import { dispatch } from '@/store';
import HeapSnapshot from 'app-common/src/HeapSnapshot';

const files = require.context('../../assets/img', false, /\.svg$/);
files.keys().forEach(files);

const heapSnapshot = new HeapSnapshot({
  interval: 10 * 60 * 1000,
});

export default class Home extends Component {
  handleClick = () => {
    dispatch(push(routes.COUNTER));
  };
  handleHeapSnapshot = () => {
    heapSnapshot.exec();
  };
  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <Link to={routes.COUNTER}>GO TO Counter PAGE</Link>
        <div>
          <Button onClick={this.handleClick}>GO TO COUNTER PAGE</Button>
        </div>
        <div>
          <Button onClick={this.handleHeapSnapshot}>Take HeapSnapshot</Button>
        </div>
      </div>
    );
  }
}
