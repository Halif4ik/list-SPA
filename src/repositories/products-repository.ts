interface IProduct {
    text: string
    checked?: boolean
    id: number
    editable?: number
}

const products: Array<IProduct> = [{text: 'tomato', 'id': 1} as IProduct,
    {text: 'banana', 'id': 2} as IProduct, {text: 'cucumber', 'id': 3} as IProduct]

export const productsRepository = {
    /*  findByTitle(title: string | null): IProduct | undefined {
          let result: IProduct | undefined;
          result = products.find(function (product: IProduct) {
              return product.text?.includes(title ? title : '');
          });
          return result;
      },

      getProdBiId(id: number): IProduct | undefined {
          let result: IProduct | undefined;
          result = products.find(function (product: IProduct) {
              return product.id === id;
          });
          return result;
      },*/

    getAllProd(): IProduct[] {
        return products;
    },

    createProduct(text: string): IProduct |{ id: number } {
        const newId: number = products.length ? products[products.length - 1].id + 1 : 0;
        const newProd = {
            text: text,
            checked: false,
            id: newId
        } as IProduct

        products.push(newProd);
        return newProd;
    },

    /*  updateProduct(title: string, id: number): boolean {
          const foundProduct: IProduct | undefined = products.find(function (product) {
              return product.id === +id;
          });
          if (foundProduct) foundProduct.text = title;
          return !!foundProduct;

      },

      deleteProduct(id: number): IProduct | undefined {
          let deletedProduct: IProduct | undefined;
          for (let i = 0; i < products.length; i++) {
              if (products[i].id === id) {
                  deletedProduct = products[i];
                  products.splice(i, 1);
                  return deletedProduct;
              }
          }
          return undefined;
      }*/
};
