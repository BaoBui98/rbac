import { Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PATH_METADATA } from '@nestjs/common/constants';

@Injectable()
export class ManageService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  getAllControllers() {
    const controllers = this.discoveryService.getControllers();
    
    const controllerNames = controllers
      .filter((wrapper) => wrapper.instance && wrapper.metatype)
      .map((wrapper) => {
        // Sử dụng toán tử ! (non-null assertion) vì ta đã filter wrapper.metatype ở trên
        const path = this.reflector.get<string>(PATH_METADATA, wrapper.metatype!);
        return path;
      })
      .filter((path) => path && path !== '/' && path !== '');

    // Remove duplicates
    return [...new Set(controllerNames)];
  }
}
