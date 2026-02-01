import api from "./client";

export const saveResponse = (sessionId, payload) =>
  api.post(`/api/sessions/${sessionId}/response`, payload);

export const updateClicks = (sessionId, payload) =>
  api.post(`/api/sessions/${sessionId}/clicks`, payload);

export const updateStress = (sessionId, payload) =>
  api.post(`/api/sessions/${sessionId}/stress`, payload);

export const submitExam = (sessionId, payload) =>
  api.post(`/api/sessions/${sessionId}/submit`, payload);

export const logViolation = (sessionId, payload) =>
  api.post(`/api/sessions/${sessionId}/violation`, payload);
