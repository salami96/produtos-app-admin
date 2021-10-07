import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category, Product, Store } from '../services/entities';
import { SnackbarService } from '../services/snackbar.service';
import { StoreService } from '../services/store.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  categories: Category[];
  disabledCategories: Category[];
  products: Product[];
  disabledProducts: Product[];
  subs: Subscription[] = [];
  store: Store;
  loading = false;
  all: Category;
  selectedProduct: Product;
  isNewProduct: boolean;
  errors: boolean[] = [];
  preview: string;
  files: File[] = [];
  photoQuantity: number;
  arr: any[];
  valid: boolean;
  oldImages: string[];
  addingSize: boolean;
  newSize = {
    name: '',
    value: undefined
  };
  addingExtra: boolean;
  newExtra = {
    name: '',
    value: undefined
  };
  addingOption: boolean;
  newOption: string;
  needHelp = false;

  constructor(
    private storeService: StoreService,
    private userService: UserService,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit() {
    this.subs.push(
      this.storeService.getStore.subscribe(this.setStore)
    );
    if (!this.store) {
      this.init();
    }
  }

  init() {
    this.setStore(this.storeService.getSelectedStore());
  }

  setStore = (store: Store) => {
    this.loading = false;
    this.store = store;
    this.subs.push(
      this.storeService.getProperties().subscribe(this.classify),
      this.storeService.getProducts(store.code).subscribe(this.classifyProducts),
    );
    this.setProduct();
  }

  classify = (resp: any) => {
    this.categories = [];
    this.disabledCategories = [];
    resp.c.forEach((cat: Category) => {
      if (cat.name == 'Todos') {
        this.all = cat;
        return;
      }
      if (this.store.categories.some(c => cat.name == c.name)) {
        this.categories.push(cat);
      } else {
        this.disabledCategories.push(cat);
      }
    });
    this.disabledCategories.sort(this.sortFnCat);
    this.categories.sort(this.sortFnCat);
  }

  classifyProducts = (resp: Product[]) => {
    this.products = [];
    this.disabledProducts = [];
    resp.forEach(prod => {
      if (prod.active) {
        this.products.push(prod);
      } else {
        this.disabledProducts.push(prod);
      }
    });
    this.products.sort(this.sortFnProd);
    this.disabledProducts.sort(this.sortFnProd);
  }

  moveCategory(cat: Category, from: Category[], to: Category[]) {
    to.push(
      ...from.splice(from.findIndex(c => c._id == cat._id), 1)
    );
    to.sort(this.sortFnCat);
    this.saveChanges('categorias');
  }

  sortFnCat = (a: Category, b: Category) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
  sortFnProd = (a: Product, b: Product) => a.cod.toLowerCase() > b.cod.toLowerCase() ? 1 : -1;

  moveProduct(prod: Product, from: Product[], to: Product[]) {
    console.log(prod.name)
    prod.active = !prod.active;
    to.push(
      ...from.splice(from.findIndex(p => p._id == prod._id), 1)
    );
    to.sort(this.sortFnProd);
    this.saveChanges('product', prod);
  }

  setProduct(prod?: Product) {
    if (prod) {
      this.isNewProduct = false;
      this.selectedProduct = prod;
      this.oldImages = prod.imgs;
      this.photoQuantity = prod.imgs.length;
    } else {
      this.photoQuantity = 1;
      this.isNewProduct = true;
      this.selectedProduct = {
        cod: '',
        store: this.store.code,
        categories: [],
        name: '',
        imgs: [],
        sizes: [],
        unity: 'Tamanho',
        extras: [],
        optional: [],
        active: true,
      };
    }
    this.arr = Array(this.photoQuantity).fill(1);
  }

  focus(field: string) {
    document.getElementById(field).focus();
  }

  productHasCategory = (cat: Category) => {
    return this.selectedProduct.categories.find(c => c._id == cat._id);
  }

  setProductCategory(cat: Category) {
    if (this.productHasCategory(cat)) {
      this.selectedProduct.categories.forEach((c, i) => {
        if (c.name == cat.name) {
          this.selectedProduct.categories.splice(i, 1)
        }
      });
    } else {
      this.selectedProduct.categories.push(cat);
    }
  }

  validate() {
    this.valid = true;
    this.errors = [];
    if (this.selectedProduct.imgs.length == 0) {
      this.setError('img');
    }
    if (!this.selectedProduct.cod || (/\W/).test(this.selectedProduct.cod)) {
      this.setError('cod');
    }
    if (!this.selectedProduct.name) {
      this.setError('name');
    }
    if (this.selectedProduct.categories.length == 0) {
      this.setError('categories');
    }
    if (!this.selectedProduct.unity) {
      this.setError('unity');
    }
    if (this.selectedProduct.sizes.length == 0) {
      this.setError('sizes');
    }
    if (!this.valid) {
      this.snackbar.show('Verifique o preenchimento dos dados acima', 'error')
    }
    return this.valid;
  }

  setError(id: string) {
    this.errors[id] = true;
    this.valid = false;
  }

  saveChanges(field: string, obj?: any) {
    this.loading = true;
    const isNotAdmin = !this.store.ownerUid
    if (isNotAdmin) this.store.ownerUid = this.userService._user.uid;
    switch (field) {
      case 'categorias':
        this.store.categories = [ this.all, ...this.categories ];
        this.storeService.updateStore(this.store).subscribe(resp => {
          this.loading = false;
          if (resp) {
            this.snackbar.show('Dados alterados com sucesso!');
            if (isNotAdmin) resp.ownerUid = null;
            this.storeService.setStore(resp);
          } else {
            this.snackbar.show('Ocorreu um erro ao salvar as alterações!', 'error');
          }
        });
      break;
      case 'product':
        this.storeService.updateProduct(obj, this.getUid()).subscribe(resp => {
          this.loading = false;
          if (resp) {
            this.snackbar.show('Dados alterados com sucesso!');
            if (resp.active) {
              this.products.forEach(p => p = resp._id == p._id ? resp : p );
            } else {
              this.disabledProducts.forEach(p => p = resp._id == p._id ? resp : p );
            }
          } else {
            this.snackbar.show('Ocorreu um erro ao salvar as alterações!', 'error');
          }
        });
      break;
      case 'edited-product':
        if (this.validate()) {
          if (this.selectedProduct.imgs == this.oldImages) {
            this.saveChanges('product', this.selectedProduct);
          } else {
            let notModified = [];
            this.selectedProduct.imgs.forEach(img => {
              if (img.includes('cloudinary')) notModified.push(img);
            });
            this.storeService.uploadPhotos(this.files, `${this.store.code}/${this.selectedProduct.cod}`).subscribe(resp => {
              if (resp.status) {
                this.selectedProduct.imgs = [ notModified, ...resp.urls ];
                console.log(this.selectedProduct.imgs)
                // this.saveChanges('product', this.selectedProduct)
              } else {
                this.loading = false;
                this.snackbar.show('Ocorreu um erro ao enviar a(s) imagen(s)', 'error');
              }
            });
          }
        }
      break;
      case 'new-product':
        if (this.validate()) {
          this.selectedProduct.imgs  = []
          this.storeService.createProduct(this.files, this.selectedProduct, this.getUid()).subscribe(resp => {
            this.loading = false;
            document.getElementById('product-success').click();
            if (resp) {
              this.snackbar.show('Produto incluído com sucesso!');
              this.products.push(resp);
            } else {
              this.snackbar.show('Ocorreu um erro ao salvar o produto!', 'error');
            }
          });
        } else {
          this.loading = false;
        }
      break;
    }
  }

  addPhoto() {
    this.photoQuantity++;
    this.arr = Array(this.photoQuantity).fill(1);
  }

  rmPhoto(i: number) {
    this.photoQuantity--;
    let deleted = this.selectedProduct.imgs.splice(i, 1);
    this.arr.splice(i, 1);
    if (!deleted.includes('cloudinary')) this.files.splice(i, 1);
    console.log(this.selectedProduct.imgs)
    console.log(this.files)
    console.log(this.arr)
  }

  readFile(e: any, i: number) {
    this.errors['img'] = false;
    this.selectedProduct.imgs[i] = '';
    this.files[i] = (e.target as HTMLInputElement).files[0];

    if (this.files[i] && this.files[i].type.includes('image')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedProduct.imgs[i] = reader.result as string;
      }
      reader.readAsDataURL(this.files[i])
    }
  }

  getUid() {
    return this.store.ownerUid ? this.store.ownerUid : this.userService._user.uid;
  }

  revertSize() {
    this.errors['newSize'] = false;
    this.addingSize = false;
    this.newSize = {
      name: '',
      value: undefined
    };
  }

  setSize() {
    this.newSize.value = this.newSize.value.replace(',','.');
    console.log(this.newSize.value)
    if (this.newSize.name && this.newSize.value >= 0) {
      this.selectedProduct.sizes.push(this.newSize);
      this.addingSize = false;
      this.revertSize();
    } else {
      this.errors['newSize'] = true;
    }
  }

  deleteSize(index: number) {
    this.selectedProduct.sizes.splice(index, 1);
  }

  revertExtra() {
    this.errors['newExtra'] = false;
    this.addingExtra = false;
    this.newExtra = {
      name: '',
      value: undefined
    };
  }

  setExtra() {
    this.newExtra.value = this.newExtra.value.replace(',','.');
    console.log(this.newExtra.value)
    if (this.newExtra.name && this.newExtra.value >= 0) {
      this.selectedProduct.extras.push(this.newExtra);
      this.addingExtra = false;
      this.revertExtra();
    } else {
      this.errors['newExtra'] = true;
    }
  }

  deleteExtra(index: number) {
    this.selectedProduct.extras.splice(index, 1);
  }

  revertOption() {
    this.errors['newOption'] = false;
    this.addingOption = false;
    this.newOption = '';
  }

  setOption() {
    if (this.newOption) {
      this.selectedProduct.optional.push(this.newOption);
      this.addingOption = false;
      this.revertOption();
    } else {
      this.errors['newOption'] = true;
    }
  }

  deleteOption(index: number) {
    this.selectedProduct.optional.splice(index, 1);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

}
