"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_service_1 = require("../../../infrastructure/cloudinary/cloudinary.service");
class vehicleServices {
    constructor(vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }
    async createVehicle(vehicle, file) {
        const cloudinary = new cloudinary_service_1.CloudinaryService();
        let vehiculo = { ...vehicle };
        if (file) {
            const urlFotoPerfil = await cloudinary.upload(file);
            vehiculo = {
                ...vehiculo,
                foto: urlFotoPerfil,
            };
        }
        return await this.vehicleRepository.createVehicle(vehiculo);
    }
    async getVehicle(id) {
        return await this.vehicleRepository.getVehicle(id);
    }
    async allVehicle(id) {
        return await this.vehicleRepository.allVehicle(id);
    }
    async deleteVehicle(id) {
        return await this.vehicleRepository.deleteVehicle(id);
    }
    async updateVehicle(vehicle) {
        return await this.vehicleRepository.updateVehicle(vehicle);
    }
    async activeVehicle(id, user_id) {
        return await this.vehicleRepository.activeVehicle(id, user_id);
    }
    async disableVehicle(id) {
        return await this.vehicleRepository.disableVehicle(id);
    }
}
exports.default = vehicleServices;
//# sourceMappingURL=vehicleServices.js.map