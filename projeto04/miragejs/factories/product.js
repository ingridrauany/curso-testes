/*
 * Mirage JS guide on Factories: https://miragejs.com/docs/data-layer/factories
 */
import { Factory } from 'miragejs';

/*
 * Faker Github repository: https://github.com/Marak/Faker.js#readme
 */
import { faker } from '@faker-js/faker';

export default {
  product: Factory.extend({
    title() {
      return faker.lorem.words();
    },
    price() {
      return faker.commerce.price();
    },
    image() {
      return faker.image.urlLoremFlickr();
    },
  }),
};
