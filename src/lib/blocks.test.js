import {fromJS} from 'immutable';
import {addBlock, removeBlock, getBlock, moveBlock} from './blocks';

test('addBlock should add the block to an empty list', () => {
  const list = fromJS([]);
  const block = fromJS({
    id: 1,
    order: 1,
    width: 1,
    height: 1
  });

  const expected = fromJS([{
    id: 1,
    order: 1,
    width: 1,
    height: 1
  }]);

  const actual = addBlock(list,block);

  expect(actual).toEqual(expected);
});

test('addBlock should insert the block at the beginning of the list', () => {
  const list = fromJS([{
    id: 1,
    order: 1
  }]);
  const block = fromJS({
    id: 2,
    order: 1
  });

  const expected = fromJS([{
    id: 2,
    order: 1
  },{
    id: 1,
    order: 1
  }]);

  const actual = addBlock(list,block,0);

  expect(actual).toEqual(expected);
});

test('removeBlock should remove the block', () => {
  const list = fromJS([{
    id: 1,
    order: 1
  }]);

  const expected = fromJS([]);

  const actual = removeBlock(list, 1);

  expect(actual).toEqual(expected);
});

test('removeBlock should return the original list', () => {
  const list = fromJS([{
    id: 1,
    order: 1
  }]);

  const actual = removeBlock(list, 2);

  expect(actual).toBe(list);
});

test('findBlock should return the block', () => {
  const list = fromJS([{
    id: 1,
    order: 1
  }]);

  const actual = getBlock(list, 1);

  expect(actual).toEqual(fromJS({
    id: 1,
    order: 1
  }));
});

test('findBlock should return null', () => {
  const list = fromJS([{
    id: 1,
    order: 1
  }]);

  const actual = getBlock(list, 2);

  expect(actual).toBeNull();
});

test('moveBlock should move the block to beginning of the list', () => {
  const list = fromJS([{
    id: 1,
    order: 1
  },{
    id: 2,
    order: 2
  },{
    id: 3,
    order: 3
  }]);

  const expected = fromJS([{
    id: 3,
    order: 3
  },{
    id: 1,
    order: 1 
  },{
    id: 2,
    order: 2
  }]);

  const actual = moveBlock(list, 3, 0);

  expect(actual).toEqual(expected);
});

test('moveBlock should move the block to middle of the list', () => {
  const list = fromJS([{
    id: 1,
    order: 1
  },{
    id: 2,
    order: 2
  },{
    id: 3,
    order: 3
  }]);

  const expected = fromJS([{
    id: 2,
    order: 2
  },{
    id: 1,
    order: 1 
  },{
    id: 3,
    order: 3
  }]);

  const actual = moveBlock(list, 1, 1);

  expect(actual).toEqual(expected);
});