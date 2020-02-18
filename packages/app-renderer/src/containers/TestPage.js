import React from 'react';
import { connect } from 'react-redux';

@connect(state => {
  return {
    test: state.abc || 'test',
  };
})
export default class TestPage extends React.Component {
  render() {
    return <div>{this.props.test}</div>;
  }
}
