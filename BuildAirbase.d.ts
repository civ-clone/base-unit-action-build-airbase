import DelayedAction from '@civ-clone/core-unit/DelayedAction';
export declare const COMPLETE = 'base-unit-action-build-airbase:complete';
/**
 * Builds an `Airbase` on the unit's own tile. The work takes as many turns as the largest `MovementCost` answer for this
 *  action, divided by the unit's `WorkRate` (see `DelayedAction`).
 *
 * Which units may build one, and where, is the ruleset's: base-unit-action-rules' `terrainJob(deps, Airbase)` gives the
 *  usual criteria (a unit that `Terraforms`, moves left, an `Available` rule allowing it, the unit's own tile).
 */
export declare class BuildAirbase extends DelayedAction {
  perform(): void;
  /**
   * What finishing does: an `Airbase` on the tile the action was performed on, built through the `Built` rules of the
   *  registry the action was constructed with.
   *
   * Static, as in the other delayed actions: a public instance member would make the class unassignable to `Action`.
   */
  static complete(action: BuildAirbase): void;
}
export default BuildAirbase;
