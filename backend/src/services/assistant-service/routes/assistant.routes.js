const express = require('express');
const { Readable } = require('stream');
const env = require('../../../config/env');
const authMiddleware = require('../../../middleware/authMiddleware');
const activeAccountMiddleware = require('../../../middleware/activeAccountMiddleware');
const AppError = require('../../../utils/AppError');

const router = express.Router();

router.use(authMiddleware, activeAccountMiddleware);

function ragBaseUrl() {
  return env.ragServiceUrl.replace(/\/+$/, '');
}

function appendQueryString(url, query) {
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, item));
      return;
    }

    url.searchParams.append(key, value);
  });
}

function targetUrl(path, req) {
  const url = new URL(`${ragBaseUrl()}${path}`);
  appendQueryString(url, req.query);
  return url.toString();
}

function pickForwardHeaders(req, extraHeaders = {}) {
  const headers = {
    accept: req.headers.accept || 'application/json',
    ...extraHeaders,
  };

  if (req.headers.authorization) {
    headers.authorization = req.headers.authorization;
  }

  return headers;
}

function pickStreamHeaders(req) {
  const headers = pickForwardHeaders(req);

  if (req.headers['content-type']) {
    headers['content-type'] = req.headers['content-type'];
  }

  if (req.headers['content-length']) {
    headers['content-length'] = req.headers['content-length'];
  }

  return headers;
}

function copyResponseHeaders(upstreamResponse, res) {
  const blockedHeaders = new Set([
    'connection',
    'content-encoding',
    'keep-alive',
    'transfer-encoding',
  ]);

  upstreamResponse.headers.forEach((value, key) => {
    if (!blockedHeaders.has(key.toLowerCase())) {
      res.setHeader(key, value);
    }
  });
}

async function relayResponse(upstreamResponse, res) {
  res.status(upstreamResponse.status);
  copyResponseHeaders(upstreamResponse, res);

  if (!upstreamResponse.body) {
    res.end();
    return;
  }

  Readable.fromWeb(upstreamResponse.body).pipe(res);
}

function handleProxyError(next, error) {
  return next(
    new AppError('RAG service is unavailable', 502, {
      target: ragBaseUrl(),
      error: error.message,
    }),
  );
}

async function proxyJson(req, res, next, path, method = req.method) {
  try {
    const upstreamResponse = await fetch(targetUrl(path, req), {
      method,
      headers: pickForwardHeaders(req, { 'content-type': 'application/json' }),
      body: method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify(req.body || {}),
    });

    await relayResponse(upstreamResponse, res);
  } catch (error) {
    handleProxyError(next, error);
  }
}

async function proxyRequestStream(req, res, next, path) {
  try {
    const upstreamResponse = await fetch(targetUrl(path, req), {
      method: req.method,
      headers: pickStreamHeaders(req),
      body: req,
      duplex: 'half',
    });

    await relayResponse(upstreamResponse, res);
  } catch (error) {
    handleProxyError(next, error);
  }
}

async function proxyNoBody(req, res, next, path, method = req.method) {
  try {
    const upstreamResponse = await fetch(targetUrl(path, req), {
      method,
      headers: pickForwardHeaders(req),
    });

    await relayResponse(upstreamResponse, res);
  } catch (error) {
    handleProxyError(next, error);
  }
}

router.post('/ask', (req, res, next) => proxyJson(req, res, next, '/ask'));
router.post('/ask/stream', (req, res, next) => proxyJson(req, res, next, '/ask/stream'));
router.post('/voice/transcribe', (req, res, next) =>
  proxyRequestStream(req, res, next, '/voice/transcribe'),
);
router.post('/tts/speak', (req, res, next) => proxyJson(req, res, next, '/tts/speak'));
router.post('/image/ask', (req, res, next) => proxyRequestStream(req, res, next, '/image/ask'));

router.post('/sessions', (req, res, next) => proxyJson(req, res, next, '/chat/sessions'));
router.get('/sessions', (req, res, next) => proxyNoBody(req, res, next, '/chat/sessions'));
router.get('/sessions/:id', (req, res, next) =>
  proxyNoBody(req, res, next, `/chat/sessions/${encodeURIComponent(req.params.id)}`),
);
router.delete('/sessions/:id', (req, res, next) =>
  proxyNoBody(req, res, next, `/chat/sessions/${encodeURIComponent(req.params.id)}`, 'DELETE'),
);

router.get('/static/tts/:filename', (req, res, next) =>
  proxyNoBody(req, res, next, `/static/tts/${encodeURIComponent(req.params.filename)}`),
);

module.exports = router;
