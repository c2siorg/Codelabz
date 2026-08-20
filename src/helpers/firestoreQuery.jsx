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
