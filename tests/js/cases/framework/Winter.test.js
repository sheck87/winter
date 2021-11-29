import { assert } from 'chai';
import FakeDom from '../../helpers/FakeDom';

describe('Winter framework', function () {
    it('initialises correctly', function (done) {
        FakeDom
            .new()
            .addScript('modules/system/assets/js/framework-next/build/framework.js')
            .render()
            .then(
                (dom) => {
                    // Run assertions
                    try {
                        assert.exists(dom.window.winter);
                        assert.exists(dom.window.winter.addModule);
                        assert.typeOf(dom.window.winter.addModule, 'function');

                        // Check Module and Singleton abstracts exist
                        assert.exists(dom.window.winter.Module);
                        assert.exists(dom.window.winter.Singleton);

                        // Check in-built modules
                        assert.deepEqual(['debounce', 'jsonparser', 'sanitizer'], dom.window.winter.getModuleNames());

                        done();
                    } catch (error) {
                        done(error);
                    }
                },
                (error) => {
                    throw error;
                }
            );
    });

    it('can add and remove a module', function (done) {
        FakeDom
            .new()
            .addScript([
                'modules/system/assets/js/framework-next/build/framework.js',
                'tests/js/fixtures/framework/TestModule.js',
            ])
            .render()
            .then(
                (dom) => {
                    // Run assertions
                    const winter = dom.window.winter;

                    try {
                        // Check module caller
                        assert.isTrue(winter.hasModule('test'))
                        assert.deepEqual(['debounce', 'jsonparser', 'sanitizer', 'test'], dom.window.winter.getModuleNames());
                        assert.isFunction(winter.test);
                        const instance = winter.test();

                        // Check module injected methods
                        assert.equal(winter, instance.winter);
                        assert.isFunction(instance.destructor);

                        // Check module method
                        assert.exists(instance.testMethod)
                        assert.isFunction(instance.testMethod)
                        assert.equal('Tested', instance.testMethod())

                        // Check multiple instances
                        const instanceOne = winter.test();
                        instanceOne.changed = true;
                        const instanceTwo = winter.test();
                        assert.notDeepEqual(instanceOne, instanceTwo);
                        const factory = winter.getModule('test');
                        assert.deepEqual([instance, instanceOne, instanceTwo], factory.getInstances());

                        // Remove module
                        winter.removeModule('test');
                        assert.isFalse(winter.hasModule('test'));
                        assert.deepEqual(['debounce', 'jsonparser', 'sanitizer'], dom.window.winter.getModuleNames());
                        assert.isUndefined(winter.test);

                        done()
                    } catch (error) {
                        done(error)
                    }
                },
                (error) => {
                    throw error
                }
            );
    });


    it('can add and remove a singleton', function (done) {
        FakeDom
            .new()
            .addScript([
                'modules/system/assets/js/framework-next/build/framework.js',
                'tests/js/fixtures/framework/TestSingleton.js',
            ])
            .render()
            .then(
                (dom) => {
                    // Run assertions
                    const winter = dom.window.winter;

                    try {
                        // Check module caller
                        assert.isTrue(winter.hasModule('test'))
                        assert.deepEqual(['debounce', 'jsonparser', 'sanitizer', 'test'], dom.window.winter.getModuleNames());
                        assert.isFunction(winter.test);
                        const instance = winter.test();

                        // Check module injected methods
                        assert.equal(winter, instance.winter);
                        assert.isFunction(instance.destructor);

                        // Check module method
                        assert.exists(instance.testMethod)
                        assert.isFunction(instance.testMethod)
                        assert.equal('Tested', instance.testMethod())

                        // Check multiple instances (these should all be the same as this instance is a singleton)
                        const instanceOne = winter.test();
                        instanceOne.changed = true;
                        const instanceTwo = winter.test();
                        assert.deepEqual(instanceOne, instanceTwo);
                        const factory = winter.getModule('test');
                        assert.deepEqual([instance], factory.getInstances());

                        // Remove module
                        winter.removeModule('test');
                        assert.isFalse(winter.hasModule('test'));
                        assert.deepEqual(['debounce', 'jsonparser', 'sanitizer'], dom.window.winter.getModuleNames());
                        assert.isUndefined(winter.test);

                        done()
                    } catch (error) {
                        done(error)
                    }
                },
                (error) => {
                    throw error
                }
            );
    });
});
