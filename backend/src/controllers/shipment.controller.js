import Shipment from '../models/Shipment.js';
import { v4 as uuidv4 } from 'uuid';
import { successResponse, errorResponse, paginateResponse } from '../utils/apiResponse.js';
import notificationService from '../services/notification.service.js';

export const getShipments = async (req, res, next) => {
  try {
    const shipments = await Shipment.find({ userId: req.user.id })
      .populate('subscriptionId')
      .populate('boxId')
      .sort('-createdAt');
    successResponse(res, shipments);
  } catch (error) {
    next(error);
  }
};

export const getShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findOne({ _id: req.params.id, userId: req.user.id });
    if (!shipment) return errorResponse(res, 'Shipment not found', 404);
    successResponse(res, shipment);
  } catch (error) {
    next(error);
  }
};

export const trackShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber });
    if (!shipment) return errorResponse(res, 'Shipment not found', 404);
    successResponse(res, shipment);
  } catch (error) {
    next(error);
  }
};

export const createShipment = async (req, res, next) => {
  try {
    const trackingNumber = `TRK-${uuidv4().split('-')[0].toUpperCase()}`;
    const shipment = await Shipment.create({
      ...req.body,
      trackingNumber,
      statusHistory: [{ status: 'pending', date: new Date() }]
    });
    successResponse(res, shipment, 'Shipment created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status, location, notes } = req.body;
    const shipment = await Shipment.findById(req.params.id);
    
    if (!shipment) return errorResponse(res, 'Shipment not found', 404);

    shipment.status = status;
    if (status === 'delivered') shipment.actualDelivery = new Date();
    
    shipment.statusHistory.push({ status, date: new Date(), location, notes });
    await shipment.save();

    // Send notification
    await notificationService.sendShipmentUpdate(shipment.userId, shipment);

    successResponse(res, shipment, 'Status updated');
  } catch (error) {
    next(error);
  }
};

export const getAllShipments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.courier) query.courier = req.query.courier;

    const [shipments, total] = await Promise.all([
      Shipment.find(query).populate('userId', 'name email').skip(skip).limit(limit).sort('-createdAt'),
      Shipment.countDocuments(query)
    ]);

    paginateResponse(res, shipments, page, limit, total);
  } catch (error) {
    next(error);
  }
};

export const bulkCreate = async (req, res, next) => {
  try {
    const { shipments } = req.body;
    if (!Array.isArray(shipments) || shipments.length === 0) {
      return errorResponse(res, 'Shipments array required', 400);
    }

    const shipmentsToCreate = shipments.map(s => ({
      ...s,
      trackingNumber: `TRK-${uuidv4().split('-')[0].toUpperCase()}`,
      statusHistory: [{ status: 'pending', date: new Date() }]
    }));

    const result = await Shipment.insertMany(shipmentsToCreate);
    successResponse(res, result, `${result.length} shipments created`, 201);
  } catch (error) {
    next(error);
  }
};
