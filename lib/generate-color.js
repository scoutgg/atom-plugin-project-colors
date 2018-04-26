'use babel'

import randomColor from 'randomcolor'

export function generateColor(bw = true) {
  let invertColor = (hex, bw) => {
    if(hex.indexOf('#') === 0) {
      hex = hex.slice(1)
    }
    if(hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    if(hex.length !== 6) {
      throw new Error('Invalid HEX color.')
    }
    let r = parseInt(hex.slice(0, 2), 16)
    let g = parseInt(hex.slice(2, 4), 16)
    let b = parseInt(hex.slice(4, 6), 16)
    if(bw) {
      return (r * 0.299 + g * 0.587 + b * 0.114) > 186
      ? '#000000'
      : '#FFFFFF'
    }
    r = (255 - r).toString(16)
    g = (255 - g).toString(16)
    b = (255 - b).toString(16)
    return "#" + padZero(r) + padZero(g) + padZero(b)
  }

  let padZero = (str, len) => {
    len = len || 2
    let zeros = new Array(len).join('0')
    return (zeros + str).slice(-len)
  }

  let random = randomColor({
    luminosity: 'dark',
    format: 'rgba',
    alpha: 0.5,
  })

  return {
    backgroundColor: random,
    color: '#FFFFFF',
  }
}

export function shadeColor(color, percent) {
  var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
  return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
