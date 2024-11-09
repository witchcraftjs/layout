import { getVisualEdgeCss } from "./getVisualEdgeCss.js"

import {
	type Edge,
	type EdgeCss
} from "../types/index.js"


export function getVisualEdgesCss(
	edges: Edge[],
	opts: Parameters<typeof getVisualEdgeCss>[1] = {}
): EdgeCss[] {
	return edges.map(edge => getVisualEdgeCss(edge, opts))
}
