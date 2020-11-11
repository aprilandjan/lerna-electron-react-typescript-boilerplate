import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
// https://github.com/testing-library/react-testing-library/issues/204
import { configure } from '@testing-library/dom';
// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom/extend-expect';

registerRequireContextHook();

configure({
  testIdAttribute: 'data-tid',
});
