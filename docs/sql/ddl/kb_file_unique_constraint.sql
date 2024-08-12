-- This index can't be properly created with Prisma (parent_id nulls aren't
-- distinct in Postgres).
CREATE UNIQUE INDEX kb_file_uq_test ON kb_file (instance_id, name)
WHERE parent_id IS NULL;

