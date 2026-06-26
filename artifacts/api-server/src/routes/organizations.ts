import { Router } from "express";
import { db, schema } from "../lib/db";
import { eq, and } from "drizzle-orm";
import { randomBytes } from "crypto";
import { requireRole } from "../middlewares/requireAuth";

const router = Router();

// ── UNITS ──────────────────────────────────────────────────────────────────
router.get("/organizations/units", async (req, res) => {
  const units = await db.query.unitsTable.findMany({
    where: eq(schema.unitsTable.tenantId, req.tenantId!),
    orderBy: (u, { asc }) => [asc(u.name)],
  });
  res.json(units.map(u => ({
    id: u.id,
    name: u.name,
    tenantId: u.tenantId,
    parentId: u.parentId,
    description: u.description,
    createdAt: u.createdAt.toISOString(),
  })));
});

router.post("/organizations/units", requireRole("owner", "sst"), async (req, res) => {
  const { name, parentId, description } = req.body;
  const [unit] = await db
    .insert(schema.unitsTable)
    .values({ tenantId: req.tenantId!, name, parentId, description })
    .returning();
  res.status(201).json({
    id: unit.id,
    name: unit.name,
    tenantId: unit.tenantId,
    parentId: unit.parentId,
    description: unit.description,
    createdAt: unit.createdAt.toISOString(),
  });
});

router.patch("/organizations/units/:unitId", requireRole("owner", "sst"), async (req, res) => {
  const unitId = parseInt(String(req.params.unitId));
  const { name, description } = req.body;
  const [unit] = await db
    .update(schema.unitsTable)
    .set({ name, description })
    .where(and(eq(schema.unitsTable.id, unitId), eq(schema.unitsTable.tenantId, req.tenantId!)))
    .returning();
  if (!unit) { res.status(404).json({ error: "Unit not found" }); return; }
  res.json({
    id: unit.id,
    name: unit.name,
    tenantId: unit.tenantId,
    parentId: unit.parentId,
    description: unit.description,
    createdAt: unit.createdAt.toISOString(),
  });
});

router.delete("/organizations/units/:unitId", requireRole("owner"), async (req, res) => {
  const unitId = parseInt(String(req.params.unitId));
  await db
    .delete(schema.unitsTable)
    .where(and(eq(schema.unitsTable.id, unitId), eq(schema.unitsTable.tenantId, req.tenantId!)));
  res.status(204).send();
});

// ── WORKERS ────────────────────────────────────────────────────────────────
router.get("/organizations/workers", async (req, res) => {
  const { unitId, status } = req.query;
  const conditions: ReturnType<typeof eq>[] = [eq(schema.workersTable.tenantId, req.tenantId!)];
  if (unitId) conditions.push(eq(schema.workersTable.unitId, parseInt(unitId as string)));
  if (status) conditions.push(eq(schema.workersTable.status, status as "active" | "inactive" | "leave"));

  const workers = await db
    .select({
      id: schema.workersTable.id,
      displayName: schema.workersTable.displayName,
      email: schema.workersTable.email,
      unitId: schema.workersTable.unitId,
      unitName: schema.unitsTable.name,
      role: schema.workersTable.role,
      status: schema.workersTable.status,
      createdAt: schema.workersTable.createdAt,
    })
    .from(schema.workersTable)
    .leftJoin(schema.unitsTable, eq(schema.workersTable.unitId, schema.unitsTable.id))
    .where(and(...conditions));

  res.json(workers.map(w => ({
    ...w,
    unitName: w.unitName ?? "Unknown",
    createdAt: w.createdAt.toISOString(),
  })));
});

router.post("/organizations/workers", requireRole("owner", "rh"), async (req, res) => {
  const { displayName, email, unitId, role } = req.body;
  const unit = unitId != null
    ? await db.query.unitsTable.findFirst({
        where: and(eq(schema.unitsTable.id, unitId), eq(schema.unitsTable.tenantId, req.tenantId!)),
      })
    : null;
  if (unitId != null && !unit) {
    res.status(400).json({ error: "Unidade não encontrada ou não pertence a esta empresa" });
    return;
  }
  const pseudoToken = randomBytes(16).toString("hex");
  const [worker] = await db
    .insert(schema.workersTable)
    .values({ tenantId: req.tenantId!, displayName, email, unitId, role, pseudoToken })
    .returning();
  res.status(201).json({
    id: worker.id,
    displayName: worker.displayName,
    email: worker.email,
    unitId: worker.unitId,
    unitName: unit?.name ?? "Unknown",
    role: worker.role,
    status: worker.status,
    createdAt: worker.createdAt.toISOString(),
  });
});

export default router;
