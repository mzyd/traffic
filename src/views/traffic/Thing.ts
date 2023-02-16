export class Wall {
  color: string
  draw: Function
  w: number
  h: number
  constructor(color: string, draw: Function) {
    this.color = color || '#ccc'
    this.w = window.innerWidth
    this.h = window.innerHeight
    this.draw = draw
  }
}

export class Car {
  color: string
  draw: Function
  w: number
  h: number
  constructor(color: string, draw: Function) {
    this.color = color
    this.w = 100
    this.h = 30
    this.draw = draw
  }
}

export class Road {
  x: number
  y: number
  w: number
  h: number
  color: string
  draw: Function
  // draw: (x: number, y: number, w: number, h: number) => void
  constructor(x: number, y: number, w: number, h: number, draw: Function, color: string) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.color = color || '#605A4C'
    this.draw = draw
  }
}
