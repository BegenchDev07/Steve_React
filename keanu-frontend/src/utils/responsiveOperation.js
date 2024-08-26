import presetWidths from './presetWidths.json';

const breakpoints = presetWidths.breakpoints;
const binNumbers = presetWidths.binNumbers;

export const calBinNum = (width) => {
    if (width < breakpoints.small) {
        return binNumbers.small;
    } else if (width < breakpoints.medium) {
        return binNumbers.medium;
    } else if (width < breakpoints.large) {
        return binNumbers.large;
    } else {
        return binNumbers.extraLarge;
    }
};