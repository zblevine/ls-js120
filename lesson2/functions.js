// NOTE: Run this code from a file; don't use the REPL

bar();
function bar() {
  console.log("this is bar");
}

// eslint-disable-next-line no-use-before-define
foo();
const foo = function() {
  console.log("this is foo");
};