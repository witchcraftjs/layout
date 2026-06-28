import type { Point, Size } from "./types/index.js"

export class Settings {
	private _scale = 3
	private _maxInt = 100 * (10 ** 3)
	get scale() { return this._scale }
	set scale(v: number) {
		this._scale = v
		this._maxInt = 100 * (10 ** v)
		this._recalcAll()
	}

	get maxInt() { return this._maxInt }


	private _snapPoint = { x: 0.5, y: 0.5 }
	private _snapPointScaled = { x: Math.round(0.5 * (10 ** 3)), y: Math.round(0.5 * (10 ** 3)) }

	get snapPoint(): Point { return this._snapPoint }
	set snapPoint(v: number | Point) {
		if (typeof v === "number") { this._snapPoint = { x: v, y: v } } else { this._snapPoint = { x: v.x, y: v.y } }
		this._snapPointScaled = this._scalePoint(this._snapPoint)
	}

	get snapPointScaled() { return this._snapPointScaled }


	private _minSize = { width: 10, height: 10 }
	private _minSizeScaled = { width: 10 ** 3, height: 10 ** 3 }

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

	private _collapseSize = { width: 0, height: 0 }
	private _collapseSizeScaled = { width: 0, height: 0 }

	get collapseSize(): Size { return this._collapseSize }
	set collapseSize(v: number | Size) {
		if (typeof v === "number") { this._collapseSize = { width: v, height: v } } else { this._collapseSize = { width: v.width, height: v.height } }
		this._collapseSizeScaled = this._scaleSize(this._collapseSize)
	}

	get collapseSizeScaled(): Size { return this._collapseSizeScaled }


	private _maxPerpendicularLength = { width: 20, height: 20 }
	private _maxPerpendicularLengthScaled = { width: Math.round(20 * (10 ** 3)), height: Math.round(20 * (10 ** 3)) }

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
		this.snapPoint = this._snapPoint
		this.minSize = this._minSize
		this.collapseSize = this._collapseSize
		this.maxPerpendicularLength = this._maxPerpendicularLength
	}

	// ==== px sized, don't require recalc
	zoneSizes = { frameEdgePx: 40, windowEdgePx: 20 }
}

export const settings = new Settings()
