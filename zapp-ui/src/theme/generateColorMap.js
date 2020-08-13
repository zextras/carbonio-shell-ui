import { map, reduce } from 'lodash';

export default function generateColorMap(palette = {}, options) {
    return populateValues(
      populateKeys(
        palette.light || {},
        palette.dark || {},
        options || {}
        ) || { light: {}, dark: {}},
      options || {}
      );
};

function populateKeys(light, dark, options) {
    return {
        dark: {
            ...dark,
            ...reduce(
                light,
                (acc, color, key) => ({
                    ...acc,
                    [key]: dark[key] || {
                        regular: darkRegular(hexToHSL(color.regular), options)
                    }
                }),
                {}
            )
        },
        light: {
            ...light,
            ...reduce(
                dark,
                (acc, color, key) => ({
                    ...acc,
                    [key]: light[key] || {
                        regular: lightRegular(hexToHSL(color.regular), options)
                    }
                }),
                {}
            )
        }
    };
}

function populateValues(partial, options) {
    return {
        light: reduce(
            partial.light,
            (acc, color, name) => ({
                ...acc,
                [name]: {
                    regular: color.regular,
                    hover: color.hover || lightHover(hexToHSL(color.regular), options),
                    active: color.active || lightActive(hexToHSL(color.regular), options),
                    focus: color.focus || lightFocus(hexToHSL(color.regular), options),
                    disabled: color.disabled || lightDisabled(hexToHSL(color.regular), options),
                }
            }),
            {}
        ),
        dark: reduce(
            partial.dark,
            (acc, color, name) => ({
                ...acc,
                [name]: {
                    regular: color.regular,
                    hover: color.hover || darkHover(hexToHSL(color.regular), options),
                    active: color.active || darkActive(hexToHSL(color.regular), options),
                    focus: color.focus || darkFocus(hexToHSL(color.regular), options),
                    disabled: color.disabled || darkDisabled(hexToHSL(color.regular), options),
                }
            }),
            {}
        )
    }
}

function lightRegular({ h, s, l }, options) {
    return HSLToHex(
      h,
      s,
      limit( 100 - (options.dark || 10) - l)
    );
}
function lightHover({ h, s, l }, options) {
    return HSLToHex(
      h,
      s,
      limit( l - (options.hover || 10))
    );
}
function lightActive({ h, s, l }, options) {
    return HSLToHex(
      h,
      s,
      limit(  l - (options.active || 15))
    );
}
function lightFocus({ h, s, l }, options) {
    return HSLToHex(
      h,
      s,
      limit( l - (options.focus || 10))
    );
}
function lightDisabled({ h, s, l }, options) {
    return HSLToHex(
      h,
      s,
      limit(l, options.disabledLight || 80)
    );
}
function darkRegular({ h, s, l }, options) {
    return HSLToHex(
      h,
      s,
      limit( 100 + (options.dark || 10) - l )
    );
}
function darkHover({ h, s, l }, options) {
    return HSLToHex(
      h,
      s,
      limit( l + (options.hover || 10))
    );
}
function darkActive({ h, s, l }, options) {
    return HSLToHex(
      h,
      s,
      limit( l + (options.active || 15))
    );
}
function darkFocus({ h, s, l }, options) {
    return HSLToHex(
      h,
      s,
      limit( l + (options.focus || 10))
    );
}
function darkDisabled({ h, s, l }, options) {
    return HSLToHex(
      h,
      s < 30 ? s : limit(s - options.disabledDark || 30, options.disabledDark || 30),
      l < 30 ? l : limit(l - options.disabled || 30, options.disabledDark || 30)
    );
}

function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length === 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length === 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta === 0)
        h = 0;
    else if (cmax === r)
        h = ((g - b) / delta) % 6;
    else if (cmax === g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
}

function HSLToHex(h,s,l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);

    // Prepend 0s, if necessary
    if (r.length === 1)
        r = "0" + r;
    if (g.length === 1)
        g = "0" + g;
    if (b.length === 1)
        b = "0" + b;

    return "#" + r + g + b;
}

function limit(n, m = 0, M = 100) {
    return Math.min(M, Math.max(m, n));
}
