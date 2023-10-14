const parseCouncil = (council: "trade" | "ecosystem" | "core-contributor" | "coreContributor" | "treasury") => {
    switch (council) {
        case "trade":
            return "Trader"
        case "ecosystem":
            return "Ecosystem"
        case "core-contributor" || "coreContributor":
            return "Core Contributor"
        case "treasury":
            return "Treasury"
    }
}

export default parseCouncil