import {DateTime} from 'luxon';
import {getSlug, combineRecents} from './helpers';

test('getSlug correctly formats a string', () => {
  const input = 'Hello World - Again (1).jpg';
  const output = getSlug(input);
  expect(output).toBe('hello-world-again-1.jpg');
});

test('combineRecents returns all of the albums', () => {
  const albums = [{
    name: 'one'
  },{
    name: 'two'
  },{
    name: 'three'
  },{
    name: 'four'
  }];

  const posts = [];

  const recents = combineRecents(albums,posts);

  expect(recents).toEqual(albums);
});

test('combineRecents returns all of the posts', () => {
  const albums = [];

  const posts = [{
    title: 'First Post'
  },{
    title: 'Hello, World!'
  },{
    title: "I'm hungry"
  }];

  const recents = combineRecents(albums,posts);

  expect(recents).toEqual(posts);
});

test('combineRecents returns all of the albums and posts in reverse order', () => {
  const albums = [{
    name: 'four',
    start_date: DateTime.fromISO('2018-07-19T00:00:00'),
    end_date: DateTime.fromISO('2018-07-21T00:00:00Z')
  },{
    name: 'three',
    start_date: DateTime.fromISO('2018-07-04T00:00:00Z'),
    end_date: DateTime.fromISO('2018-07-05T00:00:00Z')
  },{
    name: 'two',
    start_date: DateTime.fromISO('2018-06-03T00:00:00Z'),
    end_date: DateTime.fromISO('2018-06-03T00:00:00Z')
  },{
    name: 'one',
    start_date: DateTime.fromISO('2018-05-26T00:00:00Z'),
    end_date: DateTime.fromISO('2018-05-29T00:00:00Z')
  }];

  const posts = [{
    title: "I'm hungry",
    post_date: DateTime.fromISO('2018-07-10T00:00:00')
  },{
    title: 'Hello, World!',
    post_date: DateTime.fromISO('2018-06-05T00:00:00')
  },{
    title: 'First Post',
    post_date: DateTime.fromISO('2018-05-29T00:00:00Z')
  }];

  const recents = combineRecents(albums,posts);

  expect(recents).toEqual([{
    name: 'four',
    start_date: DateTime.fromISO('2018-07-19T00:00:00'),
    end_date: DateTime.fromISO('2018-07-21T00:00:00Z')
  },{
    title: "I'm hungry",
    post_date: DateTime.fromISO('2018-07-10T00:00:00')
  },{
    name: 'three',
    start_date: DateTime.fromISO('2018-07-04T00:00:00Z'),
    end_date: DateTime.fromISO('2018-07-05T00:00:00Z')
  },{
    title: 'Hello, World!',
    post_date: DateTime.fromISO('2018-06-05T00:00:00')
  },{
    name: 'two',
    start_date: DateTime.fromISO('2018-06-03T00:00:00Z'),
    end_date: DateTime.fromISO('2018-06-03T00:00:00Z')
  },{
    title: 'First Post',
    post_date: DateTime.fromISO('2018-05-29T00:00:00Z')
  },{
    name: 'one',
    start_date: DateTime.fromISO('2018-05-26T00:00:00Z'),
    end_date: DateTime.fromISO('2018-05-29T00:00:00Z')
  }]);
});