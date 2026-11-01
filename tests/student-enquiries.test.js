import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from '../worker/index.js';

const valid = { name: 'Test Student', fatherName: 'Test Parent', studentClass: 'Class X', phone: '8658816657' };
function request(body = valid, options = {}) {
  return new Request('https://academy.example/api/student-enquiries', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://academy.example' },
    body: JSON.stringify(body), ...options,
  });
}
function database() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../migrations/0001_student_enquiries.sql', import.meta.url), 'utf8'));
  return { sqlite, binding: { prepare: sql => ({ bind: (...values) => ({ run: async () => {
    sqlite.prepare(sql).run(...values);
    return { success: true };
  } }) }) } };
}

test('persists all student details in the migrated table with a timestamp', async () => {
  const db = database();
  try {
    const response = await worker.fetch(request({ ...valid, name: ' Test Student ', phone: '+91 86588 16657' }), { DB: db.binding });
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { success: true });
    const row = db.sqlite.prepare('SELECT * FROM student_enquiries').get();
    assert.equal(row.name, valid.name);
    assert.equal(row.father_name, valid.fatherName);
    assert.equal(row.student_class, valid.studentClass);
    assert.equal(row.phone, '+918658816657');
    assert.ok(!Number.isNaN(Date.parse(row.created_at)));
  } finally { db.sqlite.close(); }
});

test('rejects missing fields, invalid phones, unexpected JSON and spam without inserting', async () => {
  const db = database();
  try {
    for (const data of [null, [], {}, { ...valid, fatherName: ' ' }, { ...valid, phone: '1234567890' }, { ...valid, name: 'x'.repeat(101) }, { ...valid, website: 'spam.example' }]) {
      assert.equal((await worker.fetch(request(data), { DB: db.binding })).status, 400);
    }
    assert.equal(db.sqlite.prepare('SELECT count(*) AS count FROM student_enquiries').get().count, 0);
  } finally { db.sqlite.close(); }
});

test('uses bound SQL parameters for names containing quotes', async () => {
  const db = database();
  try {
    const name = "Student O'Neil; DROP TABLE student_enquiries; --";
    assert.equal((await worker.fetch(request({ ...valid, name }), { DB: db.binding })).status, 201);
    assert.equal(db.sqlite.prepare('SELECT name FROM student_enquiries').get().name, name);
  } finally { db.sqlite.close(); }
});

test('does not claim success when database is unavailable or an insert fails', async () => {
  for (const env of [{}, { DB: { prepare() { throw new Error('Database unavailable'); } } }, { DB: { prepare: () => ({ bind: () => ({ run: async () => ({ success: false }) }) }) } }]) {
    const response = await worker.fetch(request(), env);
    assert.equal(response.status, 503);
    assert.equal((await response.json()).success, undefined);
  }
});

test('rejects cross-origin, non-JSON, malformed and oversized requests', async () => {
  assert.equal((await worker.fetch(request(valid, { headers: { 'Content-Type': 'application/json', Origin: 'https://other.example' } }), {})).status, 403);
  assert.equal((await worker.fetch(request(valid, { headers: { 'Content-Type': 'text/plain' } }), {})).status, 415);
  assert.equal((await worker.fetch(request(valid, { body: '{broken' }), {})).status, 400);
  assert.equal((await worker.fetch(request({ ...valid, name: 'x'.repeat(5000) }), {})).status, 413);
});

test('no public endpoint exposes recorded student details', async () => {
  const response = await worker.fetch(new Request('https://academy.example/api/student-enquiries'), {});
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('Allow'), 'POST');
  assert.equal((await worker.fetch(new Request('https://academy.example/api/unknown'), {})).status, 404);
});
