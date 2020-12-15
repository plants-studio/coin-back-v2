import mongooseUniqueValidator from 'mongoose-unique-validator';
import { createSchema, Type, typedModel } from 'ts-mongoose';

import { Team } from '.';

const League = createSchema(
  {
    title: Type.string({ required: true }),
    deadline: Type.date({ required: true }),
    startDate: Type.date({ required: true }),
    endDate: Type.date({ required: true }),
    introduce: Type.string({ required: true }),
    rule: Type.string({ required: true }),
    thumbnail: Type.string(),
    game: Type.string({ required: true }),
    teamMin: Type.number({ required: true }),
    teamMax: Type.number({ required: true }),
    teamMemMin: Type.number({ required: true }),
    online: Type.boolean({ required: true }),
    location: Type.string({ required: true }),
    participant: Type.number({ required: true, default: 0 }),
    host: Type.string({ required: true }),
    team: Type.array({ required: true, default: [] }).of(Team),
    status: Type.string({ required: true, default: 'RECRUIT' }),
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

League.index({ title: 'text', introduce: 'text', host: 'text' }, { defaultLanguage: 'kr' });
League.plugin(mongooseUniqueValidator);

const model = typedModel('League', League);
model.createIndexes();

export default model;
