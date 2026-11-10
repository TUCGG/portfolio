import {test} from 'node:test';
import assert from 'node:assert/strict';

import {sortProjects} from '../src/lib/projects.ts';

test('sortProjects: order 오름차순, 같으면 id 오름차순이고 입력은 바꾸지 않는다', () => {
  const input = [
    {id: 'b', data: {order: 1}},
    {id: 'a', data: {order: 1}},
    {id: 'c', data: {order: 0}}
  ];
  assert.deepEqual(
    sortProjects(input).map((e) => e.id),
    ['c', 'a', 'b']
  );
  assert.deepEqual(
    input.map((e) => e.id),
    ['b', 'a', 'c']
  );
});
