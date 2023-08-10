export const reorderList = <T,>(l: T[], start: number, end: number) => {
    if (start < end) return pushListForward([...l], start, end);
    else if (start > end) return pushListBackward([...l], start, end);

    return l;
}

const pushListBackward = <T,>(l: T[], start: number, end: number) => {
    const temp = l[start];

    for (let i = start; i > end; i--) {
        l[i] = l[i - 1];
    }

    l[end] = temp;

    return l;
}


const pushListForward = <T,>(l: T[], start: number, end: number) => {
    const temp = l[start];
    
    for (let i = start; i < end; i++) {
        l[i] = l[i + 1];
    }

    l[end - 1] = temp;

    return l;
}