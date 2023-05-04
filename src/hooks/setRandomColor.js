export function setRandomColor(str) {
    const hash = str.split('').reduce((acc, char) => {
        acc = ((acc << 5) - acc) + char.charCodeAt(0);
        return acc & acc;
    }, 0);
    const pinkHue = 330; // pink hue range from 315 to 345
    const purpleHue = 270; // purple hue range from 255 to 285
    const hueRange = 30; // the range of hue variation
    let hue = hash % hueRange;
    if (hue < 0) hue += hueRange;
    if (hash % 2 === 0) {
        hue = pinkHue - hue;
    } else {
        hue = purpleHue + hue;
    }
    const saturation = 75; // set saturation to a fixed value
    const minLightness = 30; // set minimum lightness value
    const maxLightness = 70; // set maximum lightness value
    let lightness = (hash % (maxLightness - minLightness)) + minLightness;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
