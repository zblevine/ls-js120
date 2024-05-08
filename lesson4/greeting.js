class Greeting {
  greet(str) {
    console.log(str);
  }
}

class Hello extends Greeting {
  hi() {
    this.greet('Hello');
  }
}

class Goodbye extends Greeting {
  bye() {
    this.greet('Goodbye');
  }
}

new Greeting().greet('heyyyyy');
new Hello().hi();
new Goodbye().bye();