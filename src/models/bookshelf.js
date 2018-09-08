import knex from 'knex';
import bookshelf from 'bookshelf';
import {DateTime} from 'luxon';

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  },
  pool: {
    min: 0,
    max: 10
  }
});

const models = bookshelf(db);

export const Album = models.Model.extend({
  tableName: 'albums',
  coverPhoto: function() {
    return this.hasOne(Photo, 'id', 'cover_photo');
  },
  parse: function(response) {
    response.start_date = DateTime.fromJSDate(response.start_date);
    response.end_date = DateTime.fromJSDate(response.end_date);

    return response;
  },
  format: function(attributes) {
    if (attributes.start_date) {
      attributes.start_date = attributes.start_date.toJSDate();
    }

    if (attributes.end_date) {
      attributes.end_date = attributes.end_date.toJSDate();
    }
    
    return attributes;
  }
});

export const Photo = models.Model.extend({
  tableName: 'photos',
  album: function() {
    return this.belongsTo(Album);
  },
  parse: function(response) {
    response.date_taken = DateTime.fromJSDate(response.date_taken);
    return response;
  },
  format: function(attributes) {
    if (attributes.date_taken) {
      attributes.date_taken = attributes.date_taken.toJSDate();
    }
    return attributes;
  }
});

export const Post = models.Model.extend({
  tableName: 'posts',
  coverPhoto: function() {
    return this.hasOne(Photo, 'id', 'cover_photo');
  },
  parse: function(response) {
    response.post_date = DateTime.fromJSDate(response.post_date);
    return response;
  },
  format: function(attributes) {
    attributes.post_date = attributes.post_date.toJSDate();
    return attributes;
  }
});

export const Scripture = models.Model.extend({
  tableName: 'scriptures'
});