const json = (body, status = 200, extraHeaders = {}) => Response.json(body, {
  status,
  headers: { 'Cache-Control': 'no-store', ...extraHeaders },
});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (url.pathname !== '/api/student-enquiries') return json({ error: 'Not found.' }, 404);
    if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, { Allow: 'POST' });
    if (request.headers.get('Origin') && request.headers.get('Origin') !== url.origin) {
      return json({ error: 'This request is not allowed.' }, 403);
    }
    if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) {
      return json({ error: 'Send details as JSON.' }, 415);
    }
    // Limit the body while streaming; Content-Length alone cannot enforce a limit.
    const reader = request.body?.getReader();
    if (!reader) return json({ error: 'Please enter your details.' }, 400);
    let size = 0;
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) {
        await reader.cancel();
        return json({ error: 'Submission is too large.' }, 413);
      }
      chunks.push(value);
    }
    let data;
    try {
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      data = JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return json({ error: 'Please send valid details.' }, 400);
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) return json({ error: 'Please enter your details.' }, 400);
    if (data.website) return json({ error: 'Unable to accept this submission.' }, 400);
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const fatherName = typeof data.fatherName === 'string' ? data.fatherName.trim() : '';
    const studentClass = typeof data.studentClass === 'string' ? data.studentClass.trim() : '';
    const rawPhone = typeof data.phone === 'string' ? data.phone.trim() : '';
    const phone = rawPhone.replace(/[\s()-]/g, '');
    if (name.length < 2 || name.length > 100 || fatherName.length < 2 || fatherName.length > 100 || !studentClass || studentClass.length > 40 || rawPhone.length > 20 || !/^(?:\+91|91)?[6-9]\d{9}$/.test(phone)) {
      return json({ error: 'Enter both full names, your class, and a valid Indian mobile number.' }, 400);
    }
    if (!env.DB) return json({ error: 'Enquiries are temporarily unavailable. Please call +91 86588 16657.' }, 503);
    try {
      const result = await env.DB.prepare(
        'INSERT INTO student_enquiries (name, father_name, student_class, phone) VALUES (?, ?, ?, ?)'
      ).bind(name, fatherName, studentClass, `+91${phone.slice(-10)}`).run();
      if (!result.success) throw new Error('Insert failed');
      return json({ success: true }, 201);
    } catch {
      // Do not expose database errors or student details in responses or logs.
      return json({ error: 'We could not save your details. Please try again or call +91 86588 16657.' }, 503);
    }
  },
};
