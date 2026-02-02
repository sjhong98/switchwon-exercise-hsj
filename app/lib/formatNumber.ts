const formatNumber = (number: number, minimumFractionDigits: number = 2, maximumFractionDigits: number = 2) => {
    return number.toLocaleString(undefined, { minimumFractionDigits, maximumFractionDigits });
}

export default formatNumber;