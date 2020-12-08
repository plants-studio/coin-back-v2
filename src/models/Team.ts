import mongooseUniqueValidator from 'mongoose-unique-validator';
import { createSchema, Type, typedModel } from 'ts-mongoose';
import { mongoosePagination } from 'ts-mongoose-pagination';

const Team = createSchema(
  {
    name: Type.string({ required: true, unique: true, trim: true }),
    introduce: Type.string({ required: true }),
    leader: Type.string({ required: true }),
    list: Type.array({ required: true }).of({
      name: Type.string({ unique: true }),
      status: Type.string({ default: 'WAITING' }),
    }),
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

Team.index(
  {
    name: 'text',
    introduce: 'text',
    leader: 'text',
    list: { name: 'text' },
  },
  { defaultLanguage: 'kr' },
);
Team.plugin(mongooseUniqueValidator);
Team.plugin(mongoosePagination);

const model = typedModel('Team', Team);
model.createIndexes();

export default model;
