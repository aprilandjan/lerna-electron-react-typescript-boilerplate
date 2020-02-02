import React from 'react';
import styles from './style.scss';

interface Props {
  name: string;
}

export default class Box extends React.Component<Props, any> {
  render() {
    return (
      <div className={styles.box}>
        <span className="text">
         Typescript Box
        </span>
        <span className={styles.text}>
         Typescript Box
        </span>
      </div>
    )
  }
}
