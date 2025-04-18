import { isArray } from "@alanscodelog/utils/isArray"

import { cloneFrame } from "./cloneFrame.js"

import type { LayoutFrame } from "../types/index.js"

export function cloneFrames<T extends Record<string, LayoutFrame> | LayoutFrame[]>(frames: T): T {
	const framesIsArray = isArray(frames)
	const clone: any = framesIsArray ? [] : {}
	if (framesIsArray) {
		for (const frame of frames) {
			clone.push(cloneFrame(frame))
		}
	} else {
		for (const id of Object.keys(frames)) {
			clone[id] = cloneFrame(frames[id]!)
		}
	}
	return clone
}
