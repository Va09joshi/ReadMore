import { User } from '../../models/User.js';
import { Provider } from '../../models/Provider.js';
import { Product } from '../../models/Product.js';
import { Order } from '../../models/Order.js';
import { Subscription } from '../../models/Subscription.js';
import { Settings } from '../../models/Settings.js';
import { SupportTicket } from '../../models/SupportTicket.js';
import { Review } from '../../models/Review.js';
import { Category } from '../../models/Category.js';
import { ActivityLog } from '../../models/ActivityLog.js';

// @desc    Get dashboard stats
// @route   GET /api/v1/admin/dashboard-stats
// @access  Private/SuperAdmin
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await Provider.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // We might not have a status field in Subscription depending on the schema, but assuming it exists
    const totalSubscriptions = await Subscription.countDocuments();

    // Calculate real pending approvals
    const pendingApprovals = await Provider.countDocuments({ approved: false });

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Calculate real monthly revenue
    const monthlyRevenueResult = await Order.aggregate([
      { $match: { createdAt: { $gte: firstDayOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const monthlyRevenue = monthlyRevenueResult.length > 0 ? monthlyRevenueResult[0].total : 0;

    // Real revenue data for chart (last 6 months)
    const revenueAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { 
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Real user growth data for chart
    const userAgg = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { 
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          users: { $sum: 1 }
        }
      }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueData = [];
    const userGrowthData = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth() + 1; // 1-12
      const y = d.getFullYear();
      
      const revFound = revenueAgg.find(r => r._id.month === m && r._id.year === y);
      revenueData.push({
        name: monthNames[m - 1],
        total: revFound ? revFound.total : 0
      });

      const usrFound = userAgg.find(u => u._id.month === m && u._id.year === y);
      userGrowthData.push({
        name: monthNames[m - 1],
        users: usrFound ? usrFound.users : 0
      });
    }

    const stats = {
      totalUsers,
      totalProviders,
      totalProducts,
      totalOrders,
      totalSubscriptions,
      monthlyRevenue, 
      pendingApprovals, 
      revenueData,
      userGrowthData
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/SuperAdmin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all providers
// @route   GET /api/v1/admin/providers
// @access  Private/SuperAdmin
export const getProviders = async (req, res, next) => {
  try {
    const providers = await Provider.find().populate('ownerId', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: providers.length, data: providers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products
// @route   GET /api/v1/admin/products
// @access  Private/SuperAdmin
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('provider', 'companyName').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/v1/admin/orders
// @access  Private/SuperAdmin
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('providerId', 'companyName')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subscriptions
// @route   GET /api/v1/admin/subscriptions
// @access  Private/SuperAdmin
export const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('userId', 'name email')
      .populate('productId', 'title')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: subscriptions.length, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/v1/admin/users/:id
// @access  Private/SuperAdmin
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/v1/admin/users/:id
// @access  Private/SuperAdmin
export const updateUser = async (req, res, next) => {
  try {
    const { name, phone, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Suspend or Activate user
// @route   PUT /api/v1/admin/users/:id/suspend
// @access  Private/SuperAdmin
export const suspendUser = async (req, res, next) => {
  try {
    const { status } = req.body; // 'ACTIVE' or 'SUSPENDED'
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/SuperAdmin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get global settings
// @route   GET /api/v1/admin/settings
// @access  Private/SuperAdmin
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({}); // Create default if missing
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update global settings
// @route   PUT /api/v1/admin/settings
// @access  Private/SuperAdmin
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    const updatedSettings = await Settings.findByIdAndUpdate(
      settings._id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: updatedSettings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get support tickets
// @route   GET /api/v1/admin/support
// @access  Private/SuperAdmin
export const getSupportTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find().populate('user', 'name email role').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    next(error);
  }
};

// @desc    Close a support ticket
// @route   PUT /api/v1/admin/support/:id/close
// @access  Private/SuperAdmin
export const closeSupportTicket = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, { status: 'CLOSED' }, { new: true });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews
// @route   GET /api/v1/admin/reviews
// @access  Private/SuperAdmin
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate('user', 'name email').populate('product', 'title').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all activity logs
// @route   GET /api/v1/admin/activity-logs
// @access  Private/SuperAdmin
export const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find()
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 })
      .limit(500);
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories
// @route   GET /api/v1/admin/categories
// @access  Private/SuperAdmin
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/v1/admin/categories
// @access  Private/SuperAdmin
export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/v1/admin/categories/:id
// @access  Private/SuperAdmin
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/v1/admin/categories/:id
// @access  Private/SuperAdmin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a subscription
// @route   PUT /api/v1/admin/subscriptions/:id/cancel
// @access  Private/SuperAdmin
export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, { status: 'CANCELLED', endDate: Date.now() }, { new: true });
    if (!subscription) return res.status(404).json({ success: false, message: 'Subscription not found' });
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// @desc    Update provider status (Approve/Reject)
// @route   PUT /api/v1/admin/providers/:id/status
// @access  Private/SuperAdmin
export const updateProviderStatus = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { approved: isApproved },
      { new: true }
    );
    if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });

    // Update the user role based on approval
    if (isApproved) {
      await User.findByIdAndUpdate(provider.ownerId, { role: 'PROVIDER' });

      // Send approval email
      try {
        const { sendEmail } = await import('../../utils/sendEmail.js');
        await sendEmail({
          to: provider.email,
          subject: 'Your Publisher Application Has Been Approved! 🎉',
          text: `Congratulations! Your publisher application for "${provider.companyName}" has been approved. You can now log in and access your publisher dashboard to manage your publications.`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="font-size: 28px; color: #202940; margin-bottom: 10px;">Application Approved!</h1>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Congratulations! Your publisher application for <strong>"${provider.companyName}"</strong> has been approved by our team.
              </p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                You can now log in and access your <strong>Publisher Dashboard</strong> to start managing your publications, track analytics, and grow your readership.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/provider-dashboard" style="background: #202940; color: white; padding: 14px 32px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-size: 13px;">
                  Go to Dashboard →
                </a>
              </div>
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 40px;">
                — The ReadMore Team
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Failed to send approval email:', emailErr);
      }
    } else {
      // Rejected — revert role back to USER
      await User.findByIdAndUpdate(provider.ownerId, { role: 'USER' });

      // Send rejection email
      try {
        const { sendEmail } = await import('../../utils/sendEmail.js');
        await sendEmail({
          to: provider.email,
          subject: 'Update on Your Publisher Application',
          text: `We regret to inform you that your publisher application for "${provider.companyName}" has not been approved at this time. Please contact support for more details.`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="font-size: 28px; color: #202940; margin-bottom: 10px;">Application Update</h1>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                We have reviewed your publisher application for <strong>"${provider.companyName}"</strong>.
              </p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Unfortunately, your application has not been approved at this time. This could be due to incomplete information or not meeting our current requirements.
              </p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                If you believe this was a mistake or would like more details, please reach out to our support team.
              </p>
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 40px;">
                — The ReadMore Team
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Failed to send rejection email:', emailErr);
      }
    }

    res.status(200).json({ success: true, data: provider });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete provider
// @route   DELETE /api/v1/admin/providers/:id
// @access  Private/SuperAdmin
export const deleteProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    res.status(200).json({ success: true, message: 'Provider deleted successfully' });
  } catch (error) {
    next(error);
  }
};
