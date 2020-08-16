import React from 'react';
import { connect } from 'react-redux';
import { RootStates } from '@/store';

interface Props {
  test: any;
}

class TestPage extends React.Component<Props> {
  render() {
    return <div>{this.props.test}</div>;
  }
}

export default connect((state: RootStates) => {
  return {
    test: state.counter.count || 'test',
  };
})(TestPage);
