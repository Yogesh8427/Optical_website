const Frame = require('../models/Frame');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Inquiry = require('../models/Inquiry');

exports.getStats = async (_req, res, next) => {
  try {
    const [totalFrames, totalCategories, totalBrands, totalInquiries, recentInquiries, monthlyInquiries] =
      await Promise.all([
        Frame.countDocuments({ active: true }),
        Category.countDocuments({ active: true }),
        Brand.countDocuments({ active: true }),
        Inquiry.countDocuments(),
        Inquiry.find()
          .populate('frameId', 'name')
          .sort({ createdAt: -1 })
          .limit(10),
        Inquiry.aggregate([
          {
            $group: {
              _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.year': -1, '_id.month': -1 } },
          { $limit: 12 },
        ]),
      ]);

    res.json({
      success: true,
      data: {
        counts: { totalFrames, totalCategories, totalBrands, totalInquiries },
        recentInquiries,
        monthlyInquiries: monthlyInquiries.reverse(),
      },
    });
  } catch (err) {
    next(err);
  }
};
