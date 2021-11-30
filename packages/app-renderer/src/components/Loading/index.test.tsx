import React from 'react';
import { render } from '@testing-library/react';
import Loading from './';
import { fireEvent } from '@testing-library/react';

jest.mock('../Button', () => () => <div />);

describe('<Loading />', () => {
  it('should correctly render loading text', async () => {
    const { getByText } = render(<Loading />);
    const el = getByText(/Loading/);
    fireEvent(el, new Event('click'));
    // some assertions...
  });
  it('should correctly render loading text222', async () => {
    const { getByText } = render(<Loading />);
    const el = getByText(/Loading/);
    fireEvent(el, new Event('clicks'));
    // some assertions...
  });
});
