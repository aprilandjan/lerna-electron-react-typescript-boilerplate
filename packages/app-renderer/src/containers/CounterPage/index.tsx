import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './style.scss';
import routes from '@/constants/routes.json';
import { RootStates, ThunkConnected } from '@/store';
import {
  createIncrease,
  createDecrease,
  createIncreaseIfOdd,
  createIncreaseAsync,
} from '@/store/counter';

interface ConnectedProps {
  user: string;
  count: number;
}

interface Props extends ThunkConnected, ConnectedProps {
  //
}

class CounterPage extends Component<Props> {
  handleIncrease = () => {
    const { dispatch } = this.props;
    dispatch(createIncrease(1));
  };
  handleDecrease = () => {
    const { dispatch } = this.props;
    dispatch(createDecrease(1));
  };
  handleIncreaseIfOdd = () => {
    const { dispatch } = this.props;
    dispatch(createIncreaseIfOdd());
  };
  handleIncreaseAsync = () => {
    const { dispatch } = this.props;
    dispatch(createIncreaseAsync());
  };
  render() {
    const { count } = this.props;
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.HOME}>&lt;Back</Link>
        </div>
        <div className={`counter ${styles.counter}`} data-tid="counter">
          {count}
        </div>
        <div className={styles.btnGroup}>
          <button
            className={styles.btn}
            onClick={this.handleIncrease}
            data-tclass="btn"
            type="button"
          >
            +
          </button>
          <button
            className={styles.btn}
            onClick={this.handleDecrease}
            data-tclass="btn"
            type="button"
          >
            -
          </button>
          <button
            className={styles.btn}
            onClick={this.handleIncreaseIfOdd}
            data-tclass="btn"
            type="button"
          >
            odd
          </button>
          <button
            className={styles.btn}
            onClick={this.handleIncreaseAsync}
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

export default connect(
  (state: RootStates): ConnectedProps => {
    return {
      user: state.globals.user,
      count: state.counter.count,
    };
  }
)(CounterPage);
