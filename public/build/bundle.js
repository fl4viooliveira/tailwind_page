
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
    	let button0;
    	let svg1;
    	let path0;
    	let path1;
    	let path2;
    	let t4;
    	let button1;
    	let svg2;
    	let path3;
    	let t5;
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
    			button0 = element("button");
    			svg1 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			t4 = space();
    			button1 = element("button");
    			svg2 = svg_element("svg");
    			path3 = svg_element("path");
    			t5 = space();
    			div3 = element("div");
    			create_component(sidebar.$$.fragment);
    			attr_dev(rect0, "x", "3");
    			attr_dev(rect0, "y", "1");
    			attr_dev(rect0, "width", "7");
    			attr_dev(rect0, "height", "12");
    			add_location(rect0, file$3, 9, 8, 520);
    			attr_dev(rect1, "x", "3");
    			attr_dev(rect1, "y", "17");
    			attr_dev(rect1, "width", "7");
    			attr_dev(rect1, "height", "6");
    			add_location(rect1, file$3, 10, 8, 576);
    			attr_dev(rect2, "x", "14");
    			attr_dev(rect2, "y", "1");
    			attr_dev(rect2, "width", "7");
    			attr_dev(rect2, "height", "6");
    			add_location(rect2, file$3, 11, 8, 632);
    			attr_dev(rect3, "x", "14");
    			attr_dev(rect3, "y", "11");
    			attr_dev(rect3, "width", "7");
    			attr_dev(rect3, "height", "12");
    			add_location(rect3, file$3, 12, 8, 688);
    			attr_dev(svg0, "class", "w-8 text-deep-purple-accent-400");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke-linejoin", "round");
    			attr_dev(svg0, "stroke-width", "2");
    			attr_dev(svg0, "stroke-linecap", "round");
    			attr_dev(svg0, "stroke-miterlimit", "10");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "fill", "none");
    			add_location(svg0, file$3, 8, 6, 325);
    			attr_dev(span, "class", "ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase mr-15");
    			add_location(span, file$3, 14, 6, 757);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "aria-label", "Company");
    			attr_dev(a, "title", "Company");
    			attr_dev(a, "class", "inline-flex items-center");
    			add_location(a, file$3, 7, 4, 236);
    			attr_dev(img, "class", "object-center w-12 h-12 mx-5 rounded-full");
    			if (img.src !== (img_src_value = "https://avatars.githubusercontent.com/u/101659?v=4")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Mat");
    			add_location(img, file$3, 16, 4, 866);
    			attr_dev(path0, "fill", "currentColor");
    			attr_dev(path0, "d", "M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z");
    			add_location(path0, file$3, 21, 10, 1316);
    			attr_dev(path1, "fill", "currentColor");
    			attr_dev(path1, "d", "M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z");
    			add_location(path1, file$3, 22, 10, 1434);
    			attr_dev(path2, "fill", "currentColor");
    			attr_dev(path2, "d", "M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z");
    			add_location(path2, file$3, 23, 10, 1548);
    			attr_dev(svg1, "class", "w-5 text-gray-600");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			add_location(svg1, file$3, 20, 8, 1254);
    			attr_dev(button0, "id", "open");
    			attr_dev(button0, "class", "p-2 -mr-1 rounded transition duration-200 focus:outline-none focus:shadow-outline hover:bg-purple-50 focus:bg-deep-purple-50 svelte-8hp1mx");
    			add_location(button0, file$3, 19, 6, 1094);
    			attr_dev(path3, "fill", "currentColor");
    			attr_dev(path3, "d", "M19.7,4.3c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l6.3,6.3l-6.3,6.3 \n            c-0.4,0.4-0.4,1,0,1.4C4.5,19.9,4.7,20,5,20s0.5-0.1,0.7-0.3l6.3-6.3l6.3,6.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 \n            c0.4-0.4,0.4-1,0-1.4L13.4,12l6.3-6.3C20.1,5.3,20.1,4.7,19.7,4.3z");
    			add_location(path3, file$3, 28, 10, 1910);
    			attr_dev(svg2, "class", "w-5 text-gray-600");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			add_location(svg2, file$3, 27, 8, 1848);
    			attr_dev(button1, "id", "close");
    			attr_dev(button1, "class", "p-2 -mr-1 rounded transition duration-200 hover:bg-purple-50 focus:bg-gray-200 focus:outline-none focus:shadow-outline svelte-8hp1mx");
    			add_location(button1, file$3, 26, 6, 1693);
    			attr_dev(div0, "class", "lg:hidden svelte-8hp1mx");
    			toggle_class(div0, "active", /*active*/ ctx[0]);
    			add_location(div0, file$3, 18, 4, 1018);
    			attr_dev(div1, "class", "relative flex items-center justify-between");
    			add_location(div1, file$3, 6, 2, 175);
    			attr_dev(div2, "class", "px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-full md:px-24 lg:px-8");
    			add_location(div2, file$3, 5, 0, 84);
    			attr_dev(div3, "class", "items-stretch side-bar md:items-center svelte-8hp1mx");
    			toggle_class(div3, "active", /*active*/ ctx[0]);
    			add_location(div3, file$3, 38, 0, 2333);
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
    			append_dev(div0, button0);
    			append_dev(button0, svg1);
    			append_dev(svg1, path0);
    			append_dev(svg1, path1);
    			append_dev(svg1, path2);
    			append_dev(div0, t4);
    			append_dev(div0, button1);
    			append_dev(button1, svg2);
    			append_dev(svg2, path3);
    			insert_dev(target, t5, anchor);
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
    			if (detaching) detach_dev(t5);
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
    	let div16;
    	let div0;
    	let sidebar;
    	let t0;
    	let div15;
    	let h1;
    	let t2;
    	let div6;
    	let div1;
    	let ul;
    	let li0;
    	let h20;
    	let t4;
    	let li1;
    	let h21;
    	let t6;
    	let li2;
    	let h22;
    	let t8;
    	let div5;
    	let div4;
    	let div2;
    	let img0;
    	let img0_src_value;
    	let t9;
    	let img1;
    	let img1_src_value;
    	let t10;
    	let div3;
    	let img2;
    	let img2_src_value;
    	let t11;
    	let div14;
    	let div13;
    	let div8;
    	let img3;
    	let img3_src_value;
    	let t12;
    	let div7;
    	let p0;
    	let a0;
    	let t14;
    	let span0;
    	let t16;
    	let a1;
    	let t18;
    	let p1;
    	let t20;
    	let a2;
    	let t22;
    	let div10;
    	let img4;
    	let img4_src_value;
    	let t23;
    	let div9;
    	let p2;
    	let a3;
    	let t25;
    	let span1;
    	let t27;
    	let a4;
    	let t29;
    	let p3;
    	let t31;
    	let a5;
    	let t33;
    	let div12;
    	let img5;
    	let img5_src_value;
    	let t34;
    	let div11;
    	let p4;
    	let a6;
    	let t36;
    	let span2;
    	let t38;
    	let a7;
    	let t40;
    	let p5;
    	let t42;
    	let a8;
    	let current;
    	sidebar = new Sidebar({ $$inline: true });

    	const block = {
    		c: function create() {
    			div16 = element("div");
    			div0 = element("div");
    			create_component(sidebar.$$.fragment);
    			t0 = space();
    			div15 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Put anything in your macOS menu bar";
    			t2 = space();
    			div6 = element("div");
    			div1 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			h20 = element("h2");
    			h20.textContent = "Hundreds of pre-built plugins to choose from";
    			t4 = space();
    			li1 = element("li");
    			h21 = element("h2");
    			h21.textContent = "Information you care about, at a glance";
    			t6 = space();
    			li2 = element("li");
    			h22 = element("h2");
    			h22.textContent = "Write your own plugins—in any language";
    			t8 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			img0 = element("img");
    			t9 = space();
    			img1 = element("img");
    			t10 = space();
    			div3 = element("div");
    			img2 = element("img");
    			t11 = space();
    			div14 = element("div");
    			div13 = element("div");
    			div8 = element("div");
    			img3 = element("img");
    			t12 = space();
    			div7 = element("div");
    			p0 = element("p");
    			a0 = element("a");
    			a0.textContent = "Dev";
    			t14 = space();
    			span0 = element("span");
    			span0.textContent = "— 28 Dec 2020";
    			t16 = space();
    			a1 = element("a");
    			a1.textContent = "Brew Services";
    			t18 = space();
    			p1 = element("p");
    			p1.textContent = "Sed ut perspiciatis unde omnis iste natus error sit sed quia consequuntur magni voluptatem doloremque.";
    			t20 = space();
    			a2 = element("a");
    			a2.textContent = "Learn more";
    			t22 = space();
    			div10 = element("div");
    			img4 = element("img");
    			t23 = space();
    			div9 = element("div");
    			p2 = element("p");
    			a3 = element("a");
    			a3.textContent = "e-commerce";
    			t25 = space();
    			span1 = element("span");
    			span1.textContent = "— 28 Dec 2020";
    			t27 = space();
    			a4 = element("a");
    			a4.textContent = "Shopibar";
    			t29 = space();
    			p3 = element("p");
    			p3.textContent = "Sed ut perspiciatis unde omnis iste natus error sit sed quia consequuntur magni voluptatem doloremque.";
    			t31 = space();
    			a5 = element("a");
    			a5.textContent = "Learn more";
    			t33 = space();
    			div12 = element("div");
    			img5 = element("img");
    			t34 = space();
    			div11 = element("div");
    			p4 = element("p");
    			a6 = element("a");
    			a6.textContent = "science";
    			t36 = space();
    			span2 = element("span");
    			span2.textContent = "— 28 Dec 2020";
    			t38 = space();
    			a7 = element("a");
    			a7.textContent = "People In Space";
    			t40 = space();
    			p5 = element("p");
    			p5.textContent = "Sed ut perspiciatis unde omnis iste natus error sit sed quia consequuntur magni voluptatem doloremque.";
    			t42 = space();
    			a8 = element("a");
    			a8.textContent = "Learn more";
    			attr_dev(div0, "class", "hidden w-64 lg:block");
    			add_location(div0, file$2, 7, 2, 94);
    			attr_dev(h1, "class", "mx-auto text-3xl font-bold text-center font-Poppins leading-9 sm:text-5xl ");
    			add_location(h1, file$2, 11, 4, 196);
    			attr_dev(h20, "class", "motion-safe:hover:scale-110");
    			add_location(h20, file$2, 18, 12, 621);
    			attr_dev(li0, "class", "items-center p-6 m-8 bg-white rounded-lg shadow-purple");
    			add_location(li0, file$2, 17, 10, 541);
    			add_location(h21, file$2, 21, 12, 819);
    			attr_dev(li1, "class", "items-center p-6 m-8 bg-white rounded-lg shadow-purple");
    			add_location(li1, file$2, 20, 10, 739);
    			add_location(h22, file$2, 24, 12, 976);
    			attr_dev(li2, "class", "items-center p-6 m-8 bg-white rounded-lg shadow-purple");
    			add_location(li2, file$2, 23, 10, 896);
    			attr_dev(ul, "class", "w-auto text-2xl text-blue-900 font-Poppins");
    			add_location(ul, file$2, 16, 8, 475);
    			attr_dev(div1, "class", "self-center w-full justify-self-center");
    			add_location(div1, file$2, 15, 6, 414);
    			attr_dev(img0, "class", "object-cover mb-6 rounded shadow-purple h-28 sm:h-48 xl:h-56 w-28 sm:w-48 xl:w-56");
    			if (img0.src !== (img0_src_value = "./img/xbar-menu-preview.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "xbar");
    			add_location(img0, file$2, 31, 12, 1235);
    			attr_dev(img1, "class", "object-cover w-20 h-20 rounded shadow-purple sm:h-32 xl:h-40 sm:w-32 xl:w-40");
    			if (img1.src !== (img1_src_value = "./img/xbar-website-preview.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "xbar");
    			add_location(img1, file$2, 34, 12, 1417);
    			attr_dev(div2, "class", "flex flex-col items-end px-3");
    			add_location(div2, file$2, 30, 10, 1180);
    			attr_dev(img2, "class", "object-cover w-40 h-40 rounded shadow-purple sm:h-64 xl:h-80 sm:w-64 xl:w-80");
    			if (img2.src !== (img2_src_value = "./img/xbar-menu-preview.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "xbar");
    			add_location(img2, file$2, 38, 12, 1628);
    			attr_dev(div3, "class", "px-3");
    			add_location(div3, file$2, 37, 10, 1597);
    			attr_dev(div4, "class", "flex items-center justify-center -mx-4 lg:pl-8");
    			add_location(div4, file$2, 29, 8, 1109);
    			attr_dev(div5, "class", "w-full mt-8");
    			add_location(div5, file$2, 28, 6, 1075);
    			attr_dev(div6, "class", "flex flex-wrap pb-4 mt-10 xl:flex-nowrap sm:flex-wrap");
    			add_location(div6, file$2, 14, 4, 340);
    			if (img3.src !== (img3_src_value = "https://xbarapp.com/docs/plugins/Dev/Homebrew/brew-services.10m.rb.jpg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "object-cover w-full h-64");
    			attr_dev(img3, "alt", "");
    			add_location(img3, file$2, 47, 10, 2135);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "transition-colors duration-200 text-blue-gray-900 hover:text-deep-purple-accent-700");
    			add_location(a0, file$2, 50, 14, 2395);
    			attr_dev(span0, "class", "text-gray-600");
    			add_location(span0, file$2, 51, 14, 2521);
    			attr_dev(p0, "class", "mb-3 text-xs font-semibold tracking-wide uppercase");
    			add_location(p0, file$2, 49, 12, 2318);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "class", "inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-deep-purple-accent-700");
    			add_location(a1, file$2, 53, 12, 2599);
    			attr_dev(p1, "class", "mb-2 text-gray-700");
    			add_location(p1, file$2, 54, 12, 2761);
    			attr_dev(a2, "href", "/");
    			attr_dev(a2, "class", "inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800");
    			add_location(a2, file$2, 57, 12, 2938);
    			attr_dev(div7, "class", "p-5 border border-t-0");
    			add_location(div7, file$2, 48, 10, 2270);
    			attr_dev(div8, "class", "overflow-hidden bg-white rounded transition-shadow duration-300 shadow-purple");
    			add_location(div8, file$2, 46, 8, 2033);
    			if (img4.src !== (img4_src_value = "https://xbarapp.com/docs/plugins/E-Commerce/Shopibar.15m.js.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "object-cover w-full h-64");
    			attr_dev(img4, "alt", "");
    			add_location(img4, file$2, 61, 10, 3240);
    			attr_dev(a3, "href", "/");
    			attr_dev(a3, "class", "transition-colors duration-200 text-blue-gray-900 hover:text-deep-purple-accent-700");
    			add_location(a3, file$2, 64, 14, 3493);
    			attr_dev(span1, "class", "text-gray-600");
    			add_location(span1, file$2, 65, 14, 3626);
    			attr_dev(p2, "class", "mb-3 text-xs font-semibold tracking-wide uppercase");
    			add_location(p2, file$2, 63, 12, 3416);
    			attr_dev(a4, "href", "/");
    			attr_dev(a4, "class", "inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-deep-purple-accent-700");
    			add_location(a4, file$2, 67, 12, 3704);
    			attr_dev(p3, "class", "mb-2 text-gray-700");
    			add_location(p3, file$2, 68, 12, 3861);
    			attr_dev(a5, "href", "/");
    			attr_dev(a5, "class", "inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800");
    			add_location(a5, file$2, 71, 12, 4038);
    			attr_dev(div9, "class", "p-5 border border-t-0");
    			add_location(div9, file$2, 62, 10, 3368);
    			attr_dev(div10, "class", "overflow-hidden bg-white rounded transition-shadow duration-300 shadow-purple");
    			add_location(div10, file$2, 60, 8, 3138);
    			if (img5.src !== (img5_src_value = "https://xbarapp.com/docs/plugins/Science/people-in-space.6h.js.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "class", "object-cover w-full h-64");
    			attr_dev(img5, "alt", "");
    			add_location(img5, file$2, 75, 10, 4340);
    			attr_dev(a6, "href", "/");
    			attr_dev(a6, "class", "transition-colors duration-200 text-blue-gray-900 hover:text-deep-purple-accent-700");
    			add_location(a6, file$2, 78, 14, 4596);
    			attr_dev(span2, "class", "text-gray-600");
    			add_location(span2, file$2, 79, 14, 4726);
    			attr_dev(p4, "class", "mb-3 text-xs font-semibold tracking-wide uppercase");
    			add_location(p4, file$2, 77, 12, 4519);
    			attr_dev(a7, "href", "/");
    			attr_dev(a7, "class", "inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-deep-purple-accent-700");
    			add_location(a7, file$2, 81, 12, 4804);
    			attr_dev(p5, "class", "mb-2 text-gray-700");
    			add_location(p5, file$2, 82, 12, 4968);
    			attr_dev(a8, "href", "/");
    			attr_dev(a8, "class", "inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800");
    			add_location(a8, file$2, 85, 12, 5145);
    			attr_dev(div11, "class", "p-5 border border-t-0");
    			add_location(div11, file$2, 76, 10, 4471);
    			attr_dev(div12, "class", "overflow-hidden bg-white rounded transition-shadow duration-300 shadow-purple");
    			add_location(div12, file$2, 74, 8, 4238);
    			attr_dev(div13, "class", "grid gap-8 lg:grid-cols-3 sm:max-w-sm sm:mx-auto lg:max-w-full");
    			add_location(div13, file$2, 45, 6, 1948);
    			attr_dev(div14, "class", "px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20");
    			add_location(div14, file$2, 44, 4, 1838);
    			attr_dev(div15, "class", "flex flex-col w-full ");
    			add_location(div15, file$2, 10, 2, 156);
    			attr_dev(div16, "class", "flex flex-row");
    			add_location(div16, file$2, 6, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div0);
    			mount_component(sidebar, div0, null);
    			append_dev(div16, t0);
    			append_dev(div16, div15);
    			append_dev(div15, h1);
    			append_dev(div15, t2);
    			append_dev(div15, div6);
    			append_dev(div6, div1);
    			append_dev(div1, ul);
    			append_dev(ul, li0);
    			append_dev(li0, h20);
    			append_dev(ul, t4);
    			append_dev(ul, li1);
    			append_dev(li1, h21);
    			append_dev(ul, t6);
    			append_dev(ul, li2);
    			append_dev(li2, h22);
    			append_dev(div6, t8);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, img0);
    			append_dev(div2, t9);
    			append_dev(div2, img1);
    			append_dev(div4, t10);
    			append_dev(div4, div3);
    			append_dev(div3, img2);
    			append_dev(div15, t11);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, div8);
    			append_dev(div8, img3);
    			append_dev(div8, t12);
    			append_dev(div8, div7);
    			append_dev(div7, p0);
    			append_dev(p0, a0);
    			append_dev(p0, t14);
    			append_dev(p0, span0);
    			append_dev(div7, t16);
    			append_dev(div7, a1);
    			append_dev(div7, t18);
    			append_dev(div7, p1);
    			append_dev(div7, t20);
    			append_dev(div7, a2);
    			append_dev(div13, t22);
    			append_dev(div13, div10);
    			append_dev(div10, img4);
    			append_dev(div10, t23);
    			append_dev(div10, div9);
    			append_dev(div9, p2);
    			append_dev(p2, a3);
    			append_dev(p2, t25);
    			append_dev(p2, span1);
    			append_dev(div9, t27);
    			append_dev(div9, a4);
    			append_dev(div9, t29);
    			append_dev(div9, p3);
    			append_dev(div9, t31);
    			append_dev(div9, a5);
    			append_dev(div13, t33);
    			append_dev(div13, div12);
    			append_dev(div12, img5);
    			append_dev(div12, t34);
    			append_dev(div12, div11);
    			append_dev(div11, p4);
    			append_dev(p4, a6);
    			append_dev(p4, t36);
    			append_dev(p4, span2);
    			append_dev(div11, t38);
    			append_dev(div11, a7);
    			append_dev(div11, t40);
    			append_dev(div11, p5);
    			append_dev(div11, t42);
    			append_dev(div11, a8);
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
    			if (detaching) detach_dev(div16);
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
    	let div;
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
    			div = element("div");
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
    			attr_dev(p, "class", "text-sm text-gray-600 mx-5");
    			add_location(p, file$1, 1, 4, 95);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400");
    			add_location(a0, file$1, 6, 8, 314);
    			add_location(li0, file$1, 5, 6, 301);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "class", "text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400");
    			add_location(a1, file$1, 9, 8, 462);
    			add_location(li1, file$1, 8, 6, 449);
    			attr_dev(a2, "href", "/");
    			attr_dev(a2, "class", "text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400");
    			add_location(a2, file$1, 12, 8, 619);
    			add_location(li2, file$1, 11, 6, 606);
    			attr_dev(ul, "class", "flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row mx-5");
    			add_location(ul, file$1, 4, 4, 202);
    			attr_dev(div, "class", "flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row mt-5");
    			add_location(div, file$1, 0, 2, 2);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(div, t1);
    			append_dev(div, ul);
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
    			if (detaching) detach_dev(div);
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
    			attr_dev(div, "class", "container mx-auto");
    			add_location(div, file, 187530, 2, 4417433);
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
