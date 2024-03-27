// eslint-disable-next-line max-lines-per-function
function createProduct(id, name, stock, price) {
  return {
    id,
    name,
    stock,
    price,
    setPrice(newPrice) {
      if (newPrice < 0) {
        console.log('price cannot be negative');
      } else {
        this.price = newPrice;
      }
    },

    describeProduct() {
      prompt(`Name: ${this.name}`);
      prompt(`ID: ${this.id}`);
      prompt(`Price: $${this.price}`);
      prompt(`Stock: ${this.stock}`);
    }
  };
}

function prompt(str) {
  console.log(`=> ${str}`);
}

let scissors = createProduct(0, 'Scissors', 8, 10);
let drill = createProduct(1, 'Cordless Drill', 15, 45);
let hammer = createProduct(2, 'Hammer', 10, 5);

scissors.setPrice(11);
drill.setPrice(-19);

scissors.describeProduct();
drill.describeProduct();
hammer.describeProduct();
