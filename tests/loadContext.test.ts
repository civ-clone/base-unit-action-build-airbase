import { COMPLETE } from '../BuildAirbase';
import { instance as busyRegistryInstance } from '@civ-clone/core-unit/BusyRegistry';
import BuildingAirbase from '../Rules/BuildingAirbase';
import Built from '@civ-clone/core-tile-improvement/Rules/Built';
import Effect from '@civ-clone/core-rule/Effect';
import Airbase from '@civ-clone/base-tile-improvement-airbase/Airbase';
import PendingEffect from '@civ-clone/core-pending-effect/PendingEffect';
import PendingEffectRegistry from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry, {
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Unit from '@civ-clone/core-unit/Unit';
import World from '@civ-clone/core-world/World';
import { expect } from 'chai';

class Engineers extends Unit {}

// A save loaded into a game with its own registries finishes the job there (civ-clone/web-renderer#248).
describe('BuildAirbase loaded into another game', (): void => {
  it("finishes through the loading game's `Built` rules, not the module instance's", (): void => {
    const context = {
        pendingEffects: new PendingEffectRegistry(),
        rules: new RuleRegistry(),
        turn: new Turn(),
      },
      loadingBuilt: [Tile, TileImprovement][] = [],
      instanceBuilt: [Tile, TileImprovement][] = [],
      loadingRule = new Built(
        new Effect((tile: Tile, improvement: TileImprovement): void => {
          loadingBuilt.push([tile, improvement]);
        })
      ),
      instanceRule = new Built(
        new Effect((tile: Tile, improvement: TileImprovement): void => {
          instanceBuilt.push([tile, improvement]);
        })
      ),
      tile = new Tile(0, 0, new Terrain(), null as unknown as World),
      unit = new Engineers(null, new Player(), tile, context.rules);

    context.rules.register(loadingRule);
    ruleRegistryInstance.register(instanceRule);

    try {
      context.turn.set(1);
      context.pendingEffects.register(
        new PendingEffect(COMPLETE, unit, { endTurn: '1' })
      );

      const busy = busyRegistryInstance.rebuild(
        'BuildingAirbase',
        unit,
        context
      );

      expect(busy).to.instanceof(BuildingAirbase);

      busy.process();

      expect(loadingBuilt).to.have.length(1);
      expect(loadingBuilt[0][0]).to.equal(tile);
      expect(loadingBuilt[0][1]).to.instanceof(Airbase);
      expect(instanceBuilt).to.deep.equal([]);
    } finally {
      ruleRegistryInstance.unregister(instanceRule);
    }
  });
});
