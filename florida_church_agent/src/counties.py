"""Florida county and seed city reference data."""
from __future__ import annotations

from typing import Dict, List

FLORIDA_COUNTIES: List[str] = [
    "Alachua", "Baker", "Bay", "Bradford", "Brevard", "Broward", "Calhoun", "Charlotte",
    "Citrus", "Clay", "Collier", "Columbia", "DeSoto", "Dixie", "Duval", "Escambia",
    "Flagler", "Franklin", "Gadsden", "Gilchrist", "Glades", "Gulf", "Hamilton", "Hardee",
    "Hendry", "Hernando", "Highlands", "Hillsborough", "Holmes", "Indian River", "Jackson",
    "Jefferson", "Lafayette", "Lake", "Lee", "Leon", "Levy", "Liberty", "Madison", "Manatee",
    "Marion", "Martin", "Miami-Dade", "Monroe", "Nassau", "Okaloosa", "Okeechobee", "Orange",
    "Osceola", "Palm Beach", "Pasco", "Pinellas", "Polk", "Putnam", "St. Johns", "St. Lucie",
    "Santa Rosa", "Sarasota", "Seminole", "Sumter", "Suwannee", "Taylor", "Union", "Volusia",
    "Wakulla", "Walton", "Washington"
]

COUNTY_TO_CITIES: Dict[str, List[str]] = {
    "Alachua": ["Gainesville", "Alachua", "High Springs", "Newberry"],
    "Baker": ["Macclenny", "Glen St. Mary"],
    "Bay": ["Panama City", "Panama City Beach", "Lynn Haven"],
    "Brevard": ["Melbourne", "Palm Bay", "Cocoa", "Titusville"],
    "Broward": ["Fort Lauderdale", "Pembroke Pines", "Hollywood", "Coral Springs"],
    "Charlotte": ["Port Charlotte", "Punta Gorda", "Englewood"],
    "Citrus": ["Inverness", "Crystal River", "Homosassa"],
    "Clay": ["Orange Park", "Fleming Island", "Middleburg", "Green Cove Springs"],
    "Collier": ["Naples", "Immokalee", "Marco Island"],
    "Duval": ["Jacksonville", "Atlantic Beach", "Jacksonville Beach"],
    "Escambia": ["Pensacola", "Cantonment"],
    "Hillsborough": ["Tampa", "Brandon", "Plant City", "Riverview"],
    "Lake": ["Clermont", "Leesburg", "Eustis", "Mount Dora"],
    "Lee": ["Fort Myers", "Cape Coral", "Lehigh Acres", "Bonita Springs"],
    "Leon": ["Tallahassee"],
    "Manatee": ["Bradenton", "Lakewood Ranch", "Palmetto"],
    "Marion": ["Ocala", "Dunnellon", "Belleview"],
    "Miami-Dade": ["Miami", "Hialeah", "Miami Gardens", "Homestead"],
    "Orange": ["Orlando", "Winter Park", "Apopka", "Ocoee"],
    "Osceola": ["Kissimmee", "St. Cloud", "Poinciana"],
    "Palm Beach": ["West Palm Beach", "Boca Raton", "Boynton Beach", "Delray Beach"],
    "Pasco": ["New Port Richey", "Dade City", "Land O' Lakes", "Wesley Chapel"],
    "Pinellas": ["St. Petersburg", "Clearwater", "Largo", "Dunedin"],
    "Polk": ["Lakeland", "Winter Haven", "Bartow", "Haines City"],
    "St. Johns": ["St. Augustine", "Ponte Vedra Beach"],
    "St. Lucie": ["Port St. Lucie", "Fort Pierce"],
    "Sarasota": ["Sarasota", "North Port", "Venice"],
    "Seminole": ["Sanford", "Oviedo", "Altamonte Springs"],
    "Volusia": ["Daytona Beach", "Deltona", "DeLand", "Ormond Beach"],
}


def cities_for_county(county: str) -> List[str]:
    """Return seed cities for county, fallback to county seat-style placeholder."""
    return COUNTY_TO_CITIES.get(county, [county])
