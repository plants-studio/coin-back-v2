import mongooseUniqueValidator from 'mongoose-unique-validator';
import { createSchema, Type, typedModel } from 'ts-mongoose';
import { mongoosePagination } from 'ts-mongoose-pagination';

const Post = createSchema(
  {
    title: Type.string({ required: true }),
    content: Type.string({ required: true }),
    writer: Type.string({ required: true }),
    category: Type.string({ required: true }),
    comment: Type.objectId({ required: true, unique: true }),
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

Post.index({ title: 'text', content: 'text', writer: 'text' }, { defaultLanguage: 'kr' });
Post.plugin(mongooseUniqueValidator);
Post.plugin(mongoosePagination);

const model = typedModel('Post', Post);
model.createIndexes();

export default model;
