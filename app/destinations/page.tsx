import StyledPage from "./styledPage"
import SearchBar from "./SearchBar"

//Components
import DestinationGrid from "./DestinationsGrid"

export default function Destination() {
    return(
        <StyledPage>
            <SearchBar />
            <DestinationGrid />
        </StyledPage>
    )
}