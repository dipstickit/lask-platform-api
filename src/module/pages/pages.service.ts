import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Page } from './models/page.entity';
import { PageCreateDto } from './dto/page-create.dto';
import { PageUpdateDto } from './dto/page-update.dto';
import { PageGroup } from './models/page-group.entity';
import { NotFoundError } from '../errors/not-found.error';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page) private pagesRepository: Repository<Page>,
    @InjectRepository(PageGroup)
    private pageGroupsRepository: Repository<PageGroup>,
  ) {}

  async getPages() {
    return this.pagesRepository.find();
  }

  async getPageGroups() {
    return this.pageGroupsRepository.find({ relations: ['pages'] });
  }

  async getPage(id: number) {
    const page = await this.pagesRepository.findOne({ where: { id } });
    if (!page) {
      throw new NotFoundError('page', 'id', id.toString());
    }
    return page;
  }

  async createPage(pageData: PageCreateDto) {
    const page = this.pagesRepository.create(pageData);
    return this.pagesRepository.save(page);
  }

  async updatePage(id: number, pageData: PageUpdateDto) {
    const page = await this.getPage(id);

    if (pageData.groups) {
      page.groups = await this.processGroups(pageData.groups);
    }

    Object.assign(page, pageData);
    return this.pagesRepository.save(page);
  }

  async deletePage(id: number) {
    await this.getPage(id);
    await this.pagesRepository.delete(id);
    return true;
  }

  private async processGroups(
    groupsData: { name: string }[],
  ): Promise<PageGroup[]> {
    const groupNames = groupsData.map((group) => group.name);
    const existingGroups = await this.pageGroupsRepository.findBy({
      name: In(groupNames),
    });

    const existingGroupNames = new Set(
      existingGroups.map((group) => group.name),
    );
    const newGroups = groupsData
      .filter((groupData) => !existingGroupNames.has(groupData.name))
      .map((groupData) => {
        const group = new PageGroup();
        group.name = groupData.name;
        return group;
      });

    const savedGroups = await this.pageGroupsRepository.save(newGroups);
    return [...existingGroups, ...savedGroups];
  }
}
