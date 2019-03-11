'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
  postId: { type: 'ObjectId', ref: 'Post' },
  contentId: String,
  nickName: String,
  logoUrl: String,
  content: String,
  createTime: Date,
  likeNum: Number,
  replies: [{
    content: String,
    createTime: Date,
    likeNum: Number
  }]
});

Comment.plugin(require('motime'));

Comment.index({ contentId: 1 }, { unique: true });

mongoose.model('Comment', Comment);
