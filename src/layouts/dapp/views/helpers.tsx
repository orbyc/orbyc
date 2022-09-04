import { Movement } from "orbyc-core/pb/domain_pb";
import { MovementMetadata } from "orbyc-core/pb/metadata_pb";
import _ from "lodash";

type WeightUnit = "g" | "kg" | "t";
export function shortNumber(num: number): string {
  // num = num.toString().replace(/[^0-9.]/g, '');
  if (num < 1000) {
    return num.toString();
  }
  let si = [
    { v: 1e3, s: "K" },
    { v: 1e6, s: "M" },
    { v: 1e9, s: "B" },
    { v: 1e12, s: "T" },
    { v: 1e15, s: "P" },
    { v: 1e18, s: "E" },
  ];
  let index;
  for (index = si.length - 1; index > 0; index--) {
    if (num >= si[index].v) {
      break;
    }
  }
  return (
    (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") +
    si[index].s
  );
}
export function shortWeight(value: number): string {
  var unit: WeightUnit;

  if (value > 1e6) {
    value = value / 1e6;
    unit = `t`;
  } else if (value > 1e3) {
    value = value / 1e3;
    unit = `kg`;
  } else {
    value = value / 1;
    unit = `g`;
  }

  return value.toFixed(0) + unit;
}

interface MovementData {
  movement: Movement;
  metadata: MovementMetadata;
}
export const getMovementsCountries = (movements: MovementData[]): string[] =>
  _.difference([
    ...movements.map((e) => e.metadata.getFrom()!.getCountry()),
    ...movements.map((e) => e.metadata.getTo()!.getCountry()),
  ]);
export const getMovementsKilometers = (movements: MovementData[]): number =>
  _.sum(movements.map((e) => e.metadata.getDistance()));
export const getMovementsCarbonEmissions = (
  movements: MovementData[]
): number => _.sum(movements.map((e) => e.movement.getCo2e()));

export const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};
