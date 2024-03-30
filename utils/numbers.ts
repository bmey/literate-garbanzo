export const formatNumber = (value: string | number | undefined | null, options?: Intl.NumberFormatOptions | undefined): string => {
    if (value === null || value === undefined) return "-";
    
    const formatter = Intl.NumberFormat(undefined, {
        maximumFractionDigits: options?.maximumFractionDigits || 0,
        minimumFractionDigits: options?.minimumFractionDigits || 0,
    });

    return formatter.format(+value);
}