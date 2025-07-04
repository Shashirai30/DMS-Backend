export default function acronym(name = '') {
    const shortName = name.match(/\b(\w)/g)

    if (shortName) {
        return shortName.join('')
    }

    return name
}
//Extracts the first letter of each word from the input string.
//Joins the extracted letters to form an acronym.
//If no words are found, returns the original string.