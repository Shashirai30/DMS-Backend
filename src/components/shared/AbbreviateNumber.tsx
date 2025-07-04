// //jo bade numbers ko abbreviate (short form) mein display karta hai. For example:

// 1,000 ko 1K mein convert karega.

// 1,000,000 ko 1M mein convert karega.
type AbbreviateNumberProps = {
    value: number
}

const AbbreviateNumber = ({ value }: AbbreviateNumberProps) => {
    function formatNumberWithSuffix(number: number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M'
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K'
        } else {
            return number.toFixed(0).toString()
        }
    }

    return <>{formatNumberWithSuffix(value)}</>
}

export default AbbreviateNumber
// //jo bade numbers ko abbreviate (short form) mein display karta hai. For example:

// 1,000 ko 1K mein convert karega.

// 1,000,000 ko 1M mein convert karega.