import React from 'react';
import { render } from '@testing-library/react';
import Button from '.';

describe('<Button />', () => {
  it('should correctly render loading text', () => {
    const { getByText } = render(<Button />);
    getByText(/Button/);
  });
});
