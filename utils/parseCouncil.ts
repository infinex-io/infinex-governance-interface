const parseCouncil = (council: "trade" | "ecosystem" | "core-contributor" | "treasury") => {
    switch (council) {
        case "trade":
            return "Trader"
        case "ecosystem":
            return "Ecosystem"
        case "core-contributor":
            return "Core Contributor"
        case "treasury":
            return "Treasury"
    }
}

export default parseCouncil