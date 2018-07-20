import {getSlug, combineRcents} from './helpers';

test('getSlug correctly formats a string', () => {
  const input = 'Hello World - Again (1).jpg';
  const output = getSlug(input);
  expect(output).toBe('hello-world-again-1.jpg');
});