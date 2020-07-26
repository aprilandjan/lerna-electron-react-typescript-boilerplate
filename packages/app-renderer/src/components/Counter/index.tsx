import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './style.css';
import routes from '@/constants/routes.json';

export default class Counter extends Component<any> {
  render() {
    const { increment, incrementIfOdd, incrementAsync, decrement, counter } = this.props;
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.HOME}>&lt;Back</Link>
        </div>
        <div className={`counter ${styles.counter}`} data-tid="counter">
          {counter}
        </div>
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={increment} data-tclass="btn" type="button">
            +
          </button>
          <button className={styles.btn} onClick={decrement} data-tclass="btn" type="button">
            -
          </button>
          <button className={styles.btn} onClick={incrementIfOdd} data-tclass="btn" type="button">
            odd
          </button>
          <button
            className={styles.btn}
            onClick={() => incrementAsync()}
            data-tclass="btn"
            type="button"
          >
            async
          </button>
        </div>
      </div>
    );
  }
}
