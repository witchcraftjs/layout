import { numberToScaledPercent } from "./helpers/numberToScaledPercent.js"
import type { Point, Size } from "./types/index.js"

export class Settings {
	private initialized = false
	constructor() {
		this.resetToDefaults()
		this.initialized = true
	}

	resetToDefaults() {
		this.scale = 3
		this.snapPoint = 0.5
		this.minSize = 3
		this.collapseSizePx = 15
		this.maxPerpendicularLength = 20
		this.zoneSizes = { frameEdgePx: 40, windowEdgePx: 20 }
		this._recalcAll()
	}

	_zoneSizes!: { frameEdgePx: number, windowEdgePx: number }
	get zoneSizes(): { frameEdgePx: number, windowEdgePx: number } { return this._zoneSizes }
	set zoneSizes(v: number | { frameEdgePx: number, windowEdgePx: number }) {
		if (typeof v === "number") {
			this._zoneSizes = { frameEdgePx: v, windowEdgePx: v }
		} else {
			this._zoneSizes = { frameEdgePx: v.frameEdgePx, windowEdgePx: v.windowEdgePx }
		}
	}

	private _scale!: number
	private _maxInt!: number
	get scale() { return this._scale }
	set scale(v: number) {
		this._scale = v
		this._maxInt = 100 * (10 ** v)
		this._recalcAll()
	}

	get maxInt() { return this._maxInt }


	private _snapPoint!: Point
	private _snapPointScaled!: Point

	get snapPoint(): Point { return this._snapPoint }
	set snapPoint(v: number | Point) {
		if (typeof v === "number") {
			this._snapPoint = { x: v, y: v }
		} else {
			this._snapPoint = { x: v.x, y: v.y }
		}
		this._snapPointScaled = this._scalePoint(this._snapPoint)
	}

	get snapPointScaled() { return this._snapPointScaled }


	private _minSize!: Size
	private _minSizeScaled!: Size

	get minSize(): Size { return this._minSize }
	set minSize(v: number | Size) {
		if (typeof v === "number") {
			this._minSize = { width: v, height: v }
		} else {
			this._minSize = { width: v.width, height: v.height }
		}
		this._minSizeScaled = this._scaleSize(this._minSize)
	}

	get minSizeScaled(): Size { return this._minSizeScaled }

	private _collapseSizePx!: Size

	get collapseSizePx(): Size { return this._collapseSizePx }
	set collapseSizePx(v: number | Size) {
		if (typeof v === "number") {
			this._collapseSizePx = { width: v, height: v }
		} else {
			this._collapseSizePx = { width: v.width, height: v.height }
		}
	}

	getCollapseSizeScaled(win: { pxWidth: number, pxHeight: number }): Size {
		const size = this.collapseSizePx
		return {
			width: win.pxWidth === 0
				? 0
				: numberToScaledPercent(
						typeof size === "number" ? size : size.width,
						win.pxWidth,
						this.maxInt
					),
			height: win.pxHeight === 0
				? 0
				: numberToScaledPercent(
						typeof size === "number" ? size : size.height,
						win.pxHeight,
						this.maxInt
					)
		}
	}

	private _maxPerpendicularLength!: Size
	private _maxPerpendicularLengthScaled!: Size

	get maxPerpendicularLength(): Size { return this._maxPerpendicularLength }
	set maxPerpendicularLength(v: number | Size) {
		if (typeof v === "number") { this._maxPerpendicularLength = { width: v, height: v } } else { this._maxPerpendicularLength = { ...v } }
		this._maxPerpendicularLengthScaled = this._scaleSize(this._maxPerpendicularLength)
	}

	get maxPerpendicularLengthScaled() { return this._maxPerpendicularLengthScaled }


	private _scalePoint(p: Point): Point {
		const m = 10 ** this._scale
		return { x: Math.round(p.x * m), y: Math.round(p.y * m) }
	}

	private _scaleSize(s: Size): Size {
		const m = 10 ** this._scale
		return { width: Math.round(s.width * m), height: Math.round(s.height * m) }
	}

	private _recalcAll() {
		if (!this.initialized) return
		this.snapPoint = this._snapPoint
		this.minSize = this._minSize
		this.collapseSizePx = this._collapseSizePx
		this.maxPerpendicularLength = this._maxPerpendicularLength
	}
}

export const settings = new Settings()
