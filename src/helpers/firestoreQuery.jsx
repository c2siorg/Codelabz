/**
 * Firestore rejects `in`, `not-in` and `array-contains-any` filters with
 * more than 30 comparison values. The SDK does not validate the length
 * client side, so an oversized list fails at the server as an
 * INVALID_ARGUMENT rejection rather than a clear error, and usually ends
 * up swallowed by a catch block.
 */
export const FIRESTORE_IN_LIMIT = 30;

export const chunkValues = (values, size = FIRESTORE_IN_LIMIT) => {
  const chunks = [];
  for (let i = 0; i < values.length; i += size) {
    chunks.push(values.slice(i, i + size));
  }
  return chunks;
};

/**
 * Runs an `in` query over a list of any length by splitting it into chunks
 * that fit the limit and querying them in parallel.
 *
 * @param query a Firestore CollectionReference or Query to filter
 * @param field the field to match against
 * @param values the values to match, of any length
 * @returns the combined QueryDocumentSnapshots from every chunk
 */
export const chunkedIn = async (query, field, values) => {
  if (!values || values.length === 0) return [];

  const snapshots = await Promise.all(
    chunkValues(values).map(chunk => query.where(field, "in", chunk).get())
  );

  return snapshots.flatMap(snapshot => snapshot.docs);
};

/**
 * Runs an `array-contains-any` query over a list of any length by splitting
 * it into chunks that fit the limit and querying them in parallel.
 *
 * An empty or missing list is treated as "nothing to match" and returns no
 * documents. Firestore rejects such a filter outright -- and it does so
 * synchronously, while the query is being built -- so callers that pass a
 * list straight through from data that has not loaded yet would otherwise
 * fail before a single read is issued.
 *
 * Unlike `chunkedIn`, which matches a single-valued field, a document can
 * hold values from more than one chunk and would then come back once per
 * chunk, so the results are de-duplicated by document id.
 *
 * @param query a Firestore CollectionReference or Query to filter
 * @param field the array field to match against
 * @param values the values to match, of any length
 * @returns the combined, de-duplicated QueryDocumentSnapshots
 */
export const chunkedArrayContainsAny = async (query, field, values) => {
  if (!Array.isArray(values) || values.length === 0) return [];

  const snapshots = await Promise.all(
    chunkValues(values).map(chunk =>
      query.where(field, "array-contains-any", chunk).get()
    )
  );

  const docsById = new Map();
  snapshots.forEach(snapshot =>
    snapshot.docs.forEach(doc => docsById.set(doc.id, doc))
  );

  return [...docsById.values()];
};
