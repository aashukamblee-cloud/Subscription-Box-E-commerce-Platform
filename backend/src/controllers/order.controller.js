import Order from '../models/Order.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createOrder = async (req, res, next) => {
  try {
    const { customerDetails, items, subtotal, shipping, tax, total, currency, paymentMethod } = req.body;
    
    if (!customerDetails || !items || items.length === 0) {
      return errorResponse(res, 'Incomplete order payload', 400);
    }

    // Save order in database
    const order = await Order.create({
      userId: req.user ? req.user._id : null,
      customerDetails,
      items,
      subtotal,
      shipping,
      tax,
      total,
      currency,
      paymentMethod
    });

    // Retrieve all administrators and operators
    const admins = await User.find({ role: { $in: ['superadmin', 'operator'] } });

    // Generate detailed HTML/Text breakdown of "all over data" for notifications
    const itemsList = items.map(item => `• ${item.name} (${item.quantity}x) at $${item.price.toFixed(2)}`).join('\n');
    const orderDetailsText = `New Order #${order._id} Placed!\n\nCustomer: ${customerDetails.name}\nEmail: ${customerDetails.email}\nPhone: ${customerDetails.phone}\nAddress: ${customerDetails.address.street}, ${customerDetails.address.city}, ${customerDetails.address.state} - ${customerDetails.address.zipCode}, ${customerDetails.address.country}\n\nItems:\n${itemsList}\n\nTotal paid: ${currency === 'INR' ? '₹' : '$'}${total.toFixed(2)} via ${paymentMethod}`;

    // Create notifications for all admins
    await Promise.all(admins.map(admin => {
      return Notification.create({
        userId: admin._id,
        type: 'payment_success',
        title: `🔥 New Order from ${customerDetails.name}`,
        message: `Order #${order._id.toString().substring(18)} has been placed for a total of ${currency === 'INR' ? '₹' : '$'}${total.toFixed(2)}.`,
        channel: 'in_app',
        metadata: {
          orderId: order._id,
          customerName: customerDetails.name,
          customerEmail: customerDetails.email,
          customerPhone: customerDetails.phone,
          customerAddress: customerDetails.address,
          total: total,
          currency: currency,
          items: items
        }
      });
    }));

    successResponse(res, order, 'Order created successfully and admin notified!', 201);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort('-createdAt');
    successResponse(res, orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return errorResponse(res, 'Invalid order status', 400);
    }
    
    const order = await Order.findById(id);
    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }
    
    order.status = status;
    await order.save();
    
    // Also notify user/admins if necessary, but returning the updated order is key
    successResponse(res, order, 'Order status updated successfully');
  } catch (error) {
    next(error);
  }
};
