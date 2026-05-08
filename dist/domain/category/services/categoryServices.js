"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class categoryServices {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async createCategory(category) {
        return await this.categoryRepository.createCategory(category);
    }
    async getCategory(id) {
        return await this.categoryRepository.getCategory(id);
    }
    async deleteCategory(id) {
        return await this.categoryRepository.deleteCategory(id);
    }
    async updateCategory(category) {
        return await this.categoryRepository.updateCategory(category);
    }
}
exports.default = categoryServices;
//# sourceMappingURL=categoryServices.js.map