import opentelemetry from '@opentelemetry/api';

export function reportSpan(spans) {
  const payload = spans.map(span => {
    const { _spanContext, _ended, duration, startTime, endTime, name } = span;
    const context = _spanContext;
    if (parentSpanId) {
      const parent = spans.find(s => s._spanContext.spanId === parentSpanId);
      if (parent) {
        context.traceFlags = parent._spanContext.traceFlags;
        context.traceState = parent._spanContext.traceState;
        context.parentSpanId = parentSpanId;
      }
    }
    return {
      _spanContext: context,
      _ended,
      duration,
      startTime,
      endTime,
      name,
      parentSpanId,
    };
  });
  console.log('span: name', payload);
  const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/send-trace`

  fetch(backend_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });
}


