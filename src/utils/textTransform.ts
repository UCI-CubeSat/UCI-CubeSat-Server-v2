export const alternateCase = (text: string) => {
    const chars = text.toLowerCase().split("");
    for (let i = 0; i < chars.length; i += 2) {
        chars[i] = chars[i].toUpperCase();
    }
    return chars.join("");
};