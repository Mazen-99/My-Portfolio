const Visitor = require('../schemas/Visitor');

// POST /api/admin/track-visit - Public
exports.trackVisit = async (req, res) => {
  try {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ip = rawIp.replace('::ffff:', '');
    const userAgent = req.headers['user-agent'];

    await Visitor.create({ ip, userAgent });

    res.status(200).json({ success: true, ip });
  } catch (error) {
    console.error('Visit Track Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/admin/visitors - Admin only
exports.getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ timestamp: -1 });
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const currentIp = rawIp.replace('::ffff:', '');

    res.status(200).json({ visitors, currentIp });
  } catch (error) {
    console.error('Get Visitors Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/admin/visitors/:id - Admin only
exports.deleteVisitor = async (req, res) => {
  try {
    await Visitor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    console.error('Delete Visitor Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/admin/visitors - Admin only (Clean sweep)
exports.deleteAllVisitors = async (req, res) => {
  try {
    await Visitor.deleteMany({});
    res.status(200).json({ message: 'All visitor logs cleared' });
  } catch (error) {
    console.error('Clear Visitors Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
