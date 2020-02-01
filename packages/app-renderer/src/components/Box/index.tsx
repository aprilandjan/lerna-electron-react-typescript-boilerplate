import React from 'react';
import styles from './style.scss';

export default class Box extends React.Component<any, any> {
  render() {
    return (
      <div className={styles.box}>Typescript Box</div>
    )
  }
}
