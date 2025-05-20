import express from 'express';
import { PrismaClient } from '@prisma/client';
import { boardSchema, groupSchema, itemSchema } from '../shared/schemas';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.get('/boards', async (_req, res) => {
  const boards = await prisma.board.findMany();
  res.json(boards);
});

// --- single-board lookup ---
app.get('/boards/:id', async (req, res) => {
  const board = await prisma.board.findUnique({ where: { id: req.params.id } });
  if (!board) {
    res.status(404).send();
    return;
  }
  res.json(board);
});

// --- create board ---
app.post('/boards', async (req, res) => {
  const parsed = boardSchema
    .partial({ id: true, createdAt: true })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const board = await prisma.board.create({ data: parsed.data });
  res.json(board);
});
app.post('/boards', async (req, res) => {
  const parsed = boardSchema.partial({ id: true, createdAt: true }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const board = await prisma.board.create({ data: { name: parsed.data.name } });
  res.json(board);
});

// --- update board ---
app.put('/boards/:id', async (req, res) => {
  const parsed = boardSchema
    .partial({ id: true, createdAt: true })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const board = await prisma.board.update({
    where: { id: req.params.id },
    data: parsed.data,          // update with validated fields
  });
  res.json(board);
});

// --- delete board ---
app.delete('/boards/:id', async (req, res) => {
  await prisma.board.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// Groups routes
app.get('/boards/:boardId/groups', async (req, res) => {
  const groups = await prisma.group.findMany({ where: { boardId: req.params.boardId }, orderBy: { order: 'asc' } });
  res.json(groups);
});

app.post('/boards/:boardId/groups', async (req, res) => {
  const parsed = groupSchema.partial({ id: true }).safeParse({ ...req.body, boardId: req.params.boardId });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const group = await prisma.group.create({ data: parsed.data });
  res.json(group);
});

// --- update group ---
app.put('/groups/:id', async (req, res) => {
  const parsed = groupSchema.partial({ id: true }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const group = await prisma.group.update({
    where: { id: req.params.id },
    data: parsed.data,
  });
  res.json(group);
});

// --- delete group ---
app.delete('/groups/:id', async (req, res) => {
  await prisma.group.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
// Items routes
app.get('/groups/:groupId/items', async (req, res) => {
  const items = await prisma.item.findMany({ where: { groupId: req.params.groupId }, orderBy: { position: 'asc' } });
  res.json(items);
});

app.post('/groups/:groupId/items', async (req, res) => {
  const parsed = itemSchema.partial({ id: true, createdAt: true, updatedAt: true, statusChangedAt: true, boardId: true, groupId: true }).safeParse({ ...req.body, groupId: req.params.groupId, boardId: req.body.boardId });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const item = await prisma.item.create({ data: parsed.data });
  res.json(item);
});

// --- update item ---
app.put('/items/:id', async (req, res) => {
  const parsed = itemSchema.partial({ id: true }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const item = await prisma.item.update({
    where: { id: req.params.id },
    data: parsed.data,
  });
  res.json(item);
});

// --- delete item ---
app.delete('/items/:id', async (req, res) => {
  await prisma.item.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
