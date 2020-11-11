const Mock = require('../src/mock');

const random = Mock.mock({
    key: '@word(1)'
})

console.log(random);
