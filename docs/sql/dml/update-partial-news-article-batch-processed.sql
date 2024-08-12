-- Useful SQL for reprocessing news articles

-- Ref: https://dba.stackexchange.com/a/69497
WITH cte AS (
   SELECT id                 -- pk column or any (set of) unique column(s)
      FROM news_article_instance
     WHERE batch_processed = true
     ORDER BY random()
     LIMIT 20)                -- only update 20 rows
UPDATE news_article_instance n
   SET batch_processed = false
  FROM cte
 WHERE n.id = cte.id
RETURNING n.id;


-- instance specific
WITH cte AS (
   SELECT id                 -- pk column or any (set of) unique column(s)
      FROM news_article_instance
     WHERE batch_processed = true
       AND instance_id = 'INSTANCE_ID'
     ORDER BY random()
     LIMIT 20)                -- only update 20 rows
UPDATE news_article_instance n
   SET batch_processed = false
  FROM cte
 WHERE n.id = cte.id
RETURNING n.id;


-- Regenerate embeddings
UPDATE news_article_instance
   SET embedding = null,
       embedding_generated = null,
       refresh_embedding = true;

