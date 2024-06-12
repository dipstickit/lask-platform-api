import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryGroup } from '../../module/catalog/categories/entities/category-group.entity';
import { Category } from '../../module/catalog/categories/entities/category.entity';

@Injectable()
export class SeedingService {
    constructor(
        @InjectRepository(CategoryGroup)
        private categoryGroupRepository: Repository<CategoryGroup>,

        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,


    ) { }

    async seedDatabase() {
        const categoryGroupData = [
            { name: 'Electronics' },
            { name: 'Home Appliances' }
        ];

        const categoryData = [
            {
                name: 'Phones',
                description: 'Smartphones and accessories',
                slug: 'phones',
                groups: ['Electronics']
            },
            {
                name: 'Laptops',
                description: 'Portable computers',
                slug: 'laptops',
                groups: ['Electronics']
            }
        ];

        // Insert CategoryGroup Data
        for (const groupData of categoryGroupData) {
            const categoryGroup = this.categoryGroupRepository.create(groupData);
            await this.categoryGroupRepository.save(categoryGroup);
        }

        // Insert Category Data
        for (const categoryDataItem of categoryData) {
            const category = new Category();
            category.name = categoryDataItem.name;
            category.description = categoryDataItem.description;
            category.slug = categoryDataItem.slug;

            category.groups = [];
            for (const groupName of categoryDataItem.groups) {
                const group = await this.categoryGroupRepository.findOne({ where: { name: groupName } });
                if (group) {
                    category.groups.push(group);
                }
            }

            await this.categoryRepository.save(category);
        }
    }
}
