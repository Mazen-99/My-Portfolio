const Service = require('../schemas/Service');

exports.getServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1 });
        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createService = async (req, res) => {
    try {
        const { title, description, icon, order } = req.body;
        const newService = new Service({ title, description, icon, order });
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, icon, order } = req.body;
        const updatedService = await Service.findByIdAndUpdate(
            id,
            { title, description, icon, order },
            { new: true }
        );
        if (!updatedService) return res.status(404).json({ message: 'Service not found' });
        res.status(200).json(updatedService);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedService = await Service.findByIdAndDelete(id);
        if (!deletedService) return res.status(404).json({ message: 'Service not found' });
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
