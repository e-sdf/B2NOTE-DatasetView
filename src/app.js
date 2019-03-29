import {PLATFORM} from 'aurelia-pal';

export class App {
  configureRouter(config, router) {
    config.title = 'B2Note';
    config.map([
      {
        route: ['', 'welcome'],
        name: 'welcome',
        moduleId: PLATFORM.moduleName('./pages/welcome'),
        nav: true,
        title: 'Dashboard'
      },
      {
        route: 'settings',
        name: 'settings',
        moduleId: PLATFORM.moduleName('./pages/settings'),
        nav: true,
        title: 'Settings'
      },
      {
        route: 'fileview',
        name: 'fileview',
        moduleId: PLATFORM.moduleName('./pages/fileview'),
        nav: true,
        title: 'File Manager'
      }
    ]);

    this.router = router;
  }
}
