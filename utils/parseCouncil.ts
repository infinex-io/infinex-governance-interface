const parseCouncil = (council: "trade" | "ecosystem" | "core-contributor" | "coreContributor" | "treasury") => {
    switch (council.toLowerCase()) {
        case "trade":
            return "Trader"
        case "ecosystem":
            return "Ecosystem"
        case "core-contributor":
            return "Core Contributor"
        case "corecontributor":
            return "Core Contributor"
        case "treasury":
            return "Treasury"
    }
}

export default parseCouncil