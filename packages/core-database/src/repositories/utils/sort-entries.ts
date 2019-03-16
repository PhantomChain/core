import { Database } from "@phantomchain/core-interfaces";
import { orderBy } from "@phantomchain/utils";

export function sortEntries(params: Database.IParameters, entries: any[], defaultValue) {
    const [iteratee, order] = params.orderBy ? params.orderBy.split(":") : defaultValue;

    if (["balance", "voteBalance"].includes(iteratee)) {
        return Object.values(entries).sort((a: any, b: any) => {
            return order === "asc" ? a[iteratee].comparedTo(b[iteratee]) : b[iteratee].comparedTo(a[iteratee]);
        });
    }

    return orderBy(entries, [iteratee], [order as "desc" | "asc"]);
}
