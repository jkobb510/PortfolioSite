import { IGatsbyNode } from "../../redux/types";
import { GatsbyGraphQLType } from "../../..";
import { DbQuery } from "../common/query";
import { FiltersCache, FilterValueNullable } from "./indexing";
import { IGraphQLRunnerStats } from "../../query/types";
interface IInputQuery {
    [key: string]: FilterValueNullable | IInputQuery;
}
interface IRunFilterArg {
    gqlType: GatsbyGraphQLType;
    queryArgs: {
        filter: Array<IInputQuery> | undefined;
        sort: {
            fields: Array<string>;
            order: Array<boolean | "asc" | "desc">;
        } | undefined;
    };
    firstOnly: boolean;
    resolvedFields: Record<string, any>;
    nodeTypeNames: Array<string>;
    filtersCache: FiltersCache;
    stats: IGraphQLRunnerStats;
}
/**
 * Given the path of a set of filters, return the sets of nodes that pass the
 * filter.
 * Only nodes of given node types will be considered
 * A fast index is created if one doesn't exist yet so cold call is slower.
 *
 * Note: Not a public API. Exported for tests.
 */
export declare function applyFastFilters(filters: Array<DbQuery>, nodeTypeNames: Array<string>, filtersCache: FiltersCache): Array<IGatsbyNode> | null;
/**
 * Filters and sorts a list of nodes using mongodb-like syntax.
 *
 * @param args raw graphql query filter/sort as an object
 * @property {boolean} args.firstOnly true if you want to return only the first
 *   result found. This will return a collection of size 1. Not a single element
 * @property {{filter?: Object, sort?: Object} | undefined} args.queryArgs
 * @property {FiltersCache} args.filtersCache A cache of indexes where you can
 *   look up Nodes grouped by a FilterCacheKey, which yields a Map which holds
 *   an arr of Nodes for the value that the filter is trying to query against.
 *   This object lives in query/query-runner.js and is passed down runQuery.
 * @returns Collection of results. Collection will be limited to 1
 *   if `firstOnly` is true
 */
export declare function runFastFiltersAndSort(args: IRunFilterArg): Array<IGatsbyNode> | null;
export {};
