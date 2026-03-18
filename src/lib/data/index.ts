import type { Classroom, Confidant } from "../../types";
import data1 from "./data-1.json";
import data2 from "./data-2.json";
import data3 from "./data-3.json";
import data4 from "./data-4.json";
import data5 from "./data-5.json";
import data6 from "./data-6.json";
import data7 from "./data-7.json";

export const confidants: Confidant[] = [
  ...data1,
  ...data2,
  ...data3,
  ...data4,
  ...data5,
  ...data6,
];

export const classrooms: Classroom[] = [...data7];
