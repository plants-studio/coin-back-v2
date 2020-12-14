import mongooseUniqueValidator from 'mongoose-unique-validator';
import { createSchema, Type, typedModel } from 'ts-mongoose';

const arr: number[] = [];
for (let i = 10000; i <= 99999; i += 1) {
  arr.push(i);
}

const shuffle = (a: Array<number>) => {
  const result = a;
  for (let i = a.length; i; i -= 1) {
    const j = Math.floor(Math.random() * i);
    const x = a[i - 1];
    result[i - 1] = a[j];
    result[j] = x;
  }
  return result;
};

const Tag = createSchema(
  {
    name: Type.string({ required: true, unique: true, trim: true }),
    list: Type.array({ default: () => shuffle(arr), required: true }).of(
      Type.number(),
    ),
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

Tag.plugin(mongooseUniqueValidator);

export default typedModel('Tag', Tag);
