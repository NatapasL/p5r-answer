import dayjs from "dayjs";
import type Fuse from "fuse.js";
import type { Classroom, Confidant } from "./types";

function classroomResultsSortFn(a: Classroom, b: Classroom) {
  const dateA = dayjs(a.date, "MMMM D");
  const dateB = dayjs(b.date, "MMMM D");
  const valA =
    dateA.month() < 3 ? dateA.add(1, "year").valueOf() : dateA.valueOf();
  const valB =
    dateB.month() < 3 ? dateB.add(1, "year").valueOf() : dateB.valueOf();
  return valA - valB;
}

function confidantResultsSortFn(a: Confidant, b: Confidant) {
  return a.rank - b.rank;
}

export function filterClassroom({
  searchQuery,
  classrooms,
  classroomFuses,
}: {
  searchQuery: string;
  classrooms: Classroom[];
  classroomFuses: Fuse<Classroom>[];
}): Classroom[] {
  if (!searchQuery) {
    return [...classrooms].sort(classroomResultsSortFn);
  }

  const combinedResults = [
    ...new Set([
      ...classroomFuses.flatMap((fuse) =>
        fuse.search(searchQuery).map((result) => result.item),
      ),
    ]),
  ];

  return combinedResults.sort(classroomResultsSortFn);
}

export function filterConfidant({
  selectedType,
  searchQuery,
  confidants,
  confidantFuse,
}: {
  selectedType: string;
  searchQuery: string;
  confidants: Confidant[];
  confidantFuse: Fuse<Confidant>;
}): Confidant[] {
  if (!searchQuery) {
    return confidants
      .filter((c) => c.character === selectedType)
      .sort(confidantResultsSortFn);
  }

  return confidantFuse
    .search(searchQuery)
    .map((result) => result.item)
    .sort(confidantResultsSortFn);
}
