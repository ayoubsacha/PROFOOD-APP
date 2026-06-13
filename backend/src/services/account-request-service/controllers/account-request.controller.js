const asyncHandler = require('../../../utils/asyncHandler');
const accountRequestService = require('../services/account-request.service');

const submitRequest = asyncHandler(async (req, res) => {
  const request = await accountRequestService.submitRequest(req.body);
  res.status(201).json({ success: true, data: request });
});

const listRequests = asyncHandler(async (req, res) => {
  const requests = await accountRequestService.listRequests(req.query);
  res.json({ success: true, data: requests });
});

const approveRequest = asyncHandler(async (req, res) => {
  const result = await accountRequestService.reviewRequest(
    req.params.id,
    req.user._id,
    'ACCEPTED',
    req.body.message,
  );
  res.json({ success: true, data: result });
});

const refuseRequest = asyncHandler(async (req, res) => {
  const result = await accountRequestService.reviewRequest(
    req.params.id,
    req.user._id,
    'REFUSED',
    req.body.message,
  );
  res.json({ success: true, data: result });
});

module.exports = {
  submitRequest,
  listRequests,
  approveRequest,
  refuseRequest,
};
