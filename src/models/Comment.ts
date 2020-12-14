import { createSchema, Type, typedModel } from 'ts-mongoose';

const Comment = createSchema(
  {
    list: Type.array({ required: true }).of({
      writer: Type.string({ required: true }),
      content: Type.string({ required: true }),
    }),
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export default typedModel('Comment', Comment);
