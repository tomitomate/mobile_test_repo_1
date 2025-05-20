import express from 'express';
import { PrismaClient } from '@prisma/client';
import { boardSchema, groupSchema, itemSchema } from '../shared/schemas';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Boards
app.get('/boards', async (_req, res) => {
  const boards = await prisma.board.findMany();
  res.json(boards);
});

app.get('/boards/:id', async (req, res) => {
  const board = await prisma.board.findUnique({ where: { id: req.params.id } });
  if (!board) {
    res.status(404).json({ error: 'Board not found' });
    return;
  }
  res.json(board);
});

app.post('/boards', async (req, res) => {
  const parsed = boardSchema
    .omit({ id: true, createdAt: true })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const board = await prisma.board.create({ data: parsed.data });
  res.json(board);
});

app.put('/boards/:id', async (req, res) => {
  const parsed = boardSchema
    .omit({ id: true, createdAt: true })
    .partial()
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const board = await prisma.board.update({
    where: { id: req.params.id },
    data: parsed.data,
  });
  res.json(board);
});

app.delete('/boards/:id', async (req, res) => {
  await prisma.board.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// Groups
app.get('/boards/:boardId/groups', async (req, res) => {
  const groups = await prisma.group.findMany({
    where: { boardId: req.params.boardId },
    orderBy: { order: 'asc' },
  });
  res.json(groups);
});

app.post('/boards/:boardId/groups', async (req, res) => {
  const parsed = groupSchema
    .omit({ id: true, boardId: true })
    .partial({ order: true })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const maxOrder = await prisma.group.aggregate({
    _max: { order: true },
    where: { boardId: req.params.boardId },
  });
  const group = await prisma.group.create({
    data: {
      ...parsed.data,
      boardId: req.params.boardId,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });
  res.json(group);
});

app.put('/groups/:id', async (req, res) => {
  const parsed = groupSchema
    .omit({ id: true, boardId: true })
    .partial()
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const group = await prisma.group.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(group);
});

app.delete('/groups/:id', async (req, res) => {
  await prisma.group.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// Items
app.get('/groups/:groupId/items', async (req, res) => {
  const items = await prisma.item.findMany({
    where: { groupId: req.params.groupId },
    orderBy: { position: 'asc' },
  });
  res.json(items);
});

app.post('/groups/:groupId/items', async (req, res) => {
  const parsed = itemSchema
    .omit({ id: true, createdAt: true, updatedAt: true, statusChangedAt: true, groupId: true, boardId: true })
    .partial({ position: true })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const group = await prisma.group.findUnique({ where: { id: req.params.groupId } });
  if (!group) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  const maxPosition = await prisma.item.aggregate({
    _max: { position: true },
    where: { groupId: req.params.groupId },
  });
  const item = await prisma.item.create({
    data: {
      ...parsed.data,
      groupId: req.params.groupId,
      boardId: group.boardId,
      position: (maxPosition._max.position ?? 0) + 1,
    },
  });
  res.json(item);
});

app.put('/items/:id', async (req, res) => {
  const parsed = itemSchema
    .omit({ id: true, createdAt: true, updatedAt: true, statusChangedAt: true, groupId: true, boardId: true })
    .partial()
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const existing = await prisma.item.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }
  const statusChanged =
    parsed.data.statusLabel && parsed.data.statusLabel !== existing.statusLabel;
  const item = await prisma.item.update({
    where: { id: req.params.id },
    data: {
      ...parsed.data,
      statusChangedAt: statusChanged ? new Date() : existing.statusChangedAt,
    },
  });
  res.json(item);
});

app.delete('/items/:id', async (req, res) => {
  await prisma.item.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
