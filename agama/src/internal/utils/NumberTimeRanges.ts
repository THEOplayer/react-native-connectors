import type { TimeRange } from 'react-native-theoplayer';

// Default to TimeRanges where start is inclusive and end is exclusive
function createDefaultInclusiveness(length: number): boolean[] {
  const inclusiveness = new Array<boolean>(length * 2);
  for (let i = 0, o = 0; i < length; i += 1, o += 2) {
    inclusiveness[o] = true;
    inclusiveness[o + 1] = false;
  }
  return inclusiveness;
}

function lessThanInclusive(left: number, right: number, allowEqual: boolean): boolean {
  return allowEqual ? left <= right : left < right;
}

export class NumberTimeRanges {
  readonly length_: number;
  private readonly _startAndEnds: ReadonlyArray<number>;
  private readonly _inclusiveness: ReadonlyArray<boolean>;

  constructor(startAndEnds: ReadonlyArray<number>, inclusiveness?: ReadonlyArray<boolean>) {
    // eslint-disable-next-line no-bitwise
    this.length_ = startAndEnds.length >> 1;
    this._startAndEnds = startAndEnds;
    this._inclusiveness = inclusiveness || createDefaultInclusiveness(this.length_);
  }

  get startAndEnds_(): number[] {
    return this._startAndEnds.slice(); // TODO remove slice() and return ReadonlyArray<TUnit>
  }

  start_(index: number): number {
    return this._startAndEnds[index * 2];
  }

  end_(index: number): number {
    return this._startAndEnds[index * 2 + 1];
  }

  includeStart_(index: number): boolean {
    return this._inclusiveness[index * 2];
  }

  includeEnd_(index: number): boolean {
    return this._inclusiveness[index * 2 + 1];
  }

  toNative_(): TimeRanges {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const timeRanges = this;
    return {
      get length(): number {
        return timeRanges.length_;
      },
      start(index: number): number {
        const integerIndex = index | 0; // cast to integer
        timeRanges.checkBounds_(integerIndex);
        return timeRanges.start_(integerIndex);
      },
      end(index: number): number {
        const integerIndex = index | 0; // cast to integer
        timeRanges.checkBounds_(integerIndex);
        return timeRanges.end_(integerIndex);
      },
    };
  }

  toAllPointsInclusive_(): NumberTimeRanges {
    const startsAndEnds = new Array<number>(this.length_ * 2);
    const inclusiveness = new Array<boolean>(this.length_ * 2);

    for (let index = 0; index < this.length_; index++) {
      startsAndEnds[index * 2] = this.start_(index);
      startsAndEnds[index * 2 + 1] = this.end_(index);
      inclusiveness[index * 2] = true;
      inclusiveness[index * 2 + 1] = true;
    }

    return new NumberTimeRanges(startsAndEnds, inclusiveness);
  }

  private checkBounds_(index: number): void {
    if (index < 0) {
      throw new Error(`The index provided (${index}) must be non-negative`);
    }
    if (index >= this.length_) {
      throw new Error(`The index provided (${index}) is greater than the maximum bound (${this.length_})`);
    }
  }

  clipTimeStamp_(timeStamp: number): number {
    if (this.length_ === 0) {
      return 0;
    } else if (this.containsTimestamp_(timeStamp)) {
      return timeStamp;
    } else if (timeStamp <= this.start_(0)) {
      return this.start_(0);
    } else if (timeStamp >= this.end_(this.length_ - 1)) {
      return this.end_(this.length_ - 1);
    } else {
      let closestPoint: number | undefined;
      let distanceToClosestPoint = Infinity;

      for (let i = 0; i < this.length_; i++) {
        const start = this.start_(i);
        const distanceToStart = Math.abs(start - timeStamp);
        if (distanceToStart < distanceToClosestPoint) {
          closestPoint = start;
          distanceToClosestPoint = distanceToStart;
        }
        const end = this.end_(i);
        const distanceToEnd = Math.abs(end - timeStamp);
        if (distanceToEnd < distanceToClosestPoint) {
          closestPoint = end;
          distanceToClosestPoint = distanceToEnd;
        }
      }

      // length > 0, so the loop must have executed at least once, and must have set closestPoint
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return closestPoint!;
    }
  }

  /**
   * Returns the intersection between these time ranges and the given time ranges.
   *
   * @param other
   *   The other time ranges.
   * @returns The intersection.
   */
  intersect_(other: NumberTimeRanges): NumberTimeRanges {
    let index1 = 0;
    let index2 = 0;
    const startAndEnds: number[] = [];
    const inclusiveness: boolean[] = [];

    /*
     * Based on TimeRanges::intersection from Mozilla Firefox
     * https://hg.mozilla.org/releases/mozilla-release/file/bd079aadd3fe/dom/html/TimeRanges.cpp#l137
     */
    while (index1 < this.length_ && index2 < other.length_) {
      const thisRangeStart = this.start_(index1);
      const thisRangeEnd = this.end_(index1);
      const thisIncludeStart = this.includeStart_(index1);
      const thisIncludeEnd = this.includeEnd_(index1);
      const otherRangeStart = other.start_(index2);
      const otherRangeEnd = other.end_(index2);
      const otherIncludeStart = other.includeStart_(index2);
      const otherIncludeEnd = other.includeEnd_(index2);

      const rangeStart = Math.max(thisRangeStart, otherRangeStart);
      const rangeEnd = Math.min(thisRangeEnd, otherRangeEnd);
      let includeStart: boolean;
      if (thisRangeStart === otherRangeStart) {
        includeStart = thisIncludeStart && otherIncludeStart;
      } else if (rangeStart === thisRangeStart) {
        includeStart = thisIncludeStart;
      } else {
        includeStart = otherIncludeStart;
      }

      let includeEnd: boolean;
      if (thisRangeEnd === otherRangeEnd) {
        includeEnd = thisIncludeEnd && otherIncludeEnd;
      } else if (rangeEnd === thisRangeEnd) {
        includeEnd = thisIncludeEnd;
      } else {
        includeEnd = otherIncludeEnd;
      }

      if (rangeStart < rangeEnd || (includeStart && includeEnd && rangeStart === rangeEnd)) {
        startAndEnds.push(rangeStart, rangeEnd);
        inclusiveness.push(includeStart, includeEnd);
      }

      if (thisRangeEnd === otherRangeEnd) {
        index1 += 1;
        index2 += 1;
      } else if (thisRangeEnd < otherRangeEnd) {
        index1 += 1;
      } else {
        index2 += 1;
      }
    }

    return new NumberTimeRanges(startAndEnds, inclusiveness);
  }

  invert_(): NumberTimeRanges {
    const normalizedThis = this.normalizeSinglePoints_();
    const length = normalizedThis.length_;

    /*
     * Based on TimeRanges::invert() from WebKit
     * https://chromium.googlesource.com/chromium/src/+/e2b998a109b5d231dedf2d7c6287d4191b51b7e1/third_party/WebKit/Source/core/html/TimeRanges.cpp#63
     */
    if (length === 0) {
      return new NumberTimeRanges([-Infinity, Infinity], [false, false]);
    }

    const inverted: number[] = [];
    const invertedInclusiveness: boolean[] = [];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const rangeStart = normalizedThis.start_(0)!;
    if (rangeStart !== -Infinity) {
      inverted.push(-Infinity, rangeStart);
      invertedInclusiveness.push(false, !normalizedThis.includeStart_(0));
    }

    for (let index = 0; index < length - 1; index++) {
      inverted.push(normalizedThis.end_(index), normalizedThis.start_(index + 1));
      invertedInclusiveness.push(!normalizedThis.includeEnd_(index), !normalizedThis.includeStart_(index + 1));
    }

    const rangeEnd = normalizedThis.end_(length - 1);
    if (rangeEnd !== Infinity) {
      inverted.push(rangeEnd, Infinity);
      invertedInclusiveness.push(!normalizedThis.includeEnd_(length - 1), false);
    }

    return new NumberTimeRanges(inverted, invertedInclusiveness);
  }

  /**
   * Merge two sorted TimeRanges into a single sorted TimeRanges.
   */
  private mergeSorted_(other: NumberTimeRanges): NumberTimeRanges {
    let index1 = 0;
    let index2 = 0;
    const length1 = this.length_;
    const length2 = other.length_;
    const startAndEnds: number[] = new Array((length1 + length2) * 2);
    const inclusiveness: boolean[] = new Array((length1 + length2) * 2);
    let sortedIndex = 0;

    /*
     * Based on the 'merge' operation from merge sort, but with time ranges rather than arrays
     */

    while (index1 < length1 && index2 < length2) {
      const start1 = this.start_(index1);
      const end1 = this.end_(index1);
      const start2 = other.start_(index2);
      const end2 = other.end_(index2);
      if (start1 < start2 || (start1 === start2 && end1 < end2)) {
        startAndEnds[sortedIndex] = start1;
        startAndEnds[sortedIndex + 1] = end1;
        inclusiveness[sortedIndex] = this.includeStart_(index1);
        inclusiveness[sortedIndex + 1] = this.includeEnd_(index1);
        index1++;
      } else {
        startAndEnds[sortedIndex] = start2;
        startAndEnds[sortedIndex + 1] = end2;
        inclusiveness[sortedIndex] = other.includeStart_(index2);
        inclusiveness[sortedIndex + 1] = other.includeEnd_(index2);
        index2++;
      }
      sortedIndex += 2;
    }

    while (index1 < length1) {
      startAndEnds[sortedIndex] = this.start_(index1);
      startAndEnds[sortedIndex + 1] = this.end_(index1);
      inclusiveness[sortedIndex] = this.includeStart_(index1);
      inclusiveness[sortedIndex + 1] = this.includeEnd_(index1);
      index1++;
      sortedIndex += 2;
    }

    while (index2 < length2) {
      startAndEnds[sortedIndex] = other.start_(index2);
      startAndEnds[sortedIndex + 1] = other.end_(index2);
      inclusiveness[sortedIndex] = other.includeStart_(index2);
      inclusiveness[sortedIndex + 1] = other.includeEnd_(index2);
      index2++;
      sortedIndex += 2;
    }

    return new NumberTimeRanges(startAndEnds, inclusiveness);
  }

  mergeOverlaps_(tolerance = 0): NumberTimeRanges {
    const length = this.length_;

    /*
     * Based on this::normalize from Mozilla Firefox
     * https://hg.mozilla.org/releases/mozilla-release/file/33c11529607b/dom/html/TimeRanges.cpp#l112
     */
    if (length < 2) {
      return this;
    }

    const startAndEnds: number[] = [];
    const inclusiveness: boolean[] = [];
    let currentStart = this.start_(0);
    let currentEnd = this.end_(0);
    let currentIncludeStart = this.includeStart_(0);
    let currentIncludeEnd = this.includeEnd_(0);
    for (let index = 1; index < length; index++) {
      const newStart = this.start_(index);
      const newEnd = this.end_(index);
      let newIncludeStart = this.includeStart_(index);
      let newIncludeEnd = this.includeEnd_(index);
      // Skip if new range is completely contained in current range
      if (currentStart < newStart && currentEnd > newEnd) {
        continue;
      }
      // If new range starts/ends at same time as current range,
      // update inclusiveness of new range
      if (currentStart === newStart) {
        newIncludeStart = currentIncludeStart || newIncludeStart;
        currentIncludeStart = newIncludeStart;
      }
      if (currentEnd === newEnd) {
        newIncludeEnd = currentIncludeEnd || newIncludeEnd;
        currentIncludeEnd = newIncludeEnd;
      }
      if (lessThanInclusive(newStart, currentEnd + tolerance, currentIncludeEnd || newIncludeStart)) {
        // Extend current range
        currentEnd = newEnd;
        currentIncludeEnd = newIncludeEnd;
      } else {
        // Finish current range
        startAndEnds.push(currentStart, currentEnd);
        inclusiveness.push(currentIncludeStart, currentIncludeEnd);
        currentStart = newStart;
        currentEnd = newEnd;
        currentIncludeStart = newIncludeStart;
        currentIncludeEnd = newIncludeEnd;
      }
    }
    // Finish last range
    startAndEnds.push(currentStart, currentEnd);
    inclusiveness.push(currentIncludeStart, currentIncludeEnd);

    return new NumberTimeRanges(startAndEnds, inclusiveness).normalizeSinglePoints_();
  }

  normalizeSinglePoints_(): NumberTimeRanges {
    const startAndEnds: number[] = [];
    const inclusiveness: boolean[] = [];

    for (let index = 0; index < this.length_; index++) {
      const start = this.start_(index);
      const end = this.end_(index);
      const includeStart = this.includeStart_(index);
      const includeEnd = this.includeEnd_(index);

      if (start === end) {
        if (includeStart || includeEnd) {
          startAndEnds.push(start, end);
          inclusiveness.push(true, true);
        }
      } else {
        startAndEnds.push(start, end);
        inclusiveness.push(includeStart, includeEnd);
      }
    }

    return new NumberTimeRanges(startAndEnds, inclusiveness);
  }

  union_(other: NumberTimeRanges): NumberTimeRanges {
    // Short circuit unions with empty ranges
    if (!this.length_) {
      return other;
    }
    if (!other.length_) {
      return this;
    }

    // Merge sorted inputs (we assume that the inputs are normalized)
    const sorted = this.mergeSorted_(other);
    // Merge overlaps
    return sorted.mergeOverlaps_();
  }

  symmetricDifference_(other: NumberTimeRanges): NumberTimeRanges {
    const normalizedThis = this.normalizeSinglePoints_();
    const normalizedOther = other.normalizeSinglePoints_();
    const thisInverted = normalizedThis.invert_();
    const otherInverted = normalizedOther.invert_();

    const intersectThisWithOther = thisInverted.intersect_(normalizedOther);
    const intersectOtherWithThis = otherInverted.intersect_(normalizedThis);

    return intersectThisWithOther.union_(intersectOtherWithThis);
  }

  shift_(amount: number): NumberTimeRanges {
    if (amount === 0) {
      return this;
    }
    const startAndEnds: number[] = [];
    const inclusiveness: boolean[] = [];
    for (let index = 0; index < this.length_; index++) {
      const newStart = this.start_(index) + amount;
      const newEnd = this.end_(index) + amount;
      startAndEnds.push(newStart, newEnd);
      inclusiveness.push(this.includeStart_(index), this.includeEnd_(index));
    }
    return new NumberTimeRanges(startAndEnds, inclusiveness);
  }

  difference_(other: NumberTimeRanges): NumberTimeRanges {
    // Short circuit differences with empty ranges
    if (this.length_ === 0 || other.length_ === 0) {
      // A \ 0 = A (= this)
      // 0 \ A = 0 (= this)
      return this;
    }
    return this.normalizeSinglePoints_().intersect_(other.normalizeSinglePoints_().invert_());
  }

  containsTimestamp_(timestamp: number, tolerance?: number): boolean {
    return this.findTimestampIndex_(timestamp, tolerance) >= 0;
  }

  containsRange_(startTime: number, endTime: number, startInclusive?: boolean, endInclusive?: boolean, tolerance?: number): boolean {
    return this.findRangeIndex_(startTime, endTime, startInclusive, endInclusive, tolerance) >= 0;
  }

  containsPartialRange_(startTime: number, endTime: number, startInclusive?: boolean, endInclusive?: boolean, tolerance?: number): boolean {
    return this.findPartialRangeIndex_(startTime, endTime, startInclusive, endInclusive, tolerance) >= 0;
  }

  equalsTimeRange_(other: NumberTimeRanges): boolean {
    if (other.length_ !== this.length_) {
      return false;
    }

    for (let index = 0; index < this.length_; index++) {
      if (
        !(
          this.start_(index) === other.start_(index) &&
          this.end_(index) === other.end_(index) &&
          this.includeStart_(index) === other.includeStart_(index) &&
          this.includeEnd_(index) === other.includeEnd_(index)
        )
      ) {
        return false;
      }
    }

    return true;
  }

  filter_(predicate: (start: number, end: number, includeStart: boolean, includeEnd: boolean) => boolean): NumberTimeRanges {
    const filteredStartsAndEnds: number[] = [];
    const filteredInclusivenessValues: boolean[] = [];

    for (let i = 0; i < this.length_; i++) {
      const start = this.start_(i);
      const end = this.end_(i);
      const includeStart = this.includeStart_(i);
      const includeEnd = this.includeEnd_(i);
      if (predicate(start, end, includeStart, includeEnd)) {
        filteredStartsAndEnds.push(start, end);
        filteredInclusivenessValues.push(includeStart, includeEnd);
      }
    }

    return new NumberTimeRanges(filteredStartsAndEnds, filteredInclusivenessValues);
  }

  /**
   * Find the index of the first range that partially contains the given time range within the given tolerance:
   *      start(index) - tolerance < endTime && startTime < end(index) + tolerance
   *
   * @param startTime
   * @param endTime
   * @param [startInclusive]
   * @param [endInclusive]
   * @param [tolerance]
   * @returns Index of found range, or -1 if not found.
   */
  findPartialRangeIndex_(startTime: number, endTime: number, startInclusive = true, endInclusive = true, tolerance = 0): number {
    const toleratedStartTime = startTime - tolerance;
    const toleratedEndTime = endTime + tolerance;
    for (let index = 0; index < this.length_; index += 1) {
      if (
        lessThanInclusive(this.start_(index), toleratedEndTime, !endInclusive || this.includeStart_(index)) &&
        lessThanInclusive(toleratedStartTime, this.end_(index), !startInclusive || this.includeEnd_(index))
      ) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Find the index of the first range that fully contains the given time range within the given tolerance:
   *      start(index) - tolerance <= startTime && endTime <= end(index) + tolerance
   *
   * @param startTime
   * @param endTime
   * @param [startInclusive]
   * @param [endInclusive]
   * @param [tolerance]
   * @returns Index of found range, or -1 if not found.
   */
  findRangeIndex_(startTime: number, endTime: number, startInclusive = true, endInclusive = false, tolerance = 0): number {
    const toleratedStartTime = startTime + tolerance;
    const toleratedEndTime = endTime - tolerance;
    for (let index = 0; index < this.length_; index += 1) {
      if (
        lessThanInclusive(this.start_(index), toleratedStartTime, !startInclusive || this.includeStart_(index)) &&
        lessThanInclusive(toleratedEndTime, this.end_(index), !endInclusive || this.includeEnd_(index))
      ) {
        return index;
      }
    }
    return -1;
  }

  findTimestampIndex_(timestamp: number, tolerance?: number): number {
    return this.findRangeIndex_(timestamp, timestamp, true, true, tolerance);
  }

  /**
   * Find the index of the first range that follows the given time within the given tolerance:
   *      start(index) - tolerance > timestamp
   *
   * @param timestamp
   * @param [tolerance]
   * @returns Index of found range, or -1 if not found.
   */
  findTimestampIndexAfter_(timestamp: number, tolerance = 0): number {
    const toleratedTimestamp = timestamp + tolerance;
    for (let index = 0; index < this.length_; index += 1) {
      if (this.start_(index) > toleratedTimestamp) {
        return index;
      }
    }
    return -1;
  }

  subRange_(index: number): NumberTimeRanges {
    this.checkBounds_(index);

    return new NumberTimeRanges([this.start_(index), this.end_(index)], [this.includeStart_(index), this.includeEnd_(index)]);
  }

  subRangeAtTimestamp_(timestamp: number, tolerance?: number): NumberTimeRanges | undefined {
    const index = this.findTimestampIndex_(timestamp, tolerance);
    return index < 0 ? undefined : this.subRange_(index);
  }

  get totalDuration_(): number {
    let totalDuration = 0;
    for (let i = 0; i < this.length_; i++) {
      const rangeDistance = this.end_(i) - this.start_(i);
      totalDuration = totalDuration + rangeDistance;
    }
    return totalDuration;
  }

  static fromNative_(timeRanges: TimeRange[]): NumberTimeRanges {
    const startAndEnds: number[] = [];

    for (let i = 0; i < timeRanges.length; i++) {
      startAndEnds.push(timeRanges[i].start, timeRanges[i].end);
    }

    return new NumberTimeRanges(startAndEnds);
  }

  static singlePoint_(timestamp: number): NumberTimeRanges {
    return new NumberTimeRanges([timestamp, timestamp], [true, true]);
  }

  static singleRange_(start: number, end: number): NumberTimeRanges {
    if (start <= end) {
      return new NumberTimeRanges([start, end]);
    } else {
      return NumberTimeRanges.empty_();
    }
  }

  static empty_(): NumberTimeRanges {
    return EMPTY_TIME_RANGES;
  }
}

const EMPTY_TIME_RANGES = new NumberTimeRanges([]);
