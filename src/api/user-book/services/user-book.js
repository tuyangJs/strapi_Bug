'use strict';

/**
 * user-book service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-book.user-book');
