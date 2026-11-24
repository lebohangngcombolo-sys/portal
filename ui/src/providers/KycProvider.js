/**
 * KYC case provider — analyst queue, decisions, reviews, evidence.
 */

import { KYC_API } from '../common/constants/apiPaths.js';
import { Provider } from './Provider.js';

export const KycProvider = {
  // -------------------------------------------------------- cases
  get(caseId) {
    return Provider.request({
      method: 'GET',
      path: KYC_API.CASE(caseId),
    });
  },

  search({ status, assignedReviewerId, page = 0, size = 20 } = {}) {
    return Provider.request({
      method: 'GET',
      path: KYC_API.CASES,
      params: { status, assignedReviewerId, page, size },
    });
  },

  submit(caseId) {
    return Provider.request({
      method: 'POST',
      path: KYC_API.CASE_SUBMIT(caseId),
      body: {},
    });
  },

  resubmit(caseId) {
    return Provider.request({
      method: 'POST',
      path: KYC_API.CASE_RESUBMIT(caseId),
      body: {},
    });
  },

  requestInformation(caseId, { reasonCode, details }) {
    return Provider.request({
      method: 'POST',
      path: KYC_API.CASE_REQUEST_INFO(caseId),
      body: { reasonCode, details },
    });
  },

  assign(caseId, { reviewerUserId }) {
    return Provider.request({
      method: 'POST',
      path: KYC_API.CASE_ASSIGN(caseId),
      body: { reviewerUserId },
    });
  },

  approve(caseId, { note }) {
    return Provider.request({
      method: 'POST',
      path: KYC_API.CASE_APPROVE(caseId),
      body: { note },
    });
  },

  reject(caseId, { reasonCode, reason }) {
    return Provider.request({
      method: 'POST',
      path: KYC_API.CASE_REJECT(caseId),
      body: { reasonCode, reason },
    });
  },

  // -------------------------------------------------------- evidence
  getRequirements(caseId) {
    return Provider.request({
      method: 'GET',
      path: KYC_API.CASE_REQUIREMENTS(caseId),
    });
  },

  listDocuments(caseId) {
    return Provider.request({
      method: 'GET',
      path: KYC_API.CASE_DOCUMENTS(caseId),
    });
  },

  registerDocument(caseId, body) {
    return Provider.request({
      method: 'POST',
      path: KYC_API.CASE_DOCUMENTS(caseId),
      body,
    });
  },

  removeDocument(caseId, documentId) {
    return Provider.request({
      method: 'DELETE',
      path: KYC_API.CASE_DOCUMENT(caseId, documentId),
    });
  },

  // -------------------------------------------------------- reviews
  listReviews(caseId) {
    return Provider.request({
      method: 'GET',
      path: KYC_API.CASE_REVIEWS(caseId),
    });
  },

  createReview(caseId, { reviewStage, notes }) {
    return Provider.request({
      method: 'POST',
      path: KYC_API.CASE_REVIEWS(caseId),
      body: { reviewStage, notes },
    });
  },

  completeReview(caseId, reviewId, { outcome, notes }) {
    return Provider.request({
      method: 'POST',
      path: KYC_API.CASE_REVIEW_COMPLETE(caseId, reviewId),
      body: { outcome, notes },
    });
  },

  // -------------------------------------------------------- decisions
  listDecisions(caseId) {
    return Provider.request({
      method: 'GET',
      path: KYC_API.CASE_DECISIONS(caseId),
    });
  },
};