test('test is null', () => {
  const n = null

  expect(n).toBeNull()
  // expect(n).toBeTruthy()
})

test('test is 1', () => {
  const n = 1

  expect(n).toBe(1)
})

test('2+2', () => {
  const n = 2+2

  expect(n).toBe(4)
})