"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generic collection class that extends Map and provides array methods
 * @abstract Collection
 * @extends Map
 */
class Collection extends Map {
    /**
     * Convert Map to array
     */
    toArray() {
        return [...this.values()];
    }
    /**
     * Filter values by function
     */
    //@ts-ignore
    filter(callbackFn, thisArg) {
        return this.toArray().filter(callbackFn, thisArg);
    }
    /**
     * Map values by function
     */
    //@ts-ignore
    map(callbackFn, thisArg) {
        return this.toArray().map(callbackFn, thisArg);
    }
    /**
     * Reduce values by function
     */
    //@ts-ignore
    reduce(callbackFn, currentIndex) {
        return this.toArray().reduce(callbackFn, currentIndex);
    }
    /**
     * Find values by function
     */
    //@ts-ignore
    find(predicate, thisArg) {
        return this.toArray().find(predicate, thisArg);
    }
}
exports.default = Collection;
