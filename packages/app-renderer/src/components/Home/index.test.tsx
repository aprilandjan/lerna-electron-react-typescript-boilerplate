import React from 'react';
import { render } from '@testing-library/react';
import Home from './index';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: (props: any) => <div>{props.children}</div>,
}));

// css files
// require context
// jpg, png, etc
describe('<Home>', () => {
  it('render successfully', () => {
    const { getByText, queryByText } = render(<Home />);
    //  check element exist
    getByText('Home');
    //  check element not exist
    expect(queryByText('not-exist')).toBeNull();
  });
});
