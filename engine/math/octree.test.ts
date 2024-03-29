import { forEachNodePairs, OctreeNode } from "./octree";

describe("octree", () => {
  describe("forEachNodePairs", () => {
    let callback = jest.fn();

    beforeEach(() => {
      callback = jest.fn();
    });

    it("should do nothing if the node has no children", () => {
      forEachNodePairs(
        callback,
        { nodeId: 0, position: { x: 0, y: 0, z: 0 }, children: {} },
        10
      );
      expect(callback).not.toHaveBeenCalled();
    });

    describe("when node has single descendant", () => {
      it.each([
        [-10.1, 10, 10, "topLeftFront"],
        [-10, 10.1, 10, "topLeftFront"],
        [-10, 10, 10.1, "topLeftFront"],
        [10.1, 10, 10, "topRightFront"],
        [10, 10.1, 10, "topRightFront"],
        [10, 10, 10.1, "topRightFront"],
        [10.1, -10, 10, "bottomRightFront"],
        [10, -10.1, 10, "bottomRightFront"],
        [10, -10, 10.1, "bottomRightFront"],
        [-10.1, -10, 10, "bottomLeftFront"],
        [-10, -10.1, 10, "bottomLeftFront"],
        [-10, -10, 10.1, "bottomLeftFront"],
        [-10.1, 10, -10, "topLeftBack"],
        [-10, 10.1, -10, "topLeftBack"],
        [-10, 10, -10.1, "topLeftBack"],
        [10.1, 10, -10, "topRightBack"],
        [10, 10.1, -10, "topRightBack"],
        [10, 10, -10.1, "topRightBack"],
        [10.1, -10, -10, "bottomRightBack"],
        [10, -10.1, -10, "bottomRightBack"],
        [10, -10, -10.1, "bottomRightBack"],
        [-10.1, -10, -10, "bottomLeftBack"],
        [-10, -10.1, -10, "bottomLeftBack"],
        [-10, -10, -10.1, "bottomLeftBack"],
      ])(
        "it should not call callback when child is too far away (x: %f, y: %f, z: %f) position: %s",
        (x, y, z, placement) => {
          const child: OctreeNode = {
            nodeId: 1,
            position: { x, y, z },
            children: {},
          };
          const parent = {
            nodeId: 0,
            position: { x: 0, y: 0, z: 0 },
            children: {
              [placement]: child,
            },
          };
          child.parent = parent;
          forEachNodePairs(callback, parent, 10);

          expect(callback).not.toHaveBeenCalled();
        }
      );

      it.each([
        [-10, 10, 10, "topLeftFront"],
        [10, 10, 10, "topRightFront"],
        [10, -10, 10, "bottomRightFront"],
        [-10, -10, 10, "bottomLeftFront"],
        [-10, 10, -10, "topLeftBack"],
        [10, 10, -10, "topRightBack"],
        [10, -10, -10, "bottomRightBack"],
        [-10, -10, -10, "bottomLeftBack"],
      ])(
        "it should call the callback when child is in range (x: %f, y: %f, z: %f) position: %s",
        (x, y, z, placement) => {
          const child: OctreeNode = {
            nodeId: 1,
            position: { x, y, z },
            children: {},
          };
          const parent = {
            nodeId: 0,
            position: { x: 0, y: 0, z: 0 },
            children: {
              [placement]: child,
            },
          };
          child.parent = parent;

          forEachNodePairs(callback, parent, 10);

          expect(callback).toHaveBeenCalledWith(parent, child);
          expect(callback).toHaveBeenCalledTimes(1);
        }
      );
    });

    describe("when node has more descendants", () => {
      it.each([
        [
          { x: -15, y: 5, z: 5, direction: "topLeftFront" },
          { x: -10, y: 4, z: 4, direction: "bottomRightBack" },
        ],
        [
          { x: -15, y: 5, z: 5, direction: "topLeftFront" },
          { x: -10, y: 6, z: 4, direction: "topRightBack" },
        ],
        [
          { x: -15, y: 5, z: 5, direction: "topLeftFront" },
          { x: -10, y: 4, z: 6, direction: "bottomRightFront" },
        ],
        [
          { x: -15, y: 5, z: 5, direction: "topLeftFront" },
          { x: -10, y: 6, z: 6, direction: "topRightFront" },
        ],
        [
          { x: -5, y: 15, z: 5, direction: "topLeftFront" },
          { x: -6, y: 10, z: 4, direction: "bottomLeftBack" },
        ],
        [
          { x: -5, y: 15, z: 5, direction: "topLeftFront" },
          { x: -4, y: 10, z: 4, direction: "bottomRightBack" },
        ],
        [
          { x: -5, y: 15, z: 5, direction: "topLeftFront" },
          { x: -6, y: 10, z: 6, direction: "bottomLeftFront" },
        ],
        [
          { x: -5, y: 15, z: 5, direction: "topLeftFront" },
          { x: -4, y: 10, z: 6, direction: "bottomRightFront" },
        ],
        [
          { x: -5, y: 5, z: 15, direction: "topLeftFront" },
          { x: -6, y: 4, z: 10, direction: "bottomLeftBack" },
        ],
        [
          { x: -5, y: 5, z: 15, direction: "topLeftFront" },
          { x: -4, y: 4, z: 10, direction: "bottomRightBack" },
        ],
        [
          { x: -5, y: 5, z: 15, direction: "topLeftFront" },
          { x: -6, y: 6, z: 10, direction: "topLeftBack" },
        ],
        [
          { x: -5, y: 5, z: 15, direction: "topLeftFront" },
          { x: -4, y: 6, z: 10, direction: "topRightBack" },
        ],
        [
          { x: -15, y: 15, z: 5, direction: "topLeftFront" },
          { x: -10, y: 10, z: 6, direction: "bottomRightFront" },
        ],
        [
          { x: -15, y: 15, z: 5, direction: "topLeftFront" },
          { x: -10, y: 10, z: 4, direction: "bottomRightBack" },
        ],
        [
          { x: -15, y: 5, z: 15, direction: "topLeftFront" },
          { x: -10, y: 6, z: 10, direction: "topRightBack" },
        ],
        [
          { x: -15, y: 5, z: 15, direction: "topLeftFront" },
          { x: -10, y: 4, z: 10, direction: "bottomRightBack" },
        ],
        [
          { x: -5, y: 15, z: 15, direction: "topLeftFront" },
          { x: -6, y: 10, z: 10, direction: "bottomLeftBack" },
        ],
        [
          { x: -5, y: 15, z: 15, direction: "topLeftFront" },
          { x: -4, y: 10, z: 10, direction: "bottomRightBack" },
        ],
        [
          { x: -15, y: 15, z: 15, direction: "topLeftFront" },
          { x: -10, y: 10, z: 10, direction: "bottomRightBack" },
        ],

        [
          { x: 15, y: 5, z: 5, direction: "topRightFront" },
          { x: 10, y: 4, z: 4, direction: "bottomLeftBack" },
        ],
        [
          { x: 15, y: 5, z: 5, direction: "topRightFront" },
          { x: 10, y: 6, z: 4, direction: "topLeftBack" },
        ],
        [
          { x: 15, y: 5, z: 5, direction: "topRightFront" },
          { x: 10, y: 4, z: 6, direction: "bottomLeftFront" },
        ],
        [
          { x: 15, y: 5, z: 5, direction: "topRightFront" },
          { x: 10, y: 6, z: 6, direction: "topLeftFront" },
        ],
        [
          { x: 5, y: 15, z: 5, direction: "topRightFront" },
          { x: 6, y: 10, z: 4, direction: "bottomRightBack" },
        ],
        [
          { x: 5, y: 15, z: 5, direction: "topRightFront" },
          { x: 4, y: 10, z: 4, direction: "bottomLeftBack" },
        ],
        [
          { x: 5, y: 15, z: 5, direction: "topRightFront" },
          { x: 6, y: 10, z: 6, direction: "bottomRightFront" },
        ],
        [
          { x: 5, y: 15, z: 5, direction: "topRightFront" },
          { x: 4, y: 10, z: 6, direction: "bottomLeftFront" },
        ],
        [
          { x: 5, y: 5, z: 15, direction: "topRightFront" },
          { x: 6, y: 4, z: 10, direction: "bottomRightBack" },
        ],
        [
          { x: 5, y: 5, z: 15, direction: "topRightFront" },
          { x: 4, y: 4, z: 10, direction: "bottomLeftBack" },
        ],
        [
          { x: 5, y: 5, z: 15, direction: "topRightFront" },
          { x: 6, y: 6, z: 10, direction: "topRightBack" },
        ],
        [
          { x: 5, y: 5, z: 15, direction: "topRightFront" },
          { x: 4, y: 6, z: 10, direction: "topLeftBack" },
        ],
        [
          { x: 15, y: 15, z: 5, direction: "topRightFront" },
          { x: 10, y: 10, z: 6, direction: "bottomLeftFront" },
        ],
        [
          { x: 15, y: 15, z: 5, direction: "topRightFront" },
          { x: 10, y: 10, z: 4, direction: "bottomLeftBack" },
        ],
        [
          { x: 15, y: 5, z: 15, direction: "topRightFront" },
          { x: 10, y: 6, z: 10, direction: "topLeftBack" },
        ],
        [
          { x: 15, y: 5, z: 15, direction: "topRightFront" },
          { x: 10, y: 4, z: 10, direction: "bottomLeftBack" },
        ],
        [
          { x: 5, y: 15, z: 15, direction: "topRightFront" },
          { x: 6, y: 10, z: 10, direction: "bottomRightBack" },
        ],
        [
          { x: 5, y: 15, z: 15, direction: "topRightFront" },
          { x: 4, y: 10, z: 10, direction: "bottomLeftBack" },
        ],
        [
          { x: 15, y: 15, z: 15, direction: "topRightFront" },
          { x: 10, y: 10, z: 10, direction: "bottomLeftBack" },
        ],

        [
          { x: -15, y: -5, z: 5, direction: "bottomLeftFront" },
          { x: -10, y: -4, z: 4, direction: "topRightBack" },
        ],
        [
          { x: -15, y: -5, z: 5, direction: "bottomLeftFront" },
          { x: -10, y: -6, z: 4, direction: "bottomRightBack" },
        ],
        [
          { x: -15, y: -5, z: 5, direction: "bottomLeftFront" },
          { x: -10, y: -4, z: 6, direction: "topRightFront" },
        ],
        [
          { x: -15, y: -5, z: 5, direction: "bottomLeftFront" },
          { x: -10, y: -6, z: 6, direction: "bottomRightFront" },
        ],
        [
          { x: -5, y: -15, z: 5, direction: "bottomLeftFront" },
          { x: -6, y: -10, z: 4, direction: "topLeftBack" },
        ],
        [
          { x: -5, y: -15, z: 5, direction: "bottomLeftFront" },
          { x: -4, y: -10, z: 4, direction: "topRightBack" },
        ],
        [
          { x: -5, y: -15, z: 5, direction: "bottomLeftFront" },
          { x: -6, y: -10, z: 6, direction: "topLeftFront" },
        ],
        [
          { x: -5, y: -15, z: 5, direction: "bottomLeftFront" },
          { x: -4, y: -10, z: 6, direction: "topRightFront" },
        ],
        [
          { x: -5, y: -5, z: 15, direction: "bottomLeftFront" },
          { x: -6, y: -4, z: 10, direction: "topLeftBack" },
        ],
        [
          { x: -5, y: -5, z: 15, direction: "bottomLeftFront" },
          { x: -4, y: -4, z: 10, direction: "topRightBack" },
        ],
        [
          { x: -5, y: -5, z: 15, direction: "bottomLeftFront" },
          { x: -6, y: -6, z: 10, direction: "bottomLeftBack" },
        ],
        [
          { x: -5, y: -5, z: 15, direction: "bottomLeftFront" },
          { x: -4, y: -6, z: 10, direction: "bottomRightBack" },
        ],
        [
          { x: -15, y: -15, z: 5, direction: "bottomLeftFront" },
          { x: -10, y: -10, z: 6, direction: "topRightFront" },
        ],
        [
          { x: -15, y: -15, z: 5, direction: "bottomLeftFront" },
          { x: -10, y: -10, z: 4, direction: "topRightBack" },
        ],
        [
          { x: -15, y: -5, z: 15, direction: "bottomLeftFront" },
          { x: -10, y: -6, z: 10, direction: "bottomRightBack" },
        ],
        [
          { x: -15, y: -5, z: 15, direction: "bottomLeftFront" },
          { x: -10, y: -4, z: 10, direction: "topRightBack" },
        ],
        [
          { x: -5, y: -15, z: 15, direction: "bottomLeftFront" },
          { x: -6, y: -10, z: 10, direction: "topLeftBack" },
        ],
        [
          { x: -5, y: -15, z: 15, direction: "bottomLeftFront" },
          { x: -4, y: -10, z: 10, direction: "topRightBack" },
        ],
        [
          { x: -15, y: -15, z: 15, direction: "bottomLeftFront" },
          { x: -10, y: -10, z: 10, direction: "topRightBack" },
        ],

        [
          { x: 15, y: -5, z: 5, direction: "bottomRightFront" },
          { x: 10, y: -4, z: 4, direction: "topLeftBack" },
        ],
        [
          { x: 15, y: -5, z: 5, direction: "bottomRightFront" },
          { x: 10, y: -6, z: 4, direction: "bottomLeftBack" },
        ],
        [
          { x: 15, y: -5, z: 5, direction: "bottomRightFront" },
          { x: 10, y: -4, z: 6, direction: "topLeftFront" },
        ],
        [
          { x: 15, y: -5, z: 5, direction: "bottomRightFront" },
          { x: 10, y: -6, z: 6, direction: "bottomLeftFront" },
        ],
        [
          { x: 5, y: -15, z: 5, direction: "bottomRightFront" },
          { x: 6, y: -10, z: 4, direction: "topRightBack" },
        ],
        [
          { x: 5, y: -15, z: 5, direction: "bottomRightFront" },
          { x: 4, y: -10, z: 4, direction: "topLeftBack" },
        ],
        [
          { x: 5, y: -15, z: 5, direction: "bottomRightFront" },
          { x: 6, y: -10, z: 6, direction: "topRightFront" },
        ],
        [
          { x: 5, y: -15, z: 5, direction: "bottomRightFront" },
          { x: 4, y: -10, z: 6, direction: "topLeftFront" },
        ],
        [
          { x: 5, y: -5, z: 15, direction: "bottomRightFront" },
          { x: 6, y: -4, z: 10, direction: "topRightBack" },
        ],
        [
          { x: 5, y: -5, z: 15, direction: "bottomRightFront" },
          { x: 4, y: -4, z: 10, direction: "topLeftBack" },
        ],
        [
          { x: 5, y: -5, z: 15, direction: "bottomRightFront" },
          { x: 6, y: -6, z: 10, direction: "bottomRightBack" },
        ],
        [
          { x: 5, y: -5, z: 15, direction: "bottomRightFront" },
          { x: 4, y: -6, z: 10, direction: "bottomLeftBack" },
        ],
        [
          { x: 15, y: -15, z: 5, direction: "bottomRightFront" },
          { x: 10, y: -10, z: 6, direction: "topLeftFront" },
        ],
        [
          { x: 15, y: -15, z: 5, direction: "bottomRightFront" },
          { x: 10, y: -10, z: 4, direction: "topLeftBack" },
        ],
        [
          { x: 15, y: -5, z: 15, direction: "bottomRightFront" },
          { x: 10, y: -6, z: 10, direction: "bottomLeftBack" },
        ],
        [
          { x: 15, y: -5, z: 15, direction: "bottomRightFront" },
          { x: 10, y: -4, z: 10, direction: "topLeftBack" },
        ],
        [
          { x: 5, y: -15, z: 15, direction: "bottomRightFront" },
          { x: 6, y: -10, z: 10, direction: "topRightBack" },
        ],
        [
          { x: 5, y: -15, z: 15, direction: "bottomRightFront" },
          { x: 4, y: -10, z: 10, direction: "topLeftBack" },
        ],
        [
          { x: 15, y: -15, z: 15, direction: "bottomRightFront" },
          { x: 10, y: -10, z: 10, direction: "topLeftBack" },
        ],

        [
          { x: -15, y: 5, z: -5, direction: "topLeftBack" },
          { x: -10, y: 6, z: -4, direction: "topRightFront" },
        ],
        [
          { x: -15, y: 5, z: -5, direction: "topLeftBack" },
          { x: -10, y: 4, z: -4, direction: "bottomRightFront" },
        ],
        [
          { x: -15, y: 5, z: -5, direction: "topLeftBack" },
          { x: -10, y: 4, z: -6, direction: "bottomRightBack" },
        ],
        [
          { x: -15, y: 5, z: -5, direction: "topLeftBack" },
          { x: -10, y: 6, z: -6, direction: "topRightBack" },
        ],
        [
          { x: -5, y: 15, z: -5, direction: "topLeftBack" },
          { x: -6, y: 10, z: -4, direction: "bottomLeftFront" },
        ],
        [
          { x: -5, y: 15, z: -5, direction: "topLeftBack" },
          { x: -4, y: 10, z: -4, direction: "bottomRightFront" },
        ],
        [
          { x: -5, y: 15, z: -5, direction: "topLeftBack" },
          { x: -6, y: 10, z: -6, direction: "bottomLeftBack" },
        ],
        [
          { x: -5, y: 15, z: -5, direction: "topLeftBack" },
          { x: -4, y: 10, z: -6, direction: "bottomRightBack" },
        ],
        [
          { x: -5, y: 5, z: -15, direction: "topLeftBack" },
          { x: -6, y: 4, z: -10, direction: "bottomLeftFront" },
        ],
        [
          { x: -5, y: 5, z: -15, direction: "topLeftBack" },
          { x: -4, y: 4, z: -10, direction: "bottomRightFront" },
        ],
        [
          { x: -5, y: 5, z: -15, direction: "topLeftBack" },
          { x: -6, y: 6, z: -10, direction: "topLeftFront" },
        ],
        [
          { x: -5, y: 5, z: -15, direction: "topLeftBack" },
          { x: -4, y: 6, z: -10, direction: "topRightFront" },
        ],
        [
          { x: -15, y: 15, z: -5, direction: "topLeftBack" },
          { x: -10, y: 10, z: -6, direction: "bottomRightBack" },
        ],
        [
          { x: -15, y: 15, z: -5, direction: "topLeftBack" },
          { x: -10, y: 10, z: -4, direction: "bottomRightFront" },
        ],
        [
          { x: -15, y: 5, z: -15, direction: "topLeftBack" },
          { x: -10, y: 6, z: -10, direction: "topRightFront" },
        ],
        [
          { x: -15, y: 5, z: -15, direction: "topLeftBack" },
          { x: -10, y: 4, z: -10, direction: "bottomRightFront" },
        ],
        [
          { x: -5, y: 15, z: -15, direction: "topLeftBack" },
          { x: -6, y: 10, z: -10, direction: "bottomLeftFront" },
        ],
        [
          { x: -5, y: 15, z: -15, direction: "topLeftBack" },
          { x: -4, y: 10, z: -10, direction: "bottomRightFront" },
        ],
        [
          { x: -15, y: 15, z: -15, direction: "topLeftBack" },
          { x: -10, y: 10, z: -10, direction: "bottomRightFront" },
        ],

        [
          { x: 15, y: 5, z: -5, direction: "topRightBack" },
          { x: 10, y: 4, z: -4, direction: "bottomLeftFront" },
        ],
        [
          { x: 15, y: 5, z: -5, direction: "topRightBack" },
          { x: 10, y: 6, z: -4, direction: "topLeftFront" },
        ],
        [
          { x: 15, y: 5, z: -5, direction: "topRightBack" },
          { x: 10, y: 4, z: -6, direction: "bottomLeftBack" },
        ],
        [
          { x: 15, y: 5, z: -5, direction: "topRightBack" },
          { x: 10, y: 6, z: -6, direction: "topLeftBack" },
        ],
        [
          { x: 5, y: 15, z: -5, direction: "topRightBack" },
          { x: 6, y: 10, z: -4, direction: "bottomRightFront" },
        ],
        [
          { x: 5, y: 15, z: -5, direction: "topRightBack" },
          { x: 4, y: 10, z: -4, direction: "bottomLeftFront" },
        ],
        [
          { x: 5, y: 15, z: -5, direction: "topRightBack" },
          { x: 6, y: 10, z: -6, direction: "bottomRightBack" },
        ],
        [
          { x: 5, y: 15, z: -5, direction: "topRightBack" },
          { x: 4, y: 10, z: -6, direction: "bottomLeftBack" },
        ],
        [
          { x: 5, y: 5, z: -15, direction: "topRightBack" },
          { x: 6, y: 4, z: -10, direction: "bottomRightFront" },
        ],
        [
          { x: 5, y: 5, z: -15, direction: "topRightBack" },
          { x: 4, y: 4, z: -10, direction: "bottomLeftFront" },
        ],
        [
          { x: 5, y: 5, z: -15, direction: "topRightBack" },
          { x: 6, y: 6, z: -10, direction: "topRightFront" },
        ],
        [
          { x: 5, y: 5, z: -15, direction: "topRightBack" },
          { x: 4, y: 6, z: -10, direction: "topLeftFront" },
        ],
        [
          { x: 15, y: 15, z: -5, direction: "topRightBack" },
          { x: 10, y: 10, z: -6, direction: "bottomLeftBack" },
        ],
        [
          { x: 15, y: 15, z: -5, direction: "topRightBack" },
          { x: 10, y: 10, z: -4, direction: "bottomLeftFront" },
        ],
        [
          { x: 15, y: 5, z: -15, direction: "topRightBack" },
          { x: 10, y: 6, z: -10, direction: "topLeftFront" },
        ],
        [
          { x: 15, y: 5, z: -15, direction: "topRightBack" },
          { x: 10, y: 4, z: -10, direction: "bottomLeftFront" },
        ],
        [
          { x: 5, y: 15, z: -15, direction: "topRightBack" },
          { x: 6, y: 10, z: -10, direction: "bottomRightFront" },
        ],
        [
          { x: 5, y: 15, z: -15, direction: "topRightBack" },
          { x: 4, y: 10, z: -10, direction: "bottomLeftFront" },
        ],
        [
          { x: 15, y: 15, z: -15, direction: "topRightBack" },
          { x: 10, y: 10, z: -10, direction: "bottomLeftFront" },
        ],

        [
          { x: -15, y: -5, z: -5, direction: "bottomLeftBack" },
          { x: -10, y: -4, z: -4, direction: "topRightFront" },
        ],
        [
          { x: -15, y: -5, z: -5, direction: "bottomLeftBack" },
          { x: -10, y: -6, z: -4, direction: "bottomRightFront" },
        ],
        [
          { x: -15, y: -5, z: -5, direction: "bottomLeftBack" },
          { x: -10, y: -4, z: -6, direction: "topRightBack" },
        ],
        [
          { x: -15, y: -5, z: -5, direction: "bottomLeftBack" },
          { x: -10, y: -6, z: -6, direction: "bottomRightBack" },
        ],
        [
          { x: -5, y: -15, z: -5, direction: "bottomLeftBack" },
          { x: -6, y: -10, z: -4, direction: "topLeftFront" },
        ],
        [
          { x: -5, y: -15, z: -5, direction: "bottomLeftBack" },
          { x: -4, y: -10, z: -4, direction: "topRightFront" },
        ],
        [
          { x: -5, y: -15, z: -5, direction: "bottomLeftBack" },
          { x: -6, y: -10, z: -6, direction: "topLeftBack" },
        ],
        [
          { x: -5, y: -15, z: -5, direction: "bottomLeftBack" },
          { x: -4, y: -10, z: -6, direction: "topRightBack" },
        ],
        [
          { x: -5, y: -5, z: -15, direction: "bottomLeftBack" },
          { x: -6, y: -4, z: -10, direction: "topLeftFront" },
        ],
        [
          { x: -5, y: -5, z: -15, direction: "bottomLeftBack" },
          { x: -4, y: -4, z: -10, direction: "topRightFront" },
        ],
        [
          { x: -5, y: -5, z: -15, direction: "bottomLeftBack" },
          { x: -6, y: -6, z: -10, direction: "bottomLeftFront" },
        ],
        [
          { x: -5, y: -5, z: -15, direction: "bottomLeftBack" },
          { x: -4, y: -6, z: -10, direction: "bottomRightFront" },
        ],
        [
          { x: -15, y: -15, z: -5, direction: "bottomLeftBack" },
          { x: -10, y: -10, z: -6, direction: "topRightBack" },
        ],
        [
          { x: -15, y: -15, z: -5, direction: "bottomLeftBack" },
          { x: -10, y: -10, z: -4, direction: "topRightFront" },
        ],
        [
          { x: -15, y: -5, z: -15, direction: "bottomLeftBack" },
          { x: -10, y: -6, z: -10, direction: "bottomRightFront" },
        ],
        [
          { x: -15, y: -5, z: -15, direction: "bottomLeftBack" },
          { x: -10, y: -4, z: -10, direction: "topRightFront" },
        ],
        [
          { x: -5, y: -15, z: -15, direction: "bottomLeftBack" },
          { x: -6, y: -10, z: -10, direction: "topLeftFront" },
        ],
        [
          { x: -5, y: -15, z: -15, direction: "bottomLeftBack" },
          { x: -4, y: -10, z: -10, direction: "topRightFront" },
        ],
        [
          { x: -15, y: -15, z: -15, direction: "bottomLeftBack" },
          { x: -10, y: -10, z: -10, direction: "topRightFront" },
        ],

        [
          { x: 15, y: -5, z: -5, direction: "bottomRightBack" },
          { x: 10, y: -4, z: -4, direction: "topLeftFront" },
        ],
        [
          { x: 15, y: -5, z: -5, direction: "bottomRightBack" },
          { x: 10, y: -6, z: -4, direction: "bottomLeftFront" },
        ],
        [
          { x: 15, y: -5, z: -5, direction: "bottomRightBack" },
          { x: 10, y: -4, z: -6, direction: "topLeftBack" },
        ],
        [
          { x: 15, y: -5, z: -5, direction: "bottomRightBack" },
          { x: 10, y: -6, z: -6, direction: "bottomLeftBack" },
        ],
        [
          { x: 5, y: -15, z: -5, direction: "bottomRightBack" },
          { x: 6, y: -10, z: -4, direction: "topRightFront" },
        ],
        [
          { x: 5, y: -15, z: -5, direction: "bottomRightBack" },
          { x: 4, y: -10, z: -4, direction: "topLeftFront" },
        ],
        [
          { x: 5, y: -15, z: -5, direction: "bottomRightBack" },
          { x: 6, y: -10, z: -6, direction: "topRightBack" },
        ],
        [
          { x: 5, y: -15, z: -5, direction: "bottomRightBack" },
          { x: 4, y: -10, z: -6, direction: "topLeftBack" },
        ],
        [
          { x: 5, y: -5, z: -15, direction: "bottomRightBack" },
          { x: 6, y: -4, z: -10, direction: "topRightFront" },
        ],
        [
          { x: 5, y: -5, z: -15, direction: "bottomRightBack" },
          { x: 4, y: -4, z: -10, direction: "topLeftFront" },
        ],
        [
          { x: 5, y: -5, z: -15, direction: "bottomRightBack" },
          { x: 6, y: -6, z: -10, direction: "bottomRightFront" },
        ],
        [
          { x: 5, y: -5, z: -15, direction: "bottomRightBack" },
          { x: 4, y: -6, z: -10, direction: "bottomLeftFront" },
        ],
        [
          { x: 15, y: -15, z: -5, direction: "bottomRightBack" },
          { x: 10, y: -10, z: -6, direction: "topLeftBack" },
        ],
        [
          { x: 15, y: -15, z: -5, direction: "bottomRightBack" },
          { x: 10, y: -10, z: -4, direction: "topLeftFront" },
        ],
        [
          { x: 15, y: -5, z: -15, direction: "bottomRightBack" },
          { x: 10, y: -6, z: -10, direction: "bottomLeftFront" },
        ],
        [
          { x: 15, y: -5, z: -15, direction: "bottomRightBack" },
          { x: 10, y: -4, z: -10, direction: "topLeftFront" },
        ],
        [
          { x: 5, y: -15, z: -15, direction: "bottomRightBack" },
          { x: 6, y: -10, z: -10, direction: "topRightFront" },
        ],
        [
          { x: 5, y: -15, z: -15, direction: "bottomRightBack" },
          { x: 4, y: -10, z: -10, direction: "topLeftFront" },
        ],
        [
          { x: 15, y: -15, z: -15, direction: "bottomRightBack" },
          { x: 10, y: -10, z: -10, direction: "topLeftFront" },
        ],
      ])(
        "it should call callback when grandChild is within range %#",
        (childData, grandChildData) => {
          const grandChild: OctreeNode = {
            nodeId: 2,
            position: {
              x: grandChildData.x,
              y: grandChildData.y,
              z: grandChildData.z,
            },
            children: {},
          };
          const child: OctreeNode = {
            nodeId: 1,
            position: { x: childData.x, y: childData.y, z: childData.z },
            children: { [grandChildData.direction]: grandChild },
          };
          const root = {
            nodeId: 0,
            position: { x: 0, y: 0, z: 0 },
            children: {
              [childData.direction]: child,
            },
          };

          grandChild.parent = child;
          child.parent = root;

          forEachNodePairs(callback, root, 10);

          expect(callback).toHaveBeenNthCalledWith(1, root, grandChild);
          expect(callback).toHaveBeenNthCalledWith(2, child, grandChild);
        }
      );
    });

    describe("when node has a parent", () => {
      it.each([
        [
          { x: -5, y: 15, z: 5, direction: "topLeftFront" },
          { x: 5, y: 15, z: 5, direction: "topRightFront" },
        ],
        [
          { x: -5, y: 5, z: 15, direction: "topLeftFront" },
          { x: 5, y: 5, z: 15, direction: "topRightFront" },
        ],
        [
          { x: -5, y: 15, z: 15, direction: "topLeftFront" },
          { x: 5, y: 15, z: 15, direction: "topRightFront" },
        ],
        [
          { x: -5, y: -15, z: 5, direction: "bottomLeftFront" },
          { x: 5, y: -15, z: 5, direction: "bottomRightFront" },
        ],
        [
          { x: -5, y: -5, z: 15, direction: "bottomLeftFront" },
          { x: 5, y: -5, z: 15, direction: "bottomRightFront" },
        ],
        [
          { x: -5, y: -15, z: 15, direction: "bottomLeftFront" },
          { x: 5, y: -15, z: 15, direction: "bottomRightFront" },
        ],
      ])(
        "it should call callback when another child of the parent is in range %#",
        (child1Data, child2Data) => {
          const child1: OctreeNode = {
            nodeId: 2,
            position: { x: child1Data.x, y: child1Data.y, z: child1Data.z },
            children: {},
          };
          const child2: OctreeNode = {
            nodeId: 1,
            position: { x: child2Data.x, y: child2Data.y, z: child2Data.z },
            children: {},
          };
          const root = {
            nodeId: 0,
            position: { x: 0, y: 0, z: 0 },
            children: {
              [child1Data.direction]: child1,
              [child2Data.direction]: child2,
            },
          };

          child1.parent = root;
          child2.parent = root;

          forEachNodePairs(callback, root, 10);

          expect(callback).toHaveBeenCalledWith(child1, child2);
          expect(callback).toHaveBeenCalledTimes(1);
        }
      );
    });
  });
});
