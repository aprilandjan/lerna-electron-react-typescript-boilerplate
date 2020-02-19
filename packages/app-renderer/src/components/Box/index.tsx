import React from 'react';
import styles from './style.scss';

import utils from '@/utils/log';
import log from '@utils/log';
import loggy from '@src/utils/log';

console.log(utils);

utils(123);
log(123);
loggy(123);

interface Props {
  name: string;
}

interface WrapperProps {
  children?: React.ReactNode;
  id: number;
}

const Wrapper: React.FC<WrapperProps> = (props: WrapperProps) => {
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
        <Wrapper id={99} />
      </div>
    );
  }
}
