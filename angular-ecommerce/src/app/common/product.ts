export class Product {
  constructor(
    public id: number,
    public sku: string,
    public name: string,
    public description: string,
    public imageUrl: string,
    public active: boolean,
    public unitPrice: number,
    public unitsInStock: number,
    public dateCreated: Date,
    public lastUpdated: Date) {

  }
}
