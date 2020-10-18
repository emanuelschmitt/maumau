export default function random(min: number, max: number): number {
    const difference = max - min;
    return Math.round(Math.random() * difference) + min;
}