"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildAirbase = exports.COMPLETE = void 0;
const BuildingAirbase_1 = require("./Rules/BuildingAirbase");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const Airbase_1 = require("@civ-clone/base-tile-improvement-airbase/Airbase");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const MovementCost_1 = require("@civ-clone/core-unit/Rules/MovementCost");
const registerDelayedAction_1 = require("@civ-clone/core-unit/registerDelayedAction");
exports.COMPLETE = 'base-unit-action-build-airbase:complete';
/**
 * Builds an `Airbase` on the unit's own tile. The work takes as many turns as the largest `MovementCost` answer for this
 *  action, divided by the unit's `WorkRate` (see `DelayedAction`).
 *
 * Which units may build one, and where, is the ruleset's: base-unit-action-rules' `terrainJob(deps, Airbase)` gives the
 *  usual criteria (a unit that `Terraforms`, moves left, an `Available` rule allowing it, the unit's own tile).
 */
class BuildAirbase extends DelayedAction_1.default {
    perform() {
        const [moveCost] = this.ruleRegistry()
            .process(MovementCost_1.default, this.unit(), this)
            .sort((a, b) => b - a);
        super.perform(moveCost || 0, exports.COMPLETE, BuildingAirbase_1.default);
        this.ruleRegistry().process(Moved_1.default, this.unit(), this);
    }
    /**
     * What finishing does: an `Airbase` on the tile the action was performed on, built through the `Built` rules of the
     *  registry the action was constructed with.
     *
     * Static, as in the other delayed actions: a public instance member would make the class unassignable to `Action`.
     */
    static complete(action) {
        new Airbase_1.default(action.from(), action.ruleRegistry());
    }
}
exports.BuildAirbase = BuildAirbase;
// Registered here, as every delayed action is, so a unit part-way through this can be saved: the save records the
//  identifier and the behaviour stays in this package.
(0, registerDelayedAction_1.default)({
    BusyRule: BuildingAirbase_1.default,
    handler: exports.COMPLETE,
    // Built from the game the unit is loaded into, so finishing after a load writes where that game looks
    //  (civ-clone/web-renderer#248).
    action: (unit, context) => new BuildAirbase(unit.tile(), unit.tile(), unit, context.rules, context.turn, context.pendingEffects),
    complete: (unit, pendingEffect, action) => BuildAirbase.complete(action),
});
exports.default = BuildAirbase;
//# sourceMappingURL=BuildAirbase.js.map