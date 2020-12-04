import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import routes from '@/constants/routes.json';
import styles from './style.css';
import { Button } from 'antd';
import { dispatch } from '@/store';
import { ipcRenderer } from 'electron';

const files = require.context('../../assets/img', false, /\.svg$/);
files.keys().forEach(files);

export default class HomePage extends Component {
  handleClick = () => {
    dispatch(push(routes.COUNTER));
  };
  handleQuit = () => {
    ipcRenderer.send('quit');
  };
  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2 data-tid="home">Home</h2>
        <div>
          <Button className={styles.btn} onClick={this.handleClick}>
            Redux Counter
          </Button>
          <Button className={styles.btn} onClick={this.handleQuit}>
            Quit
          </Button>
        </div>
      </div>
    );
  }
}
