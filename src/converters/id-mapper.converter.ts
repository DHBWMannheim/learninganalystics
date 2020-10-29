export const IdMapperConverterFactory = <T extends { id: string }>() => ({
  toFirestore(element: T) /*: DocumentData*/ {
    const extractedData = { ...element };
    delete extractedData.id;
    return extractedData;
  },
  fromFirestore(
    snapshot, //: QueryDocumentSnapshot<any>,
    options //: SnapshotOptions//TODO: types
  ): T {
    const data = snapshot.data(options)!;
    return {
      id: snapshot.id,
      ...data,
    };
  },
});
