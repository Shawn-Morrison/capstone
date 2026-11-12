
export async function getStates() {
    try {
        const response = await fetch("./data/states.json");

        if (!response.ok) {
            throw new Error("Unable to load state data");
        }

        const states = await response.json();

        return states;

    } catch (error) {
        console.error("Error loading states:", error);
        return [];
    }
}
