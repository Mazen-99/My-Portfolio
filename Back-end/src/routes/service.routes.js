const serviceController = require('../controllers/service.controller');
const verifyAdmin = require('../middleware/adminAuth');

module.exports = (express) => {
    const router = express.Router();

    router.get('/', serviceController.getServices);
    router.post('/', verifyAdmin, serviceController.createService);
    router.put('/:id', verifyAdmin, serviceController.updateService);
    router.delete('/:id', verifyAdmin, serviceController.deleteService);

    return router;
};
