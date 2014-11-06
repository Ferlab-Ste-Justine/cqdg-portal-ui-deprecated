module ngApp.cart.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import ICoreService = ngApp.core.services.ICoreService;

  export interface ICartController {
    files: IFiles;
    totalSize: number;
    getTotalSize(): number;
  }

  class CartController implements ICartController {
    totalSize: number = 0;

    /* @ngInject */
    constructor(public files: IFiles, private CoreService: ICoreService, private CartService: ICartService) {
      CoreService.setPageTitle("Cart " + "(" + this.files.hits.length + ")");
      CartService.files = files;
      this.totalSize = this.getTotalSize();
    }

    getTotalSize(): number {
      return _.reduce(this.files.hits, function (sum: number, hit: IFile) {
        return sum + hit.size;
      }, 0);
    }

    // click handlers
    handleRemoveAllClick(): void {
      this.CartService.removeAll();
    }
  }

  angular
      .module("cart.controller", ["cart.services", "core.services"])
      .controller("CartController", CartController);
}

