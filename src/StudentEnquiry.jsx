import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';

export default function StudentEnquiry() {
  const dialog = useRef(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => dialog.current?.showModal(), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  async function submit(event) {
    event.preventDefault();
    if (status === 'saving') return;
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    setStatus('saving');
    setError('');
    try {
      const response = await fetch('/api/student-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) {
        throw new Error(result?.error || 'We could not save your details. Please try again or call +91 86588 16657.');
      }
      setStatus('saved');
    } catch (cause) {
      setError(cause.name === 'TimeoutError' ? 'The request timed out. Please try again.' : cause.message);
      setStatus('idle');
    }
  }

  return <dialog className="student-dialog" ref={dialog} aria-labelledby="student-dialog-title">
    <button type="button" className="dialog-close" onClick={() => dialog.current.close()} aria-label="Close student enquiry"><X size={21}/></button>
    <div className="section-kicker">YOUR NEXT CHAPTER STARTS HERE</div>
    <h2 id="student-dialog-title">Start your <em>journey.</em></h2>
    {status === 'saved' ? <div className="student-success" role="status"><CheckCircle2 size={38}/><h3>Thank you for your enquiry!</h3><p>Your details have been saved. Our academy team will contact you.</p><button type="button" className="btn btn-primary" onClick={() => dialog.current.close()}>Continue exploring <ArrowRight size={17}/></button></div> : <>
      <p className="student-intro">Leave your details for admission guidance from our team.</p>
      <form className="enquiry-form student-form" onSubmit={submit}>
        <fieldset disabled={status === 'saving'}>
          <label>Name<input name="name" autoComplete="name" autoFocus required minLength={2} maxLength={100} placeholder="Student's full name"/></label>
          <label>Father’s name<input name="fatherName" required minLength={2} maxLength={100} placeholder="Father's full name"/></label>
          <label>Class<input name="studentClass" required maxLength={40} placeholder="e.g. Class X, XI or XII"/></label>
          <label>Phone number<input name="phone" type="tel" autoComplete="tel" inputMode="tel" required minLength={10} maxLength={20} placeholder="10-digit mobile number" title="Enter a valid Indian mobile number, including country code if needed"/></label>
          <div className="student-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
          <p className="form-note">By submitting, you agree that Pinnacle Achievers Academy may contact you about admissions.</p>
          <button type="submit" className="btn btn-primary submit-btn">{status === 'saving' ? 'Saving…' : 'Submit'} <ArrowRight size={18}/></button>
        </fieldset>
        {error && <p className="student-error" role="alert">{error}</p>}
      </form>
    </>}
  </dialog>;
}
