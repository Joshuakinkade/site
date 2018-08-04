import PostParser from './post-parser';

test('PostParser parses blog text', () => {
  const text = `
---
title: Test Post
date: 2018-03-04T00:00:00Z
---

## Introduction

The quick brown fox jumps over the lazy dog.
`;

  const expected = {
    metadata: {
      title: 'Test Post',
      date: '2018-03-04T00:00:00Z'
    },
    text: `## Introduction

The quick brown fox jumps over the lazy dog.
`};

  const parser = new PostParser(text);
  const post = parser.parse();

  expect(post).toEqual(expected);
});

test('PostParser should work without front matter', () => {
  const text = `# Test Post

It was a dark and stormy night.
`;

  const expected = {
    metadata: null,
    text: `# Test Post

It was a dark and stormy night.
`};

const parser = new PostParser(text);
const post = parser.parse();

expect(post).toEqual(expected);
});