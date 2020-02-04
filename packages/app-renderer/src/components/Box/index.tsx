import React from 'react';
import styles from './style.scss';

interface Props {
  name: string;
}

interface WrapperProps {
  children?: React.ReactNode;
  id: number;
}

const Wrapper: React.FC = (props: WrapperProps) => {
  return (
    <div>
      <span>{props.id}</span>
      <span>{props.children}</span>
    </div>
  );
};

export default class Box extends React.Component<Props, any> {
  render() {
    return (
      <div className={styles.box}>
        <span className="text">Typescript Box</span>
        <span className={styles.text}>Typescript Box</span>
      </div>
    );
  }
}
