import { Request, Response } from 'express';

import { Comment, Post } from '../models';
import { AuthRequest } from '../types';

const create = async (req: AuthRequest, res: Response) => {
  const { token } = req;
  const { title, content, category } = req.body;

  const newComment = new Comment();
  await newComment.save();

  const newPost = new Post({
    title,
    content,
    category,
    writer: token!.name,
    comment: newComment.id,
  });
  await newPost.save();
  res.sendStatus(201);
};

const read = async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) {
    res.sendStatus(404);
    return;
  }

  res.send(post);
};

const remove = async (req: AuthRequest, res: Response) => {
  const { token } = req;
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) {
    res.sendStatus(404);
    return;
  }

  if (post.writer !== token!.name) {
    res.sendStatus(403);
    return;
  }

  await post.deleteOne();

  res.sendStatus(200);
};

export { create, read, remove };
