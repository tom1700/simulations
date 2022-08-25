import { forEachNodeInRange, OctreeNode } from './octree';

describe('octree', () => {
    describe('forEachNodeInRange', () => {
        let callback = jest.fn();

        beforeEach(() => {
            callback = jest.fn();
        })


        it('should do nothing if the node has no children', () => {
            forEachNodeInRange(callback, { nodeId: 0, position: { x: 0, y: 0, z: 0 }, children: {} }, 10);
            expect(callback).not.toHaveBeenCalled();
        });

        describe('when node has single descendant', () => {
            it.each([
                [-10.1, 10, 10, 'topLeftFront'],
                [-10, 10.1, 10, 'topLeftFront'],
                [-10, 10, 10.1, 'topLeftFront'],
                [10.1, 10, 10, 'topRightFront'],
                [10, 10.1, 10, 'topRightFront'],
                [10, 10, 10.1, 'topRightFront'],
                [10.1, -10, 10, 'bottomRightFront'],
                [10, -10.1, 10, 'bottomRightFront'],
                [10, -10, 10.1, 'bottomRightFront'],
                [-10.1, -10, 10, 'bottomLeftFront'],
                [-10, -10.1, 10, 'bottomLeftFront'],
                [-10, -10, 10.1, 'bottomLeftFront'],
                [-10.1, 10, -10, 'topLeftBack'],
                [-10, 10.1, -10, 'topLeftBack'],
                [-10, 10, -10.1, 'topLeftBack'],
                [10.1, 10, -10, 'topRightBack'],
                [10, 10.1, -10, 'topRightBack'],
                [10, 10, -10.1, 'topRightBack'],
                [10.1, -10, -10, 'bottomRightBack'],
                [10, -10.1, -10, 'bottomRightBack'],
                [10, -10, -10.1, 'bottomRightBack'],
                [-10.1, -10, -10, 'bottomLeftBack'],
                [-10, -10.1, -10, 'bottomLeftBack'],
                [-10, -10, -10.1, 'bottomLeftBack'],
            ])('it should not call callback when child is too far away (x: %f, y: %f, z: %f) position: %s', (x, y, z, placement) => {
                const child: OctreeNode = { nodeId: 1, position: { x, y, z }, children: {} };
                const parent = {
                    nodeId: 0, position: { x: 0, y: 0, z: 0 }, children: {
                        [placement]: child
                    }
                };
                child.parent = parent;
                forEachNodeInRange(callback, parent, 10);

                expect(callback).not.toHaveBeenCalled();
            });

            it.each([
                [-10, 10, 10, 'topLeftFront'],
                [10, 10, 10, 'topRightFront'],
                [10, -10, 10, 'bottomRightFront'],
                [-10, -10, 10, 'bottomLeftFront'],
                [-10, 10, -10, 'topLeftBack'],
                [10, 10, -10, 'topRightBack'],
                [10, -10, -10, 'bottomRightBack'],
                [-10, -10, -10, 'bottomLeftBack'],
            ])('it should call the callback when child is in range (x: %f, y: %f, z: %f) position: %s', (x, y, z, placement) => {
                const child: OctreeNode = { nodeId: 1, position: { x, y, z }, children: {} };
                const parent = {
                    nodeId: 0, position: { x: 0, y: 0, z: 0 }, children: {
                        [placement]: child
                    }
                };
                child.parent = parent;

                forEachNodeInRange(callback, parent, 10);

                expect(callback).toHaveBeenCalledWith(child);
                expect(callback).toHaveBeenCalledTimes(1);
            })
        })

        describe.only('when node has more descendants', () => {
            it.each([
                [{ x: -15, y: 5, z: 5, direction: 'topLeftFront' }, { x: -10, y: 4, z: 4, direction: 'bottomRightBack' }],
                [{ x: -15, y: 5, z: 5, direction: 'topLeftFront' }, { x: -10, y: 6, z: 4, direction: 'topRightBack' }],
                [{ x: -15, y: 5, z: 5, direction: 'topLeftFront' }, { x: -10, y: 4, z: 6, direction: 'bottomRightFront' }],
                [{ x: -15, y: 5, z: 5, direction: 'topLeftFront' }, { x: -10, y: 6, z: 6, direction: 'topRightFront' }],
                [{ x: -5, y: 15, z: 5, direction: 'topLeftFront' }, { x: -6, y: 10, z: 4, direction: 'bottomLeftBack' }],
                [{ x: -5, y: 15, z: 5, direction: 'topLeftFront' }, { x: -4, y: 10, z: 4, direction: 'bottomRightBack' }],
                [{ x: -5, y: 15, z: 5, direction: 'topLeftFront' }, { x: -6, y: 10, z: 6, direction: 'bottomLeftFront' }],
                [{ x: -5, y: 15, z: 5, direction: 'topLeftFront' }, { x: -4, y: 10, z: 6, direction: 'bottomRightFront' }],
                [{ x: -5, y: 5, z: 15, direction: 'topLeftFront' }, { x: -6, y: 4, z: 10, direction: 'bottomLeftBack' }],
                [{ x: -5, y: 5, z: 15, direction: 'topLeftFront' }, { x: -4, y: 4, z: 10, direction: 'bottomRightBack' }],
                [{ x: -5, y: 5, z: 15, direction: 'topLeftFront' }, { x: -6, y: 6, z: 10, direction: 'topLeftBack' }],
                [{ x: -5, y: 5, z: 15, direction: 'topLeftFront' }, { x: -4, y: 6, z: 10, direction: 'topRightBack' }],
                [{ x: -15, y: 15, z: 5, direction: 'topLeftFront' }, { x: -10, y: 10, z: 6, direction: 'bottomRightFront' }],
                [{ x: -15, y: 15, z: 5, direction: 'topLeftFront' }, { x: -10, y: 10, z: 4, direction: 'bottomRightBack' }],
                [{ x: -15, y: 5, z: 15, direction: 'topLeftFront' }, { x: -10, y: 6, z: 10, direction: 'topRightBack' }],
                [{ x: -15, y: 5, z: 15, direction: 'topLeftFront' }, { x: -10, y: 4, z: 10, direction: 'bottomRightBack' }],
                [{ x: -5, y: 15, z: 15, direction: 'topLeftFront' }, { x: -6, y: 10, z: 10, direction: 'bottomLeftBack' }],
                [{ x: -5, y: 15, z: 15, direction: 'topLeftFront' }, { x: -4, y: 10, z: 10, direction: 'bottomRightBack' }],
                [{ x: -15, y: 15, z: 15, direction: 'topLeftFront' }, { x: -10, y: 10, z: 10, direction: 'bottomRightBack' }],

                [{ x: 15, y: 5, z: 5, direction: 'topRightFront' }, { x: 10, y: 4, z: 4, direction: 'bottomLeftBack' }],
                [{ x: 15, y: 5, z: 5, direction: 'topRightFront' }, { x: 10, y: 6, z: 4, direction: 'topLeftBack' }],
                [{ x: 15, y: 5, z: 5, direction: 'topRightFront' }, { x: 10, y: 4, z: 6, direction: 'bottomLeftFront' }],
                [{ x: 15, y: 5, z: 5, direction: 'topRightFront' }, { x: 10, y: 6, z: 6, direction: 'topLeftFront' }],
                [{ x: 5, y: 15, z: 5, direction: 'topRightFront' }, { x: 6, y: 10, z: 4, direction: 'bottomRightBack' }],
                [{ x: 5, y: 15, z: 5, direction: 'topRightFront' }, { x: 4, y: 10, z: 4, direction: 'bottomLeftBack' }],
                [{ x: 5, y: 15, z: 5, direction: 'topRightFront' }, { x: 6, y: 10, z: 6, direction: 'bottomRightFront' }],
                [{ x: 5, y: 15, z: 5, direction: 'topRightFront' }, { x: 4, y: 10, z: 6, direction: 'bottomLeftFront' }],
                [{ x: 5, y: 5, z: 15, direction: 'topRightFront' }, { x: 6, y: 4, z: 10, direction: 'bottomRightBack' }],
                [{ x: 5, y: 5, z: 15, direction: 'topRightFront' }, { x: 4, y: 4, z: 10, direction: 'bottomLeftBack' }],
                [{ x: 5, y: 5, z: 15, direction: 'topRightFront' }, { x: 6, y: 6, z: 10, direction: 'topRightBack' }],
                [{ x: 5, y: 5, z: 15, direction: 'topRightFront' }, { x: 4, y: 6, z: 10, direction: 'topLeftBack' }],
                [{ x: 15, y: 15, z: 5, direction: 'topRightFront' }, { x: 10, y: 10, z: 6, direction: 'bottomLeftFront' }],
                [{ x: 15, y: 15, z: 5, direction: 'topRightFront' }, { x: 10, y: 10, z: 4, direction: 'bottomLeftBack' }],
                [{ x: 15, y: 5, z: 15, direction: 'topRightFront' }, { x: 10, y: 6, z: 10, direction: 'topLeftBack' }],
                [{ x: 15, y: 5, z: 15, direction: 'topRightFront' }, { x: 10, y: 4, z: 10, direction: 'bottomLeftBack' }],
                [{ x: 5, y: 15, z: 15, direction: 'topRightFront' }, { x: 6, y: 10, z: 10, direction: 'bottomRightBack' }],
                [{ x: 5, y: 15, z: 15, direction: 'topRightFront' }, { x: 4, y: 10, z: 10, direction: 'bottomLeftBack' }],
                [{ x: 15, y: 15, z: 15, direction: 'topRightFront' }, { x: 10, y: 10, z: 10, direction: 'bottomLeftBack' }],

                [{ x: -15, y: -5, z: 5, direction: 'bottomLeftFront' }, { x: -10, y: -4, z: 4, direction: 'topRightBack' }],
                [{ x: -15, y: -5, z: 5, direction: 'bottomLeftFront' }, { x: -10, y: -6, z: 4, direction: 'bottomRightBack' }],
                [{ x: -15, y: -5, z: 5, direction: 'bottomLeftFront' }, { x: -10, y: -4, z: 6, direction: 'topRightFront' }],
                [{ x: -15, y: -5, z: 5, direction: 'bottomLeftFront' }, { x: -10, y: -6, z: 6, direction: 'bottomRightFront' }],
                [{ x: -5, y: -15, z: 5, direction: 'bottomLeftFront' }, { x: -6, y: -10, z: 4, direction: 'topLeftBack' }],
                [{ x: -5, y: -15, z: 5, direction: 'bottomLeftFront' }, { x: -4, y: -10, z: 4, direction: 'topRightBack' }],
                [{ x: -5, y: -15, z: 5, direction: 'bottomLeftFront' }, { x: -6, y: -10, z: 6, direction: 'topLeftFront' }],
                [{ x: -5, y: -15, z: 5, direction: 'bottomLeftFront' }, { x: -4, y: -10, z: 6, direction: 'topRightFront' }],
                [{ x: -5, y: -5, z: 15, direction: 'bottomLeftFront' }, { x: -6, y: -4, z: 10, direction: 'topLeftBack' }],
                [{ x: -5, y: -5, z: 15, direction: 'bottomLeftFront' }, { x: -4, y: -4, z: 10, direction: 'topRightBack' }],
                [{ x: -5, y: -5, z: 15, direction: 'bottomLeftFront' }, { x: -6, y: -6, z: 10, direction: 'bottomLeftBack' }],
                [{ x: -5, y: -5, z: 15, direction: 'bottomLeftFront' }, { x: -4, y: -6, z: 10, direction: 'bottomRightBack' }],
                [{ x: -15, y: -15, z: 5, direction: 'bottomLeftFront' }, { x: -10, y: -10, z: 6, direction: 'topRightFront' }],
                [{ x: -15, y: -15, z: 5, direction: 'bottomLeftFront' }, { x: -10, y: -10, z: 4, direction: 'topRightBack' }],
                [{ x: -15, y: -5, z: 15, direction: 'bottomLeftFront' }, { x: -10, y: -6, z: 10, direction: 'bottomRightBack' }],
                [{ x: -15, y: -5, z: 15, direction: 'bottomLeftFront' }, { x: -10, y: -4, z: 10, direction: 'topRightBack' }],
                [{ x: -5, y: -15, z: 15, direction: 'bottomLeftFront' }, { x: -6, y: -10, z: 10, direction: 'topLeftBack' }],
                [{ x: -5, y: -15, z: 15, direction: 'bottomLeftFront' }, { x: -4, y: -10, z: 10, direction: 'topRightBack' }],
                [{ x: -15, y: -15, z: 15, direction: 'bottomLeftFront' }, { x: -10, y: -10, z: 10, direction: 'topRightBack' }],

                [{ x: 15, y: -5, z: 5, direction: 'bottomRightFront' }, { x: 10, y: -4, z: 4, direction: 'topLeftBack' }],
                [{ x: 15, y: -5, z: 5, direction: 'bottomRightFront' }, { x: 10, y: -6, z: 4, direction: 'bottomLeftBack' }],
                [{ x: 15, y: -5, z: 5, direction: 'bottomRightFront' }, { x: 10, y: -4, z: 6, direction: 'topLeftFront' }],
                [{ x: 15, y: -5, z: 5, direction: 'bottomRightFront' }, { x: 10, y: -6, z: 6, direction: 'bottomLeftFront' }],
                [{ x: 5, y: -15, z: 5, direction: 'bottomRightFront' }, { x: 6, y: -10, z: 4, direction: 'topRightBack' }],
                [{ x: 5, y: -15, z: 5, direction: 'bottomRightFront' }, { x: 4, y: -10, z: 4, direction: 'topLeftBack' }],
                [{ x: 5, y: -15, z: 5, direction: 'bottomRightFront' }, { x: 6, y: -10, z: 6, direction: 'topRightFront' }],
                [{ x: 5, y: -15, z: 5, direction: 'bottomRightFront' }, { x: 4, y: -10, z: 6, direction: 'topLeftFront' }],
                [{ x: 5, y: -5, z: 15, direction: 'bottomRightFront' }, { x: 6, y: -4, z: 10, direction: 'topRightBack' }],
                [{ x: 5, y: -5, z: 15, direction: 'bottomRightFront' }, { x: 4, y: -4, z: 10, direction: 'topLeftBack' }],
                [{ x: 5, y: -5, z: 15, direction: 'bottomRightFront' }, { x: 6, y: -6, z: 10, direction: 'bottomRightBack' }],
                [{ x: 5, y: -5, z: 15, direction: 'bottomRightFront' }, { x: 4, y: -6, z: 10, direction: 'bottomLeftBack' }],
                [{ x: 15, y: -15, z: 5, direction: 'bottomRightFront' }, { x: 10, y: -10, z: 6, direction: 'topLeftFront' }],
                [{ x: 15, y: -15, z: 5, direction: 'bottomRightFront' }, { x: 10, y: -10, z: 4, direction: 'topLeftBack' }],
                [{ x: 15, y: -5, z: 15, direction: 'bottomRightFront' }, { x: 10, y: -6, z: 10, direction: 'bottomLeftBack' }],
                [{ x: 15, y: -5, z: 15, direction: 'bottomRightFront' }, { x: 10, y: -4, z: 10, direction: 'topLeftBack' }],
                [{ x: 5, y: -15, z: 15, direction: 'bottomRightFront' }, { x: 6, y: -10, z: 10, direction: 'topRightBack' }],
                [{ x: 5, y: -15, z: 15, direction: 'bottomRightFront' }, { x: 4, y: -10, z: 10, direction: 'topLeftBack' }],
                [{ x: 15, y: -15, z: 15, direction: 'bottomRightFront' }, { x: 10, y: -10, z: 10, direction: 'topLeftBack' }],

                [{ x: -15, y: 5, z: -5, direction: 'topLeftBack' }, { x: -10, y: 6, z: -4, direction: 'topRightFront' }],
                [{ x: -15, y: 5, z: -5, direction: 'topLeftBack' }, { x: -10, y: 4, z: -4, direction: 'bottomRightFront' }],
                [{ x: -15, y: 5, z: -5, direction: 'topLeftBack' }, { x: -10, y: 4, z: -6, direction: 'bottomRightBack' }],
                [{ x: -15, y: 5, z: -5, direction: 'topLeftBack' }, { x: -10, y: 6, z: -6, direction: 'topRightBack' }],
                [{ x: -5, y: 15, z: -5, direction: 'topLeftBack' }, { x: -6, y: 10, z: -4, direction: 'bottomLeftFront' }],
                [{ x: -5, y: 15, z: -5, direction: 'topLeftBack' }, { x: -4, y: 10, z: -4, direction: 'bottomRightFront' }],
                [{ x: -5, y: 15, z: -5, direction: 'topLeftBack' }, { x: -6, y: 10, z: -6, direction: 'bottomLeftBack' }],
                [{ x: -5, y: 15, z: -5, direction: 'topLeftBack' }, { x: -4, y: 10, z: -6, direction: 'bottomRightBack' }],
                [{ x: -5, y: 5, z: -15, direction: 'topLeftBack' }, { x: -6, y: 4, z: -10, direction: 'bottomLeftFront' }],
                [{ x: -5, y: 5, z: -15, direction: 'topLeftBack' }, { x: -4, y: 4, z: -10, direction: 'bottomRightFront' }],
                [{ x: -5, y: 5, z: -15, direction: 'topLeftBack' }, { x: -6, y: 6, z: -10, direction: 'topLeftFront' }],
                [{ x: -5, y: 5, z: -15, direction: 'topLeftBack' }, { x: -4, y: 6, z: -10, direction: 'topRightFront' }],
                [{ x: -15, y: 15, z: -5, direction: 'topLeftBack' }, { x: -10, y: 10, z: -6, direction: 'bottomRightBack' }],
                [{ x: -15, y: 15, z: -5, direction: 'topLeftBack' }, { x: -10, y: 10, z: -4, direction: 'bottomRightFront' }],
                [{ x: -15, y: 5, z: -15, direction: 'topLeftBack' }, { x: -10, y: 6, z: -10, direction: 'topRightFront' }],
                [{ x: -15, y: 5, z: -15, direction: 'topLeftBack' }, { x: -10, y: 4, z: -10, direction: 'bottomRightFront' }],
                [{ x: -5, y: 15, z: -15, direction: 'topLeftBack' }, { x: -6, y: 10, z: -10, direction: 'bottomLeftFront' }],
                [{ x: -5, y: 15, z: -15, direction: 'topLeftBack' }, { x: -4, y: 10, z: -10, direction: 'bottomRightFront' }],
                [{ x: -15, y: 15, z: -15, direction: 'topLeftBack' }, { x: -10, y: 10, z: -10, direction: 'bottomRightFront' }],

                [{ x: 15, y: 5, z: -5, direction: 'topRightBack' }, { x: 10, y: 4, z: -4, direction: 'bottomLeftFront' }],
                [{ x: 15, y: 5, z: -5, direction: 'topRightBack' }, { x: 10, y: 6, z: -4, direction: 'topLeftFront' }],
                [{ x: 15, y: 5, z: -5, direction: 'topRightBack' }, { x: 10, y: 4, z: -6, direction: 'bottomLeftBack' }],
                [{ x: 15, y: 5, z: -5, direction: 'topRightBack' }, { x: 10, y: 6, z: -6, direction: 'topLeftBack' }],
                [{ x: 5, y: 15, z: -5, direction: 'topRightBack' }, { x: 6, y: 10, z: -4, direction: 'bottomRightFront' }],
                [{ x: 5, y: 15, z: -5, direction: 'topRightBack' }, { x: 4, y: 10, z: -4, direction: 'bottomLeftFront' }],
                [{ x: 5, y: 15, z: -5, direction: 'topRightBack' }, { x: 6, y: 10, z: -6, direction: 'bottomRightBack' }],
                [{ x: 5, y: 15, z: -5, direction: 'topRightBack' }, { x: 4, y: 10, z: -6, direction: 'bottomLeftBack' }],
                [{ x: 5, y: 5, z: -15, direction: 'topRightBack' }, { x: 6, y: 4, z: -10, direction: 'bottomRightFront' }],
                [{ x: 5, y: 5, z: -15, direction: 'topRightBack' }, { x: 4, y: 4, z: -10, direction: 'bottomLeftFront' }],
                [{ x: 5, y: 5, z: -15, direction: 'topRightBack' }, { x: 6, y: 6, z: -10, direction: 'topRightFront' }],
                [{ x: 5, y: 5, z: -15, direction: 'topRightBack' }, { x: 4, y: 6, z: -10, direction: 'topLeftFront' }],
                [{ x: 15, y: 15, z: -5, direction: 'topRightBack' }, { x: 10, y: 10, z: -6, direction: 'bottomLeftBack' }],
                [{ x: 15, y: 15, z: -5, direction: 'topRightBack' }, { x: 10, y: 10, z: -4, direction: 'bottomLeftFront' }],
                [{ x: 15, y: 5, z: -15, direction: 'topRightBack' }, { x: 10, y: 6, z: -10, direction: 'topLeftFront' }],
                [{ x: 15, y: 5, z: -15, direction: 'topRightBack' }, { x: 10, y: 4, z: -10, direction: 'bottomLeftFront' }],
                [{ x: 5, y: 15, z: -15, direction: 'topRightBack' }, { x: 6, y: 10, z: -10, direction: 'bottomRightFront' }],
                [{ x: 5, y: 15, z: -15, direction: 'topRightBack' }, { x: 4, y: 10, z: -10, direction: 'bottomLeftFront' }],
                [{ x: 15, y: 15, z: -15, direction: 'topRightBack' }, { x: 10, y: 10, z: -10, direction: 'bottomLeftFront' }],

                [{ x: -15, y: -5, z: -5, direction: 'bottomLeftBack' }, { x: -10, y: -4, z: -4, direction: 'topRightFront' }],
                [{ x: -15, y: -5, z: -5, direction: 'bottomLeftBack' }, { x: -10, y: -6, z: -4, direction: 'bottomRightFront' }],
                [{ x: -15, y: -5, z: -5, direction: 'bottomLeftBack' }, { x: -10, y: -4, z: -6, direction: 'topRightBack' }],
                [{ x: -15, y: -5, z: -5, direction: 'bottomLeftBack' }, { x: -10, y: -6, z: -6, direction: 'bottomRightBack' }],
                [{ x: -5, y: -15, z: -5, direction: 'bottomLeftBack' }, { x: -6, y: -10, z: -4, direction: 'topLeftFront' }],
                [{ x: -5, y: -15, z: -5, direction: 'bottomLeftBack' }, { x: -4, y: -10, z: -4, direction: 'topRightFront' }],
                [{ x: -5, y: -15, z: -5, direction: 'bottomLeftBack' }, { x: -6, y: -10, z: -6, direction: 'topLeftBack' }],
                [{ x: -5, y: -15, z: -5, direction: 'bottomLeftBack' }, { x: -4, y: -10, z: -6, direction: 'topRightBack' }],
                [{ x: -5, y: -5, z: -15, direction: 'bottomLeftBack' }, { x: -6, y: -4, z: -10, direction: 'topLeftFront' }],
                [{ x: -5, y: -5, z: -15, direction: 'bottomLeftBack' }, { x: -4, y: -4, z: -10, direction: 'topRightFront' }],
                [{ x: -5, y: -5, z: -15, direction: 'bottomLeftBack' }, { x: -6, y: -6, z: -10, direction: 'bottomLeftFront' }],
                [{ x: -5, y: -5, z: -15, direction: 'bottomLeftBack' }, { x: -4, y: -6, z: -10, direction: 'bottomRightFront' }],
                [{ x: -15, y: -15, z: -5, direction: 'bottomLeftBack' }, { x: -10, y: -10, z: -6, direction: 'topRightBack' }],
                [{ x: -15, y: -15, z: -5, direction: 'bottomLeftBack' }, { x: -10, y: -10, z: -4, direction: 'topRightFront' }],
                [{ x: -15, y: -5, z: -15, direction: 'bottomLeftBack' }, { x: -10, y: -6, z: -10, direction: 'bottomRightFront' }],
                [{ x: -15, y: -5, z: -15, direction: 'bottomLeftBack' }, { x: -10, y: -4, z: -10, direction: 'topRightFront' }],
                [{ x: -5, y: -15, z: -15, direction: 'bottomLeftBack' }, { x: -6, y: -10, z: -10, direction: 'topLeftFront' }],
                [{ x: -5, y: -15, z: -15, direction: 'bottomLeftBack' }, { x: -4, y: -10, z: -10, direction: 'topRightFront' }],
                [{ x: -15, y: -15, z: -15, direction: 'bottomLeftBack' }, { x: -10, y: -10, z: -10, direction: 'topRightFront' }],

                [{ x: 15, y: -5, z: -5, direction: 'bottomRightBack' }, { x: 10, y: -4, z: -4, direction: 'topLeftFront' }],
                [{ x: 15, y: -5, z: -5, direction: 'bottomRightBack' }, { x: 10, y: -6, z: -4, direction: 'bottomLeftFront' }],
                [{ x: 15, y: -5, z: -5, direction: 'bottomRightBack' }, { x: 10, y: -4, z: -6, direction: 'topLeftBack' }],
                [{ x: 15, y: -5, z: -5, direction: 'bottomRightBack' }, { x: 10, y: -6, z: -6, direction: 'bottomLeftBack' }],
                [{ x: 5, y: -15, z: -5, direction: 'bottomRightBack' }, { x: 6, y: -10, z: -4, direction: 'topRightFront' }],
                [{ x: 5, y: -15, z: -5, direction: 'bottomRightBack' }, { x: 4, y: -10, z: -4, direction: 'topLeftFront' }],
                [{ x: 5, y: -15, z: -5, direction: 'bottomRightBack' }, { x: 6, y: -10, z: -6, direction: 'topRightBack' }],
                [{ x: 5, y: -15, z: -5, direction: 'bottomRightBack' }, { x: 4, y: -10, z: -6, direction: 'topLeftBack' }],
                [{ x: 5, y: -5, z: -15, direction: 'bottomRightBack' }, { x: 6, y: -4, z: -10, direction: 'topRightFront' }],
                [{ x: 5, y: -5, z: -15, direction: 'bottomRightBack' }, { x: 4, y: -4, z: -10, direction: 'topLeftFront' }],
                [{ x: 5, y: -5, z: -15, direction: 'bottomRightBack' }, { x: 6, y: -6, z: -10, direction: 'bottomRightFront' }],
                [{ x: 5, y: -5, z: -15, direction: 'bottomRightBack' }, { x: 4, y: -6, z: -10, direction: 'bottomLeftFront' }],
                [{ x: 15, y: -15, z: -5, direction: 'bottomRightBack' }, { x: 10, y: -10, z: -6, direction: 'topLeftBack' }],
                [{ x: 15, y: -15, z: -5, direction: 'bottomRightBack' }, { x: 10, y: -10, z: -4, direction: 'topLeftFront' }],
                [{ x: 15, y: -5, z: -15, direction: 'bottomRightBack' }, { x: 10, y: -6, z: -10, direction: 'bottomLeftFront' }],
                [{ x: 15, y: -5, z: -15, direction: 'bottomRightBack' }, { x: 10, y: -4, z: -10, direction: 'topLeftFront' }],
                [{ x: 5, y: -15, z: -15, direction: 'bottomRightBack' }, { x: 6, y: -10, z: -10, direction: 'topRightFront' }],
                [{ x: 5, y: -15, z: -15, direction: 'bottomRightBack' }, { x: 4, y: -10, z: -10, direction: 'topLeftFront' }],
                [{ x: 15, y: -15, z: -15, direction: 'bottomRightBack' }, { x: 10, y: -10, z: -10, direction: 'topLeftFront' }],
            ])('it should call callback when grandChild is within range %#', (childData, grandChildData) => {
                const grandChild: OctreeNode = { nodeId: 2, position: { x: grandChildData.x, y: grandChildData.y, z: grandChildData.z }, children: {} };
                const child: OctreeNode = { nodeId: 1, position: { x: childData.x, y: childData.y, z: childData.z }, children: { [grandChildData.direction]: grandChild } };
                const root = {
                    nodeId: 0, position: { x: 0, y: 0, z: 0 }, children: {
                        [childData.direction]: child
                    }
                };

                grandChild.parent = child;
                child.parent = root;

                forEachNodeInRange(callback, root, 10);

                expect(callback).toHaveBeenCalledWith(grandChild);
                expect(callback).toHaveBeenCalledTimes(1);
            });
        })
    })
})