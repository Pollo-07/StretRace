"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_service_1 = require("../../../infrastructure/cloudinary/cloudinary.service");
class userServices {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(user) {
        return await this.userRepository.createUser(user);
    }
    async getUser(id) {
        return await this.userRepository.getUser(id);
    }
    async deleteUser(id) {
        return await this.userRepository.deleteUser(id);
    }
    async updateUser(user, id, file) {
        const cloudinary = new cloudinary_service_1.CloudinaryService();
        let updatedUser = { ...user };
        if (file) {
            const urlFotoPerfil = await cloudinary.upload(file);
            updatedUser = {
                ...updatedUser,
                foto_perfil: urlFotoPerfil,
            };
        }
        return await this.userRepository.updateUser(updatedUser, id);
    }
    async findByEmail(email) {
        return await this.userRepository.findByEmail(email);
    }
    //    async  getDashboard (id:string):Promise<Dashborad>{
    //   return await this.userRepository.getDashboard(id)
    //  }
    async discoverPilot(userId) {
        const user = await this.userRepository.getUser(userId);
        const zona = user.zona_ciudad;
        return await this.userRepository.discoverPilot(zona, userId);
    }
    async respectPilot(userId, respectUserId) {
        return await this.userRepository.respectPilot(userId, respectUserId);
    }
    async getrespectPilot(userId) {
        return await this.userRepository.getRespectPilot(userId);
    }
    //admin
    async getUserAll() {
        return await this.userRepository.UserAll();
    }
    async getUserAllSearch(search, offset, limit) {
        return await this.userRepository.UserAllSearch(search, offset, limit);
    }
}
exports.default = userServices;
//# sourceMappingURL=userServices.js.map