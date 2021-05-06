
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Sidebar.svelte generated by Svelte v3.38.2 */

    const file$4 = "src/Sidebar.svelte";

    function create_fragment$4(ctx) {
    	let nav;
    	let ul;
    	let li0;
    	let a0;
    	let svg;
    	let path;
    	let t0;
    	let span0;
    	let t2;
    	let li1;
    	let a1;
    	let span1;
    	let t4;
    	let li2;
    	let a2;
    	let span2;
    	let t6;
    	let li3;
    	let a3;
    	let span3;
    	let t8;
    	let li4;
    	let a4;
    	let span4;
    	let t10;
    	let li5;
    	let a5;
    	let span5;
    	let t12;
    	let li6;
    	let a6;
    	let span6;
    	let t14;
    	let li7;
    	let a7;
    	let span7;
    	let t16;
    	let li8;
    	let a8;
    	let span8;
    	let t18;
    	let li9;
    	let a9;
    	let span9;
    	let t20;
    	let li10;
    	let a10;
    	let span10;
    	let t22;
    	let li11;
    	let a11;
    	let span11;
    	let t24;
    	let li12;
    	let a12;
    	let span12;
    	let t26;
    	let li13;
    	let a13;
    	let span13;
    	let t28;
    	let li14;
    	let a14;
    	let span14;
    	let t30;
    	let li15;
    	let a15;
    	let span15;
    	let t32;
    	let li16;
    	let a16;
    	let span16;
    	let t34;
    	let li17;
    	let a17;
    	let span17;
    	let t36;
    	let li18;
    	let a18;
    	let span18;
    	let t38;
    	let li19;
    	let a19;
    	let span19;
    	let t40;
    	let li20;
    	let a20;
    	let span20;
    	let t42;
    	let li21;
    	let a21;
    	let span21;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			span0 = element("span");
    			span0.textContent = "Dashboard";
    			t2 = space();
    			li1 = element("li");
    			a1 = element("a");
    			span1 = element("span");
    			span1.textContent = "AWS";
    			t4 = space();
    			li2 = element("li");
    			a2 = element("a");
    			span2 = element("span");
    			span2.textContent = "Cryptocurrency";
    			t6 = space();
    			li3 = element("li");
    			a3 = element("a");
    			span3 = element("span");
    			span3.textContent = "Dev";
    			t8 = space();
    			li4 = element("li");
    			a4 = element("a");
    			span4 = element("span");
    			span4.textContent = "E-Commerce";
    			t10 = space();
    			li5 = element("li");
    			a5 = element("a");
    			span5 = element("span");
    			span5.textContent = "Email";
    			t12 = space();
    			li6 = element("li");
    			a6 = element("a");
    			span6 = element("span");
    			span6.textContent = "Environment";
    			t14 = space();
    			li7 = element("li");
    			a7 = element("a");
    			span7 = element("span");
    			span7.textContent = "Finance";
    			t16 = space();
    			li8 = element("li");
    			a8 = element("a");
    			span8 = element("span");
    			span8.textContent = "Games";
    			t18 = space();
    			li9 = element("li");
    			a9 = element("a");
    			span9 = element("span");
    			span9.textContent = "IoT";
    			t20 = space();
    			li10 = element("li");
    			a10 = element("a");
    			span10 = element("span");
    			span10.textContent = "Lifestyle";
    			t22 = space();
    			li11 = element("li");
    			a11 = element("a");
    			span11 = element("span");
    			span11.textContent = "Music";
    			t24 = space();
    			li12 = element("li");
    			a12 = element("a");
    			span12 = element("span");
    			span12.textContent = "Network";
    			t26 = space();
    			li13 = element("li");
    			a13 = element("a");
    			span13 = element("span");
    			span13.textContent = "Politics";
    			t28 = space();
    			li14 = element("li");
    			a14 = element("a");
    			span14 = element("span");
    			span14.textContent = "Science";
    			t30 = space();
    			li15 = element("li");
    			a15 = element("a");
    			span15 = element("span");
    			span15.textContent = "Sports";
    			t32 = space();
    			li16 = element("li");
    			a16 = element("a");
    			span16 = element("span");
    			span16.textContent = "System";
    			t34 = space();
    			li17 = element("li");
    			a17 = element("a");
    			span17 = element("span");
    			span17.textContent = "Time";
    			t36 = space();
    			li18 = element("li");
    			a18 = element("a");
    			span18 = element("span");
    			span18.textContent = "Tools";
    			t38 = space();
    			li19 = element("li");
    			a19 = element("a");
    			span19 = element("span");
    			span19.textContent = "Travel";
    			t40 = space();
    			li20 = element("li");
    			a20 = element("a");
    			span20 = element("span");
    			span20.textContent = "Weather";
    			t42 = space();
    			li21 = element("li");
    			a21 = element("a");
    			span21 = element("span");
    			span21.textContent = "Web";
    			attr_dev(path, "d", "M20 7.093v-5.093h-3v2.093l3 3zm4 5.907l-12-12-12 12h3v10h7v-5h4v5h7v-10h3zm-5 8h-3v-5h-8v5h-3v-10.26l7-6.912 7 6.99v10.182z");
    			add_location(path, file$4, 5, 20, 382);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "w-7 fill-current");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$4, 4, 18, 253);
    			attr_dev(span0, "class", "text-gray-900");
    			add_location(span0, file$4, 7, 20, 563);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "flex space-x-2 items-center text-gray-600 p-2 bg-gray-200 rounded-lg");
    			add_location(a0, file$4, 3, 16, 145);
    			add_location(li0, file$4, 2, 12, 124);
    			add_location(span1, file$4, 12, 20, 816);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a1, file$4, 11, 16, 680);
    			add_location(li1, file$4, 10, 12, 659);
    			add_location(span2, file$4, 17, 20, 1041);
    			attr_dev(a2, "href", "/");
    			attr_dev(a2, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a2, file$4, 16, 16, 905);
    			add_location(li2, file$4, 15, 12, 884);
    			add_location(span3, file$4, 22, 20, 1277);
    			attr_dev(a3, "href", "/");
    			attr_dev(a3, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a3, file$4, 21, 16, 1141);
    			add_location(li3, file$4, 20, 12, 1120);
    			add_location(span4, file$4, 27, 20, 1502);
    			attr_dev(a4, "href", "/");
    			attr_dev(a4, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a4, file$4, 26, 16, 1366);
    			add_location(li4, file$4, 25, 12, 1345);
    			add_location(span5, file$4, 32, 20, 1734);
    			attr_dev(a5, "href", "/");
    			attr_dev(a5, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a5, file$4, 31, 16, 1598);
    			add_location(li5, file$4, 30, 12, 1577);
    			add_location(span6, file$4, 37, 20, 1961);
    			attr_dev(a6, "href", "/");
    			attr_dev(a6, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a6, file$4, 36, 16, 1825);
    			add_location(li6, file$4, 35, 12, 1804);
    			add_location(span7, file$4, 42, 20, 2194);
    			attr_dev(a7, "href", "/");
    			attr_dev(a7, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a7, file$4, 41, 16, 2058);
    			add_location(li7, file$4, 40, 12, 2037);
    			add_location(span8, file$4, 47, 20, 2423);
    			attr_dev(a8, "href", "/");
    			attr_dev(a8, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a8, file$4, 46, 16, 2287);
    			add_location(li8, file$4, 45, 12, 2266);
    			add_location(span9, file$4, 52, 20, 2650);
    			attr_dev(a9, "href", "/");
    			attr_dev(a9, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a9, file$4, 51, 16, 2514);
    			add_location(li9, file$4, 50, 12, 2493);
    			add_location(span10, file$4, 57, 20, 2875);
    			attr_dev(a10, "href", "/");
    			attr_dev(a10, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a10, file$4, 56, 16, 2739);
    			add_location(li10, file$4, 55, 12, 2718);
    			add_location(span11, file$4, 62, 20, 3106);
    			attr_dev(a11, "href", "/");
    			attr_dev(a11, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a11, file$4, 61, 16, 2970);
    			add_location(li11, file$4, 60, 12, 2949);
    			add_location(span12, file$4, 67, 20, 3333);
    			attr_dev(a12, "href", "/");
    			attr_dev(a12, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a12, file$4, 66, 16, 3197);
    			add_location(li12, file$4, 65, 12, 3176);
    			add_location(span13, file$4, 72, 18, 3560);
    			attr_dev(a13, "href", "/");
    			attr_dev(a13, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a13, file$4, 71, 16, 3426);
    			add_location(li13, file$4, 70, 12, 3405);
    			add_location(span14, file$4, 77, 18, 3788);
    			attr_dev(a14, "href", "/");
    			attr_dev(a14, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a14, file$4, 76, 16, 3654);
    			add_location(li14, file$4, 75, 12, 3633);
    			add_location(span15, file$4, 82, 20, 4017);
    			attr_dev(a15, "href", "/");
    			attr_dev(a15, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a15, file$4, 81, 16, 3881);
    			add_location(li15, file$4, 80, 12, 3860);
    			add_location(span16, file$4, 87, 20, 4245);
    			attr_dev(a16, "href", "/");
    			attr_dev(a16, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a16, file$4, 86, 16, 4109);
    			add_location(li16, file$4, 85, 12, 4088);
    			add_location(span17, file$4, 92, 18, 4471);
    			attr_dev(a17, "href", "/");
    			attr_dev(a17, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a17, file$4, 91, 16, 4337);
    			add_location(li17, file$4, 90, 12, 4316);
    			add_location(span18, file$4, 97, 18, 4695);
    			attr_dev(a18, "href", "/");
    			attr_dev(a18, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a18, file$4, 96, 16, 4561);
    			add_location(li18, file$4, 95, 12, 4540);
    			add_location(span19, file$4, 102, 20, 4922);
    			attr_dev(a19, "href", "/");
    			attr_dev(a19, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a19, file$4, 101, 16, 4786);
    			add_location(li19, file$4, 100, 12, 4765);
    			add_location(span20, file$4, 107, 18, 5148);
    			attr_dev(a20, "href", "/");
    			attr_dev(a20, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a20, file$4, 106, 16, 5014);
    			add_location(li20, file$4, 105, 12, 4993);
    			add_location(span21, file$4, 112, 18, 5375);
    			attr_dev(a21, "href", "/");
    			attr_dev(a21, "class", "flex space-x-2 items-center text-gray-600 p-2 hover:bg-gray-200 rounded-lg hover:text-gray-900");
    			add_location(a21, file$4, 111, 16, 5241);
    			add_location(li21, file$4, 110, 12, 5220);
    			attr_dev(ul, "class", "p-2 space-y-2 flex-1");
    			add_location(ul, file$4, 1, 8, 77);
    			attr_dev(nav, "class", "h-full flex flex-col w-auto border-r border-indigo-600");
    			add_location(nav, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(a0, svg);
    			append_dev(svg, path);
    			append_dev(a0, t0);
    			append_dev(a0, span0);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(a1, span1);
    			append_dev(ul, t4);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(a2, span2);
    			append_dev(ul, t6);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(a3, span3);
    			append_dev(ul, t8);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(a4, span4);
    			append_dev(ul, t10);
    			append_dev(ul, li5);
    			append_dev(li5, a5);
    			append_dev(a5, span5);
    			append_dev(ul, t12);
    			append_dev(ul, li6);
    			append_dev(li6, a6);
    			append_dev(a6, span6);
    			append_dev(ul, t14);
    			append_dev(ul, li7);
    			append_dev(li7, a7);
    			append_dev(a7, span7);
    			append_dev(ul, t16);
    			append_dev(ul, li8);
    			append_dev(li8, a8);
    			append_dev(a8, span8);
    			append_dev(ul, t18);
    			append_dev(ul, li9);
    			append_dev(li9, a9);
    			append_dev(a9, span9);
    			append_dev(ul, t20);
    			append_dev(ul, li10);
    			append_dev(li10, a10);
    			append_dev(a10, span10);
    			append_dev(ul, t22);
    			append_dev(ul, li11);
    			append_dev(li11, a11);
    			append_dev(a11, span11);
    			append_dev(ul, t24);
    			append_dev(ul, li12);
    			append_dev(li12, a12);
    			append_dev(a12, span12);
    			append_dev(ul, t26);
    			append_dev(ul, li13);
    			append_dev(li13, a13);
    			append_dev(a13, span13);
    			append_dev(ul, t28);
    			append_dev(ul, li14);
    			append_dev(li14, a14);
    			append_dev(a14, span14);
    			append_dev(ul, t30);
    			append_dev(ul, li15);
    			append_dev(li15, a15);
    			append_dev(a15, span15);
    			append_dev(ul, t32);
    			append_dev(ul, li16);
    			append_dev(li16, a16);
    			append_dev(a16, span16);
    			append_dev(ul, t34);
    			append_dev(ul, li17);
    			append_dev(li17, a17);
    			append_dev(a17, span17);
    			append_dev(ul, t36);
    			append_dev(ul, li18);
    			append_dev(li18, a18);
    			append_dev(a18, span18);
    			append_dev(ul, t38);
    			append_dev(ul, li19);
    			append_dev(li19, a19);
    			append_dev(a19, span19);
    			append_dev(ul, t40);
    			append_dev(ul, li20);
    			append_dev(li20, a20);
    			append_dev(a20, span20);
    			append_dev(ul, t42);
    			append_dev(ul, li21);
    			append_dev(li21, a21);
    			append_dev(a21, span21);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Sidebar", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Sidebar> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Sidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sidebar",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Top.svelte generated by Svelte v3.38.2 */
    const file$3 = "src/Top.svelte";

    function create_fragment$3(ctx) {
    	let div2;
    	let div1;
    	let a;
    	let svg0;
    	let rect0;
    	let rect1;
    	let rect2;
    	let rect3;
    	let t0;
    	let span;
    	let t2;
    	let img;
    	let img_src_value;
    	let t3;
    	let div0;
    	let button;
    	let svg1;
    	let path0;
    	let path1;
    	let path2;
    	let t4;
    	let div3;
    	let sidebar;
    	let current;
    	let mounted;
    	let dispose;
    	sidebar = new Sidebar({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			a = element("a");
    			svg0 = svg_element("svg");
    			rect0 = svg_element("rect");
    			rect1 = svg_element("rect");
    			rect2 = svg_element("rect");
    			rect3 = svg_element("rect");
    			t0 = space();
    			span = element("span");
    			span.textContent = "Company";
    			t2 = space();
    			img = element("img");
    			t3 = space();
    			div0 = element("div");
    			button = element("button");
    			svg1 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			t4 = space();
    			div3 = element("div");
    			create_component(sidebar.$$.fragment);
    			attr_dev(rect0, "x", "3");
    			attr_dev(rect0, "y", "1");
    			attr_dev(rect0, "width", "7");
    			attr_dev(rect0, "height", "12");
    			add_location(rect0, file$3, 10, 8, 521);
    			attr_dev(rect1, "x", "3");
    			attr_dev(rect1, "y", "17");
    			attr_dev(rect1, "width", "7");
    			attr_dev(rect1, "height", "6");
    			add_location(rect1, file$3, 11, 8, 577);
    			attr_dev(rect2, "x", "14");
    			attr_dev(rect2, "y", "1");
    			attr_dev(rect2, "width", "7");
    			attr_dev(rect2, "height", "6");
    			add_location(rect2, file$3, 12, 8, 633);
    			attr_dev(rect3, "x", "14");
    			attr_dev(rect3, "y", "11");
    			attr_dev(rect3, "width", "7");
    			attr_dev(rect3, "height", "12");
    			add_location(rect3, file$3, 13, 8, 689);
    			attr_dev(svg0, "class", "w-8 text-deep-purple-accent-400");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke-linejoin", "round");
    			attr_dev(svg0, "stroke-width", "2");
    			attr_dev(svg0, "stroke-linecap", "round");
    			attr_dev(svg0, "stroke-miterlimit", "10");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "fill", "none");
    			add_location(svg0, file$3, 9, 6, 326);
    			attr_dev(span, "class", "ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase mr-15");
    			add_location(span, file$3, 15, 6, 758);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "aria-label", "Company");
    			attr_dev(a, "title", "Company");
    			attr_dev(a, "class", "inline-flex items-center");
    			add_location(a, file$3, 8, 4, 237);
    			attr_dev(img, "class", "h-8 w-8 rounded-full object-center");
    			if (img.src !== (img_src_value = "https://avatars.githubusercontent.com/u/101659?v=4")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Mat");
    			add_location(img, file$3, 17, 4, 867);
    			attr_dev(path0, "fill", "currentColor");
    			attr_dev(path0, "d", "M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z");
    			add_location(path0, file$3, 22, 10, 1346);
    			attr_dev(path1, "fill", "currentColor");
    			attr_dev(path1, "d", "M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z");
    			add_location(path1, file$3, 23, 10, 1464);
    			attr_dev(path2, "fill", "currentColor");
    			attr_dev(path2, "d", "M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z");
    			add_location(path2, file$3, 24, 10, 1578);
    			attr_dev(svg1, "class", "w-5 text-gray-600");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			add_location(svg1, file$3, 21, 8, 1284);
    			attr_dev(button, "aria-label", "Open Menu");
    			attr_dev(button, "title", "Open Menu");
    			attr_dev(button, "class", "p-2 -mr-1 transition duration-200 rounded focus:outline-none focus:shadow-outline hover:bg-deep-purple-50 focus:bg-deep-purple-50");
    			add_location(button, file$3, 20, 6, 1088);
    			attr_dev(div0, "class", "lg:hidden svelte-15aw435");
    			toggle_class(div0, "active", /*active*/ ctx[0]);
    			add_location(div0, file$3, 19, 4, 1012);
    			attr_dev(div1, "class", "relative flex items-center justify-between");
    			add_location(div1, file$3, 7, 2, 176);
    			attr_dev(div2, "class", "px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-full md:px-24 lg:px-8");
    			add_location(div2, file$3, 6, 0, 85);
    			attr_dev(div3, "class", "side-bar items-stretch md:items-center svelte-15aw435");
    			toggle_class(div3, "active", /*active*/ ctx[0]);
    			add_location(div3, file$3, 31, 2, 1747);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, a);
    			append_dev(a, svg0);
    			append_dev(svg0, rect0);
    			append_dev(svg0, rect1);
    			append_dev(svg0, rect2);
    			append_dev(svg0, rect3);
    			append_dev(a, t0);
    			append_dev(a, span);
    			append_dev(div1, t2);
    			append_dev(div1, img);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, svg1);
    			append_dev(svg1, path0);
    			append_dev(svg1, path1);
    			append_dev(svg1, path2);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div3, anchor);
    			mount_component(sidebar, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*active*/ 1) {
    				toggle_class(div0, "active", /*active*/ ctx[0]);
    			}

    			if (dirty & /*active*/ 1) {
    				toggle_class(div3, "active", /*active*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div3);
    			destroy_component(sidebar);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Top", slots, []);
    	let active = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Top> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, active = !active);
    	$$self.$capture_state = () => ({ active, Sidebar });

    	$$self.$inject_state = $$props => {
    		if ("active" in $$props) $$invalidate(0, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [active, click_handler];
    }

    class Top extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Top",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Main.svelte generated by Svelte v3.38.2 */
    const file$2 = "src/Main.svelte";

    function create_fragment$2(ctx) {
    	let div48;
    	let div0;
    	let sidebar;
    	let t0;
    	let div47;
    	let div1;
    	let h1;
    	let t2;
    	let div10;
    	let div6;
    	let div2;
    	let h20;
    	let t3;
    	let br0;
    	let t4;
    	let span0;
    	let t6;
    	let p0;
    	let t8;
    	let div3;
    	let a0;
    	let t10;
    	let div4;
    	let h21;
    	let t11;
    	let br1;
    	let t12;
    	let span1;
    	let t14;
    	let p1;
    	let t16;
    	let div5;
    	let a1;
    	let t18;
    	let div9;
    	let div7;
    	let img0;
    	let img0_src_value;
    	let t19;
    	let img1;
    	let img1_src_value;
    	let t20;
    	let div8;
    	let img2;
    	let img2_src_value;
    	let t21;
    	let div46;
    	let div45;
    	let div20;
    	let div18;
    	let div11;
    	let t23;
    	let div13;
    	let div12;
    	let t25;
    	let div17;
    	let div14;
    	let t27;
    	let div15;
    	let t29;
    	let div16;
    	let t31;
    	let div19;
    	let a2;
    	let t33;
    	let p2;
    	let t35;
    	let div33;
    	let div22;
    	let div21;
    	let t37;
    	let div31;
    	let div23;
    	let t39;
    	let div26;
    	let div24;
    	let t41;
    	let div25;
    	let t43;
    	let div30;
    	let div27;
    	let t45;
    	let div28;
    	let t47;
    	let div29;
    	let t49;
    	let div32;
    	let a3;
    	let t51;
    	let p3;
    	let t53;
    	let div44;
    	let div42;
    	let div34;
    	let t55;
    	let div37;
    	let div35;
    	let t57;
    	let div36;
    	let t59;
    	let div41;
    	let div38;
    	let t61;
    	let div39;
    	let t63;
    	let div40;
    	let t65;
    	let div43;
    	let a4;
    	let t67;
    	let p4;
    	let current;
    	sidebar = new Sidebar({ $$inline: true });

    	const block = {
    		c: function create() {
    			div48 = element("div");
    			div0 = element("div");
    			create_component(sidebar.$$.fragment);
    			t0 = space();
    			div47 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Put anything in your macOS menu bar";
    			t2 = space();
    			div10 = element("div");
    			div6 = element("div");
    			div2 = element("div");
    			h20 = element("h2");
    			t3 = text("Let us handle");
    			br0 = element("br");
    			t4 = text("\n            your next\n            ");
    			span0 = element("span");
    			span0.textContent = "destination";
    			t6 = space();
    			p0 = element("p");
    			p0.textContent = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae. explicabo.";
    			t8 = space();
    			div3 = element("div");
    			a0 = element("a");
    			a0.textContent = "Learn more";
    			t10 = space();
    			div4 = element("div");
    			h21 = element("h2");
    			t11 = text("Let us handle");
    			br1 = element("br");
    			t12 = text("\n            your next\n            ");
    			span1 = element("span");
    			span1.textContent = "destination";
    			t14 = space();
    			p1 = element("p");
    			p1.textContent = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae. explicabo.";
    			t16 = space();
    			div5 = element("div");
    			a1 = element("a");
    			a1.textContent = "Learn more";
    			t18 = space();
    			div9 = element("div");
    			div7 = element("div");
    			img0 = element("img");
    			t19 = space();
    			img1 = element("img");
    			t20 = space();
    			div8 = element("div");
    			img2 = element("img");
    			t21 = space();
    			div46 = element("div");
    			div45 = element("div");
    			div20 = element("div");
    			div18 = element("div");
    			div11 = element("div");
    			div11.textContent = "Start";
    			t23 = space();
    			div13 = element("div");
    			div12 = element("div");
    			div12.textContent = "Free";
    			t25 = space();
    			div17 = element("div");
    			div14 = element("div");
    			div14.textContent = "10 deploys per day";
    			t27 = space();
    			div15 = element("div");
    			div15.textContent = "10 GB of storage";
    			t29 = space();
    			div16 = element("div");
    			div16.textContent = "20 domains";
    			t31 = space();
    			div19 = element("div");
    			a2 = element("a");
    			a2.textContent = "Start for free";
    			t33 = space();
    			p2 = element("p");
    			p2.textContent = "Sed ut unde omnis iste natus accusantium doloremque.";
    			t35 = space();
    			div33 = element("div");
    			div22 = element("div");
    			div21 = element("div");
    			div21.textContent = "Most Popular";
    			t37 = space();
    			div31 = element("div");
    			div23 = element("div");
    			div23.textContent = "Pro";
    			t39 = space();
    			div26 = element("div");
    			div24 = element("div");
    			div24.textContent = "$38";
    			t41 = space();
    			div25 = element("div");
    			div25.textContent = "/ mo";
    			t43 = space();
    			div30 = element("div");
    			div27 = element("div");
    			div27.textContent = "200 deploys per day";
    			t45 = space();
    			div28 = element("div");
    			div28.textContent = "80 GB of storage";
    			t47 = space();
    			div29 = element("div");
    			div29.textContent = "Global CDN";
    			t49 = space();
    			div32 = element("div");
    			a3 = element("a");
    			a3.textContent = "Buy Pro";
    			t51 = space();
    			p3 = element("p");
    			p3.textContent = "Sed ut unde omnis iste natus accusantium doloremque.";
    			t53 = space();
    			div44 = element("div");
    			div42 = element("div");
    			div34 = element("div");
    			div34.textContent = "Business";
    			t55 = space();
    			div37 = element("div");
    			div35 = element("div");
    			div35.textContent = "$78";
    			t57 = space();
    			div36 = element("div");
    			div36.textContent = "/ mo";
    			t59 = space();
    			div41 = element("div");
    			div38 = element("div");
    			div38.textContent = "500 GB of storage";
    			t61 = space();
    			div39 = element("div");
    			div39.textContent = "Unlimited domains";
    			t63 = space();
    			div40 = element("div");
    			div40.textContent = "24/7 Support";
    			t65 = space();
    			div43 = element("div");
    			a4 = element("a");
    			a4.textContent = "Buy Business";
    			t67 = space();
    			p4 = element("p");
    			p4.textContent = "Sed ut unde omnis iste natus accusantium doloremque.";
    			attr_dev(div0, "class", "row-span-2 lg:block hidden w-64");
    			add_location(div0, file$2, 7, 2, 86);
    			attr_dev(h1, "class", "font-sans text-5xl font-bold");
    			add_location(h1, file$2, 12, 4, 354);
    			attr_dev(div1, "class", "max-w-xl md:mx-auto sm:text-center items-start lg:max-w-2xl mb-20  -mt-9");
    			add_location(div1, file$2, 11, 2, 263);
    			attr_dev(br0, "class", "hidden md:block");
    			add_location(br0, file$2, 18, 25, 751);
    			attr_dev(span0, "class", "inline-block text-deep-purple-accent-400");
    			add_location(span0, file$2, 20, 12, 816);
    			attr_dev(h20, "class", "max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none");
    			add_location(h20, file$2, 17, 10, 613);
    			attr_dev(p0, "class", "text-base text-gray-700 md:text-lg");
    			add_location(p0, file$2, 22, 10, 916);
    			attr_dev(div2, "class", "max-w-xl mb-6");
    			add_location(div2, file$2, 16, 8, 575);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "aria-label", "");
    			attr_dev(a0, "class", "inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800");
    			add_location(a0, file$2, 27, 10, 1187);
    			attr_dev(div3, "class", "mb-8");
    			add_location(div3, file$2, 26, 8, 1158);
    			attr_dev(br1, "class", "hidden md:block");
    			add_location(br1, file$2, 33, 25, 1584);
    			attr_dev(span1, "class", "inline-block text-deep-purple-accent-400");
    			add_location(span1, file$2, 35, 12, 1649);
    			attr_dev(h21, "class", "max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none");
    			add_location(h21, file$2, 32, 10, 1446);
    			attr_dev(p1, "class", "text-base text-gray-700 md:text-lg");
    			add_location(p1, file$2, 37, 10, 1749);
    			attr_dev(div4, "class", "max-w-xl mb-6");
    			add_location(div4, file$2, 31, 8, 1408);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "aria-label", "");
    			attr_dev(a1, "class", "inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800");
    			add_location(a1, file$2, 42, 10, 2007);
    			add_location(div5, file$2, 41, 8, 1991);
    			attr_dev(div6, "class", "flex flex-col justify-center md:pr-8 xl:pr-0 lg:max-w-lg");
    			add_location(div6, file$2, 15, 6, 496);
    			attr_dev(img0, "class", "object-cover mb-6 rounded shadow-lg h-28 sm:h-48 xl:h-56 w-28 sm:w-48 xl:w-56");
    			if (img0.src !== (img0_src_value = "./img/xbar-menu-preview.png?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			add_location(img0, file$2, 49, 10, 2361);
    			attr_dev(img1, "class", "object-cover w-20 h-20 rounded shadow-lg sm:h-32 xl:h-40 sm:w-32 xl:w-40");
    			if (img1.src !== (img1_src_value = "./img/xbar-website-preview.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			add_location(img1, file$2, 54, 10, 2613);
    			attr_dev(div7, "class", "flex flex-col items-end px-3");
    			add_location(div7, file$2, 48, 8, 2308);
    			attr_dev(img2, "class", "object-cover w-40 h-40 rounded shadow-lg sm:h-64 xl:h-80 sm:w-64 xl:w-80");
    			if (img2.src !== (img2_src_value = "./img/xbar-menu-preview.png?auto=compress&cs=tinysrgb&dpr=2&w=500")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "");
    			add_location(img2, file$2, 58, 10, 2870);
    			attr_dev(div8, "class", "px-3");
    			add_location(div8, file$2, 57, 8, 2841);
    			attr_dev(div9, "class", "flex items-center justify-center -mx-4 lg:pl-8");
    			add_location(div9, file$2, 47, 6, 2239);
    			attr_dev(div10, "class", "grid gap-10 lg:grid-cols-2");
    			add_location(div10, file$2, 14, 4, 449);
    			attr_dev(div11, "class", "text-lg font-semibold");
    			add_location(div11, file$2, 67, 10, 3523);
    			attr_dev(div12, "class", "mr-1 text-5xl font-bold");
    			add_location(div12, file$2, 69, 12, 3644);
    			attr_dev(div13, "class", "flex items-center justify-center mt-2");
    			add_location(div13, file$2, 68, 10, 3580);
    			attr_dev(div14, "class", "text-gray-700");
    			add_location(div14, file$2, 72, 12, 3760);
    			attr_dev(div15, "class", "text-gray-700");
    			add_location(div15, file$2, 73, 12, 3824);
    			attr_dev(div16, "class", "text-gray-700");
    			add_location(div16, file$2, 74, 12, 3886);
    			attr_dev(div17, "class", "mt-2 space-y-3");
    			add_location(div17, file$2, 71, 10, 3719);
    			attr_dev(div18, "class", "text-center");
    			add_location(div18, file$2, 66, 8, 3487);
    			attr_dev(a2, "href", "/");
    			attr_dev(a2, "class", "inline-flex items-center justify-center w-full h-12 px-6 mt-6 font-medium \n             tracking-wide text-white transition duration-200 bg-gray-400 rounded shadow-md \n             hover:bg-gray-900 focus:shadow-outline focus:outline-none");
    			add_location(a2, file$2, 78, 10, 3986);
    			attr_dev(p2, "class", "max-w-xs mt-6 text-xs text-gray-600 sm:text-sm sm:text-center sm:max-w-sm sm:mx-auto");
    			add_location(p2, file$2, 84, 10, 4311);
    			add_location(div19, file$2, 77, 8, 3970);
    			attr_dev(div20, "class", "flex flex-col justify-between p-8 transition-shadow duration-300 bg-white border rounded shadow-sm sm:items-center hover:shadow");
    			add_location(div20, file$2, 65, 6, 3337);
    			attr_dev(div21, "class", "inline-block px-3 py-1 text-xs font-medium tracking-wider text-white uppercase rounded bg-purple-400");
    			add_location(div21, file$2, 91, 10, 4774);
    			attr_dev(div22, "class", "absolute inset-x-0 top-0 flex justify-center -mt-3");
    			add_location(div22, file$2, 90, 8, 4699);
    			attr_dev(div23, "class", "text-lg font-semibold");
    			add_location(div23, file$2, 96, 10, 4990);
    			attr_dev(div24, "class", "mr-1 text-5xl font-bold");
    			add_location(div24, file$2, 98, 12, 5109);
    			attr_dev(div25, "class", "text-gray-700");
    			add_location(div25, file$2, 99, 12, 5168);
    			attr_dev(div26, "class", "flex items-center justify-center mt-2");
    			add_location(div26, file$2, 97, 10, 5045);
    			attr_dev(div27, "class", "text-gray-700");
    			add_location(div27, file$2, 102, 12, 5274);
    			attr_dev(div28, "class", "text-gray-700");
    			add_location(div28, file$2, 103, 12, 5339);
    			attr_dev(div29, "class", "text-gray-700");
    			add_location(div29, file$2, 104, 12, 5401);
    			attr_dev(div30, "class", "mt-2 space-y-3");
    			add_location(div30, file$2, 101, 10, 5233);
    			attr_dev(div31, "class", "text-center");
    			add_location(div31, file$2, 95, 8, 4954);
    			attr_dev(a3, "href", "/");
    			attr_dev(a3, "class", "inline-flex items-center justify-center w-full h-12 px-6 mt-6 font-medium \n            tracking-wide text-white transition duration-200 rounded shadow-md bg-purple-400 \n            hover:bg-purple-700 focus:shadow-outline focus:outline-none");
    			add_location(a3, file$2, 108, 10, 5501);
    			attr_dev(p3, "class", "max-w-xs mt-6 text-xs text-gray-600 sm:text-sm sm:text-center sm:max-w-sm sm:mx-auto");
    			add_location(p3, file$2, 115, 10, 5832);
    			add_location(div32, file$2, 107, 8, 5485);
    			attr_dev(div33, "class", "relative flex flex-col justify-between p-8 transition-shadow duration-300 bg-white border rounded shadow-sm sm:items-center hover:shadow border-purple-400");
    			add_location(div33, file$2, 89, 6, 4522);
    			attr_dev(div34, "class", "text-lg font-semibold");
    			add_location(div34, file$2, 122, 10, 6229);
    			attr_dev(div35, "class", "mr-1 text-5xl font-bold");
    			add_location(div35, file$2, 124, 12, 6353);
    			attr_dev(div36, "class", "text-gray-700");
    			add_location(div36, file$2, 125, 12, 6412);
    			attr_dev(div37, "class", "flex items-center justify-center mt-2");
    			add_location(div37, file$2, 123, 10, 6289);
    			attr_dev(div38, "class", "text-gray-700");
    			add_location(div38, file$2, 128, 12, 6518);
    			attr_dev(div39, "class", "text-gray-700");
    			add_location(div39, file$2, 129, 12, 6581);
    			attr_dev(div40, "class", "text-gray-700");
    			add_location(div40, file$2, 130, 12, 6644);
    			attr_dev(div41, "class", "mt-2 space-y-3");
    			add_location(div41, file$2, 127, 10, 6477);
    			attr_dev(div42, "class", "text-center");
    			add_location(div42, file$2, 121, 8, 6193);
    			attr_dev(a4, "href", "/");
    			attr_dev(a4, "class", "inline-flex items-center justify-center w-full h-12 px-6 mt-6 font-medium \n            tracking-wide text-white transition duration-200 bg-gray-400 rounded shadow-md \n            hover:bg-gray-900 focus:shadow-outline focus:outline-none");
    			add_location(a4, file$2, 134, 10, 6746);
    			attr_dev(p4, "class", "max-w-xs mt-6 text-xs text-gray-600 sm:text-sm sm:text-center sm:max-w-sm sm:mx-auto");
    			add_location(p4, file$2, 141, 10, 7078);
    			add_location(div43, file$2, 133, 8, 6730);
    			attr_dev(div44, "class", "flex flex-col justify-between p-8 transition-shadow duration-300 bg-white border rounded shadow-sm sm:items-center hover:shadow");
    			add_location(div44, file$2, 120, 6, 6043);
    			attr_dev(div45, "class", "grid max-w-md gap-10 row-gap-5 lg:max-w-screen-lg sm:row-gap-10 lg:grid-cols-3 xl:max-w-screen-lg sm:mx-auto");
    			add_location(div45, file$2, 64, 4, 3208);
    			attr_dev(div46, "class", "px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20");
    			add_location(div46, file$2, 63, 0, 3100);
    			attr_dev(div47, "class", "px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20");
    			add_location(div47, file$2, 10, 2, 157);
    			attr_dev(div48, "class", "flex ");
    			add_location(div48, file$2, 6, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div48, anchor);
    			append_dev(div48, div0);
    			mount_component(sidebar, div0, null);
    			append_dev(div48, t0);
    			append_dev(div48, div47);
    			append_dev(div47, div1);
    			append_dev(div1, h1);
    			append_dev(div47, t2);
    			append_dev(div47, div10);
    			append_dev(div10, div6);
    			append_dev(div6, div2);
    			append_dev(div2, h20);
    			append_dev(h20, t3);
    			append_dev(h20, br0);
    			append_dev(h20, t4);
    			append_dev(h20, span0);
    			append_dev(div2, t6);
    			append_dev(div2, p0);
    			append_dev(div6, t8);
    			append_dev(div6, div3);
    			append_dev(div3, a0);
    			append_dev(div6, t10);
    			append_dev(div6, div4);
    			append_dev(div4, h21);
    			append_dev(h21, t11);
    			append_dev(h21, br1);
    			append_dev(h21, t12);
    			append_dev(h21, span1);
    			append_dev(div4, t14);
    			append_dev(div4, p1);
    			append_dev(div6, t16);
    			append_dev(div6, div5);
    			append_dev(div5, a1);
    			append_dev(div10, t18);
    			append_dev(div10, div9);
    			append_dev(div9, div7);
    			append_dev(div7, img0);
    			append_dev(div7, t19);
    			append_dev(div7, img1);
    			append_dev(div9, t20);
    			append_dev(div9, div8);
    			append_dev(div8, img2);
    			append_dev(div47, t21);
    			append_dev(div47, div46);
    			append_dev(div46, div45);
    			append_dev(div45, div20);
    			append_dev(div20, div18);
    			append_dev(div18, div11);
    			append_dev(div18, t23);
    			append_dev(div18, div13);
    			append_dev(div13, div12);
    			append_dev(div18, t25);
    			append_dev(div18, div17);
    			append_dev(div17, div14);
    			append_dev(div17, t27);
    			append_dev(div17, div15);
    			append_dev(div17, t29);
    			append_dev(div17, div16);
    			append_dev(div20, t31);
    			append_dev(div20, div19);
    			append_dev(div19, a2);
    			append_dev(div19, t33);
    			append_dev(div19, p2);
    			append_dev(div45, t35);
    			append_dev(div45, div33);
    			append_dev(div33, div22);
    			append_dev(div22, div21);
    			append_dev(div33, t37);
    			append_dev(div33, div31);
    			append_dev(div31, div23);
    			append_dev(div31, t39);
    			append_dev(div31, div26);
    			append_dev(div26, div24);
    			append_dev(div26, t41);
    			append_dev(div26, div25);
    			append_dev(div31, t43);
    			append_dev(div31, div30);
    			append_dev(div30, div27);
    			append_dev(div30, t45);
    			append_dev(div30, div28);
    			append_dev(div30, t47);
    			append_dev(div30, div29);
    			append_dev(div33, t49);
    			append_dev(div33, div32);
    			append_dev(div32, a3);
    			append_dev(div32, t51);
    			append_dev(div32, p3);
    			append_dev(div45, t53);
    			append_dev(div45, div44);
    			append_dev(div44, div42);
    			append_dev(div42, div34);
    			append_dev(div42, t55);
    			append_dev(div42, div37);
    			append_dev(div37, div35);
    			append_dev(div37, t57);
    			append_dev(div37, div36);
    			append_dev(div42, t59);
    			append_dev(div42, div41);
    			append_dev(div41, div38);
    			append_dev(div41, t61);
    			append_dev(div41, div39);
    			append_dev(div41, t63);
    			append_dev(div41, div40);
    			append_dev(div44, t65);
    			append_dev(div44, div43);
    			append_dev(div43, a4);
    			append_dev(div43, t67);
    			append_dev(div43, p4);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div48);
    			destroy_component(sidebar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Main", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Sidebar });
    	return [];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.38.2 */

    const file$1 = "src/Footer.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let p;
    	let t1;
    	let ul;
    	let li0;
    	let a0;
    	let t3;
    	let li1;
    	let a1;
    	let t5;
    	let li2;
    	let a2;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p = element("p");
    			p.textContent = "© Copyright 2021 Lorem Inc. All rights reserved.";
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "F.A.Q";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Privacy Policy";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Terms & Conditions";
    			attr_dev(p, "class", "text-sm text-gray-600");
    			add_location(p, file$1, 2, 4, 185);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400");
    			add_location(a0, file$1, 7, 8, 394);
    			add_location(li0, file$1, 6, 6, 381);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "class", "text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400");
    			add_location(a1, file$1, 10, 8, 542);
    			add_location(li1, file$1, 9, 6, 529);
    			attr_dev(a2, "href", "/");
    			attr_dev(a2, "class", "text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400");
    			add_location(a2, file$1, 13, 8, 699);
    			add_location(li2, file$1, 12, 6, 686);
    			attr_dev(ul, "class", "flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row");
    			add_location(ul, file$1, 5, 4, 287);
    			attr_dev(div0, "class", "flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row");
    			add_location(div0, file$1, 1, 2, 97);
    			attr_dev(div1, "class", "px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8");
    			add_location(div1, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(div0, t1);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.38.2 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div;
    	let top;
    	let t0;
    	let main;
    	let t1;
    	let footer;
    	let current;
    	top = new Top({ $$inline: true });
    	main = new Main({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(top.$$.fragment);
    			t0 = space();
    			create_component(main.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div, "class", "container mx-auto bg-gradient-to-r from-purple-100 via-purple-300 to-purple-100");
    			add_location(div, file, 187424, 2, 4413414);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(top, div, null);
    			append_dev(div, t0);
    			mount_component(main, div, null);
    			append_dev(div, t1);
    			mount_component(footer, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(top.$$.fragment, local);
    			transition_in(main.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(top.$$.fragment, local);
    			transition_out(main.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(top);
    			destroy_component(main);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Top, Main, Footer });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
